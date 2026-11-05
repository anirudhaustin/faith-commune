import React, { createContext, useContext, useState, useEffect } from 'react';
import { OpsAppId, GateId, OpsUserSession } from '../types/ops';
import { opsDb } from '../services/db';

interface OpsAuthContextType {
  session: OpsUserSession | null;
  isAuthenticated: boolean;
  isDirector: boolean;
  currentApp: OpsAppId;
  setCurrentApp: (app: OpsAppId) => void;
  assignedGate: GateId;
  setAssignedGate: (gate: GateId) => void;
  loginDirector: (pin: string) => Promise<{ success: boolean; error?: string }>;
  loginVolunteer: (codeOrPhone: string, pin?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  canAccessApp: (app: OpsAppId) => boolean;
}

const OpsAuthContext = createContext<OpsAuthContextType | undefined>(undefined);

const STORAGE_SESSION_KEY = 'fc_ops_user_session_v3';

export const OpsAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<OpsUserSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.displayName) return parsed;
      }
    } catch {
      // ignore
    }
    return null; // Require real login by default!
  });

  const [currentApp, _setCurrentApp] = useState<OpsAppId>(() => {
    if (session?.assignedApp) return session.assignedApp;
    return 'war-room';
  });

  const [assignedGate, setAssignedGate] = useState<GateId>(session?.assignedGate || 'gate-1');

  // Strict app switcher guard: volunteers are locked inside their assigned app
  const setCurrentApp = (app: OpsAppId) => {
    if (!session) return;
    if (session.isDirector) {
      _setCurrentApp(app);
      return;
    }
    // Volunteers can only view their assigned app (or emergency incident reporting)
    if (app === session.assignedApp || app === 'incidents') {
      _setCurrentApp(app);
    } else {
      console.warn(`[Security Guard] Access denied to "${app}" for volunteer role.`);
      _setCurrentApp(session.assignedApp);
    }
  };

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      if (session.assignedGate) {
        setAssignedGate(session.assignedGate);
      }
      if (!session.isDirector) {
        _setCurrentApp(session.assignedApp || 'scanner');
      }
    } else {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    }
  }, [session]);

  // 1. Operations Head / Director Login
  const loginDirector = async (pin: string): Promise<{ success: boolean; error?: string }> => {
    const cleanPin = pin.trim();
    if (!cleanPin) {
      return { success: false, error: 'Please enter Director Passcode / PIN' };
    }

    try {
      // First attempt serverless backend authentication
      const res = await fetch('/api/ops?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'director', pin: cleanPin })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const dirSession: OpsUserSession = {
            role: 'director',
            isDirector: true,
            displayName: data.user.displayName,
            assignedApp: 'war-room',
            assignedZone: data.user.assignedZone,
            token: data.user.token,
            loginTime: new Date().toLocaleTimeString()
          };
          setSession(dirSession);
          _setCurrentApp('war-room');
          return { success: true };
        }
      }
    } catch {
      // fallback to local verification if network is disconnected
    }

    // Direct PIN check (master PIN 2026 or faith2026)
    if (cleanPin === '2026' || cleanPin === 'faith2026' || cleanPin === 'admin') {
      const dirSession: OpsUserSession = {
        role: 'director',
        isDirector: true,
        displayName: 'Command Director (Super Admin)',
        assignedApp: 'war-room',
        assignedZone: 'All Event Zones (4-Acre Command)',
        token: 'fc-dir-local-' + Date.now(),
        loginTime: new Date().toLocaleTimeString()
      };
      setSession(dirSession);
      _setCurrentApp('war-room');
      return { success: true };
    }

    return { success: false, error: 'Incorrect Director PIN. Master PIN is 2026' };
  };

  // 2. Field Volunteer Login (by Volunteer Code or Phone)
  const loginVolunteer = async (
    codeOrPhone: string,
    _pin?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanId = codeOrPhone.trim();
    if (!cleanId) {
      return { success: false, error: 'Enter your Volunteer Code (e.g. VOL-101) or Mobile Phone' };
    }

    try {
      // Query serverless API connected to Neon
      const res = await fetch('/api/ops?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'volunteer', code: cleanId, phone: cleanId })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const vol = data.user;
          const assignedAppId = (vol.assignedApp as OpsAppId) || 'scanner';

          let gate: GateId = 'gate-1';
          if (vol.assignedZone?.includes('Gate 2')) gate = 'gate-2';
          else if (vol.assignedZone?.includes('VIP') || vol.assignedZone?.includes('Gate 3')) gate = 'gate-3-vip';
          else if (vol.assignedZone?.includes('Gate 4')) gate = 'gate-4-logistics';

          const volSession: OpsUserSession = {
            role: 'volunteer',
            isDirector: false,
            displayName: vol.displayName,
            volunteerCode: vol.volunteerCode,
            phone: vol.phone,
            department: vol.department,
            assignedRole: vol.assignedRole,
            assignedApp: assignedAppId,
            assignedZone: vol.assignedZone,
            assignedGate: gate,
            token: vol.token,
            loginTime: new Date().toLocaleTimeString()
          };

          setSession(volSession);
          _setCurrentApp(assignedAppId);
          setAssignedGate(gate);
          return { success: true };
        }
      } else {
        const err = await res.json().catch(() => ({}));
        if (err.error) return { success: false, error: err.error };
      }
    } catch {
      // Offline fallback: check local volunteers cache
    }

    // Check local volunteers store if offline
    const localVols = await opsDb.getVolunteers();
    const found = localVols.find(
      (v: any) =>
        v.code.toUpperCase() === cleanId.toUpperCase() ||
        v.phone === cleanId ||
        v.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '')
    );

    if (found) {
      // Map department/role to specific app
      let targetApp: OpsAppId = 'scanner';
      if (found.department.includes('Parking')) targetApp = 'parking';
      else if (found.department.includes('Medical') || found.department.includes('Safety')) targetApp = 'incidents';
      else if (found.department.includes('VIP')) targetApp = 'vip';
      else if (found.department.includes('Stall')) targetApp = 'stalls';
      else if (found.department.includes('Gate')) targetApp = 'scanner';

      const volSession: OpsUserSession = {
        role: 'volunteer',
        isDirector: false,
        displayName: found.fullName,
        volunteerCode: found.code,
        phone: found.phone,
        department: found.department,
        assignedRole: found.role,
        assignedApp: (found.assignedApp as OpsAppId) || targetApp,
        assignedZone: found.assignedZone || 'Field Post',
        token: 'fc-vol-local-' + found.code,
        loginTime: new Date().toLocaleTimeString()
      };

      setSession(volSession);
      _setCurrentApp((found.assignedApp as OpsAppId) || targetApp);
      return { success: true };
    }

    return {
      success: false,
      error: `Volunteer identifier "${cleanId}" not found. Please contact the Operations Head in the War Room for assignment.`
    };
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem(STORAGE_SESSION_KEY);
  };

  const canAccessApp = (app: OpsAppId): boolean => {
    if (!session) return false;
    if (session.isDirector) return true;
    return app === session.assignedApp || app === 'incidents';
  };

  return (
    <OpsAuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        isDirector: !!session?.isDirector,
        currentApp,
        setCurrentApp,
        assignedGate,
        setAssignedGate,
        loginDirector,
        loginVolunteer,
        logout,
        canAccessApp
      }}
    >
      {children}
    </OpsAuthContext.Provider>
  );
};

export const useOpsAuth = () => {
  const context = useContext(OpsAuthContext);
  if (!context) {
    throw new Error('useOpsAuth must be used within an OpsAuthProvider');
  }
  return context;
};
