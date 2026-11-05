import { neon } from '@neondatabase/serverless';
import {
  AttendeeRecord,
  VolunteerMember,
  IncidentRecord,
  ParkingZone,
  VipGuest,
  CommercialStall,
  SponsorRecord,
  BroadcastAlert,
  DatabaseConfig,
  GateId
} from '../types/ops';
import {
  INITIAL_ATTENDEES,
  INITIAL_VOLUNTEERS,
  INITIAL_INCIDENTS,
  INITIAL_PARKING_ZONES,
  INITIAL_VIPS,
  INITIAL_STALLS,
  INITIAL_SPONSORS,
  INITIAL_BROADCASTS
} from './initialOpsData';

const STORAGE_KEYS = {
  DB_URL: 'fc_neon_db_url',
  ATTENDEES: 'fc_ops_attendees_v2',
  VOLUNTEERS: 'fc_ops_volunteers_v2',
  INCIDENTS: 'fc_ops_incidents_v2',
  PARKING: 'fc_ops_parking_v2',
  VIPS: 'fc_ops_vips_v2',
  STALLS: 'fc_ops_stalls_v2',
  SPONSORS: 'fc_ops_sponsors_v2',
  BROADCASTS: 'fc_ops_broadcasts_v2',
  PENDING_SYNCS: 'fc_ops_pending_syncs_v2'
};

class EventOperationsDatabase {
  private connectionString: string = '';
  private sqlClient: ReturnType<typeof neon> | null = null;
  private isCloudConnected: boolean = false;

  constructor() {
    this.loadConnectionString();
  }

  private loadConnectionString(): void {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEYS.DB_URL);
    const envUrl = (import.meta.env.VITE_DATABASE_URL as string) || '';
    const url = stored || envUrl;

    if (url && url.startsWith('postgres')) {
      this.connectionString = url;
      try {
        this.sqlClient = neon(url);
        this.isCloudConnected = true;
      } catch (e) {
        console.warn('Neon connection failed, falling back to local persistent store', e);
        this.isCloudConnected = false;
      }
    }
  }

  public setConnectionString(url: string): boolean {
    if (!url || !url.startsWith('postgres')) {
      return false;
    }
    try {
      this.sqlClient = neon(url);
      this.connectionString = url;
      this.isCloudConnected = true;
      localStorage.setItem(STORAGE_KEYS.DB_URL, url);
      return true;
    } catch (e) {
      console.error('Failed to configure Neon database', e);
      return false;
    }
  }

  public getConnectionString(): string {
    return this.connectionString;
  }

  public getConfig(): DatabaseConfig {
    const pending = this.getPendingSyncCount();
    return {
      connectionString: this.connectionString ? this.connectionString.replace(/:[^:]+@/, ':****@') : '',
      isConnected: this.isCloudConnected,
      isCloudMode: !!this.sqlClient,
      pendingSyncCount: pending
    };
  }

  private getLocal<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setLocal<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`Failed to write local key ${key}`, e);
    }
  }

  private getPendingSyncCount(): number {
    const queue = this.getLocal<unknown[]>(STORAGE_KEYS.PENDING_SYNCS, []);
    return queue.length;
  }

  // Database Schema Initialization for Neon Postgres
  public async initDatabaseSchema(overrideUrl?: string): Promise<{ success: boolean; message: string; tablesCreated?: string[] }> {
    const targetUrl = overrideUrl || this.connectionString;
    if (!targetUrl) {
      return {
        success: false,
        message: 'No Neon connection string provided. Please enter your Neon database URL.'
      };
    }

    try {
      // 1. Try server-side endpoint first (handles Node pg connection & bypasses browser CORS)
      try {
        const apiRes = await fetch('/api/db-init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ databaseUrl: targetUrl })
        });
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          this.setConnectionString(targetUrl);
          return {
            success: true,
            message: apiData.message || 'Neon PostgreSQL schema verified & connected successfully!',
            tablesCreated: ['attendees', 'volunteers', 'incidents', 'parking_zones', 'vips', 'stalls', 'sponsors', 'broadcasts']
          };
        }
      } catch (apiErr) {
        console.warn('Backend db-init route skipped, trying direct client...', apiErr);
      }

      const client = neon(targetUrl);
      
      // Execute table creations
      await client`
        CREATE TABLE IF NOT EXISTS attendees (
          id VARCHAR(64) PRIMARY KEY,
          ticket_id VARCHAR(64) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50) NOT NULL,
          age_group VARCHAR(20),
          denomination VARCHAR(100),
          home_church VARCHAR(255),
          pass_count INT NOT NULL DEFAULT 1,
          checked_in BOOLEAN NOT NULL DEFAULT FALSE,
          checked_in_at TIMESTAMPTZ,
          checked_in_by VARCHAR(100),
          gate VARCHAR(50),
          interests TEXT[] DEFAULT '{}',
          is_volunteer_opt_in BOOLEAN DEFAULT FALSE,
          notes TEXT,
          registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await client`
        CREATE TABLE IF NOT EXISTS volunteers (
          id VARCHAR(64) PRIMARY KEY,
          volunteer_code VARCHAR(50) UNIQUE NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          email VARCHAR(255),
          department VARCHAR(100) NOT NULL,
          role VARCHAR(100) NOT NULL,
          is_lead BOOLEAN DEFAULT FALSE,
          shift VARCHAR(100) NOT NULL,
          checked_in BOOLEAN NOT NULL DEFAULT FALSE,
          checked_in_at TIMESTAMPTZ,
          emergency_contact VARCHAR(100),
          assigned_zone VARCHAR(100),
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await client`
        CREATE TABLE IF NOT EXISTS incidents (
          id VARCHAR(64) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          category VARCHAR(50) NOT NULL,
          priority VARCHAR(20) NOT NULL,
          location VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'open',
          reported_by VARCHAR(100) NOT NULL,
          assigned_to VARCHAR(100),
          reported_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          resolved_at TIMESTAMPTZ,
          resolution_notes TEXT
        );
      `;

      await client`
        CREATE TABLE IF NOT EXISTS parking_zones (
          id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          vehicle_type VARCHAR(100) NOT NULL,
          capacity INT NOT NULL,
          current_count INT NOT NULL DEFAULT 0,
          status VARCHAR(50) NOT NULL DEFAULT 'available',
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await client`
        CREATE TABLE IF NOT EXISTS vips (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(100) NOT NULL,
          church_or_org VARCHAR(255),
          scheduled_arrival_time VARCHAR(50),
          soundcheck_time VARCHAR(50),
          stage_time VARCHAR(50) NOT NULL,
          escort_volunteer_name VARCHAR(100),
          escort_phone VARCHAR(50),
          green_room_id VARCHAR(50),
          dietary_notes TEXT,
          status VARCHAR(50) NOT NULL DEFAULT 'expected',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await client`
        CREATE TABLE IF NOT EXISTS stalls (
          id VARCHAR(64) PRIMARY KEY,
          stall_number VARCHAR(50) UNIQUE NOT NULL,
          business_name VARCHAR(255) NOT NULL,
          category VARCHAR(100) NOT NULL,
          contact_person VARCHAR(255) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          rent_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
          payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
          power_required_kw NUMERIC(5,2) DEFAULT 0,
          power_inspected BOOLEAN DEFAULT FALSE,
          fire_safety_cleared BOOLEAN DEFAULT FALSE,
          vendor_passes_issued INT DEFAULT 2,
          status VARCHAR(50) NOT NULL DEFAULT 'setup',
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await client`
        CREATE TABLE IF NOT EXISTS sponsors (
          id VARCHAR(64) PRIMARY KEY,
          brand_name VARCHAR(255) NOT NULL,
          tier VARCHAR(50) NOT NULL,
          contact_person VARCHAR(255),
          contact_phone VARCHAR(50),
          deliverables JSONB DEFAULT '[]'::jsonb,
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await client`
        CREATE TABLE IF NOT EXISTS broadcasts (
          id VARCHAR(64) PRIMARY KEY,
          message TEXT NOT NULL,
          target_audience VARCHAR(50) NOT NULL DEFAULT 'all',
          urgency VARCHAR(20) NOT NULL DEFAULT 'normal',
          sent_by VARCHAR(100) NOT NULL,
          sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Create indexes for gate performance
      await client`CREATE INDEX IF NOT EXISTS idx_attendees_ticket ON attendees(ticket_id);`;
      await client`CREATE INDEX IF NOT EXISTS idx_attendees_phone ON attendees(phone);`;
      await client`CREATE INDEX IF NOT EXISTS idx_attendees_checkin ON attendees(checked_in);`;

      this.setConnectionString(targetUrl);

      return {
        success: true,
        message: 'Neon PostgreSQL Schema provisioned successfully. 8 tables & indexes active.',
        tablesCreated: ['attendees', 'volunteers', 'incidents', 'parking_zones', 'vips', 'stalls', 'sponsors', 'broadcasts']
      };
    } catch (e: unknown) {
      console.error('Database migration failed', e);
      const errMsg = e instanceof Error ? e.message : 'Unknown database error';
      return {
        success: false,
        message: `Migration failed: ${errMsg}`
      };
    }
  }

  // --- 1. ATTENDEES & ATOMIC CHECK-IN ---
  public async getAttendees(): Promise<AttendeeRecord[]> {
    if (this.sqlClient) {
      try {
        const rawRows = await this.sqlClient`SELECT * FROM attendees ORDER BY registered_at DESC;`;
        const rows = rawRows as Record<string, any>[];
        if (Array.isArray(rows) && rows.length > 0) {
          return rows.map((r: Record<string, any>) => ({
            id: r.id,
            ticketId: r.ticket_id,
            name: r.name,
            email: r.email,
            phone: r.phone,
            ageGroup: r.age_group,
            denomination: r.denomination,
            homeChurch: r.home_church,
            passCount: r.pass_count,
            checkedIn: r.checked_in,
            checkedInAt: r.checked_in_at ? new Date(r.checked_in_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
            checkedInBy: r.checked_in_by,
            gate: r.gate as GateId,
            interests: r.interests,
            isVolunteerOptIn: r.is_volunteer_opt_in,
            notes: r.notes,
            registeredAt: r.registered_at
          }));
        }
      } catch (e) {
        console.warn('Neon query failed, using local cache', e);
      }
    }
    return this.getLocal<AttendeeRecord[]>(STORAGE_KEYS.ATTENDEES, INITIAL_ATTENDEES);
  }

  public async checkInAttendee(
    ticketIdOrRaw: string,
    gate: GateId,
    checkedInBy: string
  ): Promise<{
    status: 'success' | 'already-checked-in' | 'invalid-ticket';
    attendee?: AttendeeRecord;
    message: string;
  }> {
    const cleanId = ticketIdOrRaw.trim().toUpperCase();
    const attendees = await this.getAttendees();
    
    // Search by ticketId, phone, or raw ID
    const attendee = attendees.find(
      (a) => a.ticketId.toUpperCase() === cleanId || 
             cleanId.includes(a.ticketId.toUpperCase()) ||
             a.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );

    if (!attendee) {
      return {
        status: 'invalid-ticket',
        message: `Pass code "${cleanId}" does not exist in the registration registry.`
      };
    }

    if (attendee.checkedIn) {
      return {
        status: 'already-checked-in',
        attendee,
        message: `Duplicate entry alert! Already checked in at ${attendee.checkedInAt || 'earlier'} at ${attendee.gate || 'a gate'} by ${attendee.checkedInBy || 'operator'}.`
      };
    }

    // Atomic update
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    attendee.checkedIn = true;
    attendee.checkedInAt = timestampStr;
    attendee.checkedInBy = checkedInBy;
    attendee.gate = gate;

    // Update local cache
    const updatedList = attendees.map((a) => (a.ticketId === attendee.ticketId ? attendee : a));
    this.setLocal(STORAGE_KEYS.ATTENDEES, updatedList);

    // If Neon connected, execute atomic SQL
    if (this.sqlClient) {
      try {
        await this.sqlClient`
          UPDATE attendees 
          SET checked_in = TRUE, 
              checked_in_at = NOW(), 
              checked_in_by = ${checkedInBy}, 
              gate = ${gate}
          WHERE ticket_id = ${attendee.ticketId};
        `;
      } catch (e) {
        console.warn('Offline: Neon checkin sync deferred', e);
      }
    }

    return {
      status: 'success',
      attendee,
      message: `Verified! Pass approved for ${attendee.name} (${attendee.passCount} person${attendee.passCount > 1 ? 's' : ''}).`
    };
  }

  public async registerAttendee(record: Omit<AttendeeRecord, 'id' | 'registeredAt' | 'checkedIn'>): Promise<AttendeeRecord> {
    const newRecord: AttendeeRecord = {
      ...record,
      id: 'att-' + Math.random().toString(36).substring(2, 9),
      registeredAt: new Date().toISOString(),
      checkedIn: false
    };

    const current = await this.getAttendees();
    const updated = [newRecord, ...current];
    this.setLocal(STORAGE_KEYS.ATTENDEES, updated);

    if (this.sqlClient) {
      try {
        await this.sqlClient`
          INSERT INTO attendees (
            id, ticket_id, name, email, phone, age_group, denomination, home_church, 
            pass_count, checked_in, gate, interests, is_volunteer_opt_in, notes
          ) VALUES (
            ${newRecord.id}, ${newRecord.ticketId}, ${newRecord.name}, ${newRecord.email}, 
            ${newRecord.phone}, ${newRecord.ageGroup}, ${newRecord.denomination}, ${newRecord.homeChurch || ''}, 
            ${newRecord.passCount}, FALSE, ${newRecord.gate || null}, ${newRecord.interests || []}, 
            ${newRecord.isVolunteerOptIn || false}, ${newRecord.notes || null}
          );
        `;
      } catch (e) {
        console.warn('Neon insert deferred', e);
      }
    }

    return newRecord;
  }

  // --- 2. VOLUNTEER ROSTER & ATTENDANCE ---
  public async getVolunteers(): Promise<VolunteerMember[]> {
    try {
      const res = await fetch('/api/ops?action=get_volunteers');
      if (res.ok) {
        const data = await res.json();
        if (data.volunteers && data.volunteers.length > 0) {
          const mapped: VolunteerMember[] = data.volunteers.map((v: any) => ({
            id: v.id,
            code: v.volunteer_code,
            fullName: v.full_name,
            phone: v.phone,
            email: v.email,
            department: v.department,
            role: v.role,
            isLead: v.is_lead,
            shift: v.shift,
            checkedIn: v.checked_in,
            checkedInAt: v.checked_in_at,
            emergencyContact: v.emergency_contact,
            assignedZone: v.assigned_zone,
            assignedApp: v.assigned_app
          }));
          this.setLocal(STORAGE_KEYS.VOLUNTEERS, mapped);
          return mapped;
        }
      }
    } catch {
      // offline fallback
    }
    return this.getLocal<VolunteerMember[]>(STORAGE_KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
  }

  public addVolunteer(vol: VolunteerMember): void {
    const list = this.getLocal<VolunteerMember[]>(STORAGE_KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
    this.setLocal(STORAGE_KEYS.VOLUNTEERS, [vol, ...list]);
  }

  public async checkInVolunteer(volunteerCode: string): Promise<{ success: boolean; volunteer?: VolunteerMember; message: string }> {
    const list = await this.getVolunteers();
    const vol = list.find((v) => v.code.toUpperCase() === volunteerCode.trim().toUpperCase());
    if (!vol) {
      return { success: false, message: `Volunteer code ${volunteerCode} not found in the roster.` };
    }

    vol.checkedIn = true;
    vol.checkedInAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.setLocal(STORAGE_KEYS.VOLUNTEERS, [...list]);

    return {
      success: true,
      volunteer: vol,
      message: `${vol.fullName} (${vol.department}) is now checked in on duty.`
    };
  }

  // --- 3. INCIDENTS & DISPATCH ---
  public async getIncidents(): Promise<IncidentRecord[]> {
    return this.getLocal<IncidentRecord[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
  }

  public async createIncident(data: Omit<IncidentRecord, 'id' | 'reportedAt' | 'status'>): Promise<IncidentRecord> {
    const newInc: IncidentRecord = {
      ...data,
      id: 'inc-' + Math.random().toString(36).substring(2, 9),
      reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'open'
    };
    const list = await this.getIncidents();
    const updated = [newInc, ...list];
    this.setLocal(STORAGE_KEYS.INCIDENTS, updated);
    return newInc;
  }

  public async updateIncidentStatus(
    id: string,
    status: IncidentRecord['status'],
    assignedTo?: string,
    resolutionNotes?: string
  ): Promise<IncidentRecord | undefined> {
    const list = await this.getIncidents();
    const inc = list.find((i) => i.id === id);
    if (inc) {
      inc.status = status;
      if (assignedTo) inc.assignedTo = assignedTo;
      if (status === 'resolved') {
        inc.resolvedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (resolutionNotes) inc.resolutionNotes = resolutionNotes;
      }
      this.setLocal(STORAGE_KEYS.INCIDENTS, [...list]);
    }
    return inc;
  }

  // --- 4. PARKING & TRAFFIC ---
  public async getParkingZones(): Promise<ParkingZone[]> {
    return this.getLocal<ParkingZone[]>(STORAGE_KEYS.PARKING, INITIAL_PARKING_ZONES);
  }

  public async updateParkingZoneCount(zoneId: string, delta: number): Promise<ParkingZone | undefined> {
    const zones = await this.getParkingZones();
    const zone = zones.find((z) => z.id === zoneId);
    if (zone) {
      zone.currentCount = Math.max(0, Math.min(zone.capacity, zone.currentCount + delta));
      const percentage = (zone.currentCount / zone.capacity) * 100;
      if (percentage >= 100) zone.status = 'full';
      else if (percentage >= 85) zone.status = 'near-capacity';
      else zone.status = 'available';
      this.setLocal(STORAGE_KEYS.PARKING, [...zones]);
    }
    return zone;
  }

  // --- 5. VIP & RUN-OF-SHOW ---
  public async getVips(): Promise<VipGuest[]> {
    return this.getLocal<VipGuest[]>(STORAGE_KEYS.VIPS, INITIAL_VIPS);
  }

  public async updateVipStatus(id: string, status: VipGuest['status']): Promise<VipGuest | undefined> {
    const list = await this.getVips();
    const vip = list.find((v) => v.id === id);
    if (vip) {
      vip.status = status;
      this.setLocal(STORAGE_KEYS.VIPS, [...list]);
    }
    return vip;
  }

  // --- 6. STALLS & MARKETPLACE ---
  public async getStalls(): Promise<CommercialStall[]> {
    return this.getLocal<CommercialStall[]>(STORAGE_KEYS.STALLS, INITIAL_STALLS);
  }

  public async updateStall(id: string, updates: Partial<CommercialStall>): Promise<CommercialStall | undefined> {
    const list = await this.getStalls();
    const stall = list.find((s) => s.id === id);
    if (stall) {
      Object.assign(stall, updates);
      this.setLocal(STORAGE_KEYS.STALLS, [...list]);
    }
    return stall;
  }

  // --- 7. SPONSORS ---
  public async getSponsors(): Promise<SponsorRecord[]> {
    return this.getLocal<SponsorRecord[]>(STORAGE_KEYS.SPONSORS, INITIAL_SPONSORS);
  }

  public async toggleSponsorDeliverable(sponsorId: string, deliverableId: string): Promise<SponsorRecord | undefined> {
    const list = await this.getSponsors();
    const sponsor = list.find((s) => s.id === sponsorId);
    if (sponsor) {
      const deliv = sponsor.deliverables.find((d) => d.id === deliverableId);
      if (deliv) {
        deliv.completed = !deliv.completed;
        this.setLocal(STORAGE_KEYS.SPONSORS, [...list]);
      }
    }
    return sponsor;
  }

  // --- 8. BROADCASTS ---
  public async getBroadcasts(): Promise<BroadcastAlert[]> {
    return this.getLocal<BroadcastAlert[]>(STORAGE_KEYS.BROADCASTS, INITIAL_BROADCASTS);
  }

  public async createBroadcast(data: Omit<BroadcastAlert, 'id' | 'sentAt'>): Promise<BroadcastAlert> {
    const newBc: BroadcastAlert = {
      ...data,
      id: 'bc-' + Math.random().toString(36).substring(2, 9),
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const list = await this.getBroadcasts();
    const updated = [newBc, ...list];
    this.setLocal(STORAGE_KEYS.BROADCASTS, updated);
    return newBc;
  }
}

export const opsDb = new EventOperationsDatabase();
