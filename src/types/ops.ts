// Faith Commune Event IT & Operations Command Center (ApexOps / FC-Ops)
// Enterprise Multi-App Event Management Ecosystem Types

export type OpsRole = 
  | 'director'      // Super Admin: full access to all apps and financials
  | 'gate_lead'     // Scanner & Gate Kiosk Lead
  | 'usher'         // Crowd Flow & Floor Coordinator
  | 'parking'       // Parking & Traffic Marshall
  | 'vip'           // VIP, Minister & Performer Liaison
  | 'stalls'        // Stall & Commercial Vendor Manager
  | 'safety'        // Emergency, Medical & Security Lead
  | 'media';        // AV, Media & Production Lead

export type OpsAppId = 
  | 'war-room'
  | 'scanner'
  | 'crew'
  | 'incidents'
  | 'parking'
  | 'vip'
  | 'stalls'
  | 'crm'
  | 'sponsors';

export type GateId = 'gate-1' | 'gate-2' | 'gate-3-vip' | 'gate-4-logistics';

export interface GateInfo {
  id: GateId;
  name: string;
  description: string;
  targetAudience: string;
  recommendedLanes: number;
}

export const EVENT_GATES: GateInfo[] = [
  {
    id: 'gate-1',
    name: 'Gate 1 - North Main Arch',
    description: 'Primary public pedestrian entry directly facing main avenue',
    targetAudience: 'General Public & Youth Attendees',
    recommendedLanes: 3
  },
  {
    id: 'gate-2',
    name: 'Gate 2 - South Ground Gate',
    description: 'Secondary general entry adjacent to 4-wheeler parking zone',
    targetAudience: 'General Public from Parking Lot',
    recommendedLanes: 2
  },
  {
    id: 'gate-3-vip',
    name: 'Gate 3 - VIP & Minister Gate',
    description: 'Direct vehicle drop-off and backstage green room access',
    targetAudience: 'Guest Pastors, Speakers, Headliner Singers, Sponsors',
    recommendedLanes: 1
  },
  {
    id: 'gate-4-logistics',
    name: 'Gate 4 - Vendor & Logistics Gate',
    description: 'Rear service road access for commercial stalls, sound/lighting trucks',
    targetAudience: 'Stall Vendors, AV Tech Crew, Food Caterers',
    recommendedLanes: 1
  }
];

export interface OpsUserSession {
  role: OpsRole | 'volunteer';
  isDirector: boolean;
  displayName: string;
  volunteerCode?: string;
  phone?: string;
  department?: string;
  assignedRole?: string;
  assignedApp: OpsAppId;
  assignedZone: string;
  assignedGate?: GateId;
  token: string;
  loginTime: string;
}

// 1. Attendees & Tickets
export interface AttendeeRecord {
  id: string;
  ticketId: string;
  name: string;
  email: string;
  phone: string;
  ageGroup: string;
  denomination: string;
  homeChurch?: string;
  passCount: number;
  checkedIn: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
  gate?: GateId;
  interests?: string[]; // e.g. ['worship-music', 'tech-av', 'volunteer', 'prayer']
  isVolunteerOptIn?: boolean;
  notes?: string;
  registeredAt: string;
}

// 2. Volunteers & Crew
export type VolunteerDepartment = 
  | 'Gate Security & Scanning'
  | 'Ushers & Crowd Flow'
  | 'Stage, AV & Production'
  | 'VIP & Minister Hospitality'
  | 'Emergency & Medical First-Aid'
  | 'Stalls & Market Coordination'
  | 'Parking & Ground Traffic'
  | 'Media, Photo & Broadcast';

export type ShiftType = 'Morning Setup (10:00 - 14:00)' | 'Main Event Peak (14:00 - 21:00)' | 'Teardown & Security (21:00 - 23:30)' | 'All Day Core';

export interface VolunteerMember {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  email?: string;
  department: VolunteerDepartment;
  role: string;
  isLead: boolean;
  shift: ShiftType;
  checkedIn: boolean;
  checkedInAt?: string;
  emergencyContact?: string;
  assignedZone?: string;
  assignedApp?: OpsAppId;
}

// 3. Incidents & Safety
export type IncidentPriority = 'P1-CRITICAL' | 'P2-HIGH' | 'P3-MEDIUM' | 'P4-LOW';
export type IncidentCategory = 'medical' | 'crowd' | 'technical' | 'security' | 'facility' | 'lost_found';
export type IncidentStatus = 'open' | 'investigating' | 'resolved';

export interface IncidentRecord {
  id: string;
  title: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  location: string;
  description: string;
  status: IncidentStatus;
  reportedBy: string;
  assignedTo?: string;
  reportedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

// 4. Parking & Traffic Hub (4-Acre School Ground)
export interface ParkingZone {
  id: 'zone-a' | 'zone-b' | 'zone-vip' | 'zone-bus';
  name: string;
  vehicleType: '4-Wheelers (Cars/SUVs)' | '2-Wheelers (Bikes/Scooters)' | 'VIP & Ministry Vehicles' | 'Buses & Shuttles';
  capacity: number;
  currentCount: number;
  marshalsAssigned: string[];
  status: 'available' | 'near-capacity' | 'full' | 'closed';
}

// 5. VIP, Speakers & Performers
export type VipStatus = 'expected' | 'in-transit' | 'in-green-room' | 'backstage-ready' | 'on-stage' | 'completed';

export interface VipGuest {
  id: string;
  name: string;
  role: 'Guest Speaker' | 'Keynote Pastor' | 'Headliner Worship Band' | 'Guest Singer' | 'Dignitary';
  churchOrOrg: string;
  scheduledArrivalTime: string;
  soundcheckTime?: string;
  stageTime: string;
  escortVolunteerName: string;
  escortPhone: string;
  greenRoomId: string;
  dietaryNotes?: string;
  status: VipStatus;
}

// 6. Stalls & Commercial Marketplace
export type StallCategory = 'clothing' | 'food-eateries' | 'jewellery' | 'books-merch' | 'services';
export type PaymentStatus = 'paid' | 'partial' | 'pending';

export interface CommercialStall {
  id: string;
  stallNumber: string; // A1, A2, B1, etc.
  businessName: string;
  category: StallCategory;
  contactPerson: string;
  phone: string;
  rentAmount: number;
  paymentStatus: PaymentStatus;
  powerRequiredKw: number;
  powerInspected: boolean;
  fireSafetyCleared: boolean;
  vendorPassesIssued: number;
  status: 'setup' | 'open' | 'closed';
  notes?: string;
}

// 7. Sponsors & Brand Marketing
export type SponsorTier = 'Title Sponsor' | 'Platinum' | 'Gold' | 'Community Partner';

export interface SponsorDeliverable {
  id: string;
  task: string;
  completed: boolean;
  assignedTeam: string;
  proofUrl?: string;
}

export interface SponsorRecord {
  id: string;
  brandName: string;
  tier: SponsorTier;
  contactPerson: string;
  contactPhone: string;
  deliverables: SponsorDeliverable[];
  notes?: string;
}

// 8. Broadcast Notice
export interface BroadcastAlert {
  id: string;
  message: string;
  targetAudience: 'all' | 'gate' | 'ushers' | 'parking' | 'security' | 'medical';
  urgency: 'normal' | 'urgent' | 'emergency';
  sentBy: string;
  sentAt: string;
}

// Neon Database Connection Configuration
export interface DatabaseConfig {
  connectionString: string;
  isConnected: boolean;
  isCloudMode: boolean;
  lastSyncTime?: string;
  pendingSyncCount: number;
}
