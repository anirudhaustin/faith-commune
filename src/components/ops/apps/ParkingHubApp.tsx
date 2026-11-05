import React, { useState, useEffect } from 'react';
import { opsDb } from '../../../services/db';
import { ParkingZone } from '../../../types/ops';
import { 
  Car, 
  Bike, 
  Bus, 
  Sparkles, 
  Plus, 
  Minus, 
  AlertTriangle, 
  Users 
} from 'lucide-react';

export const ParkingHubApp: React.FC = () => {
  const [zones, setZones] = useState<ParkingZone[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [trafficAlert, setTrafficAlert] = useState<string | null>(null);

  const loadParking = async () => {
    const list = await opsDb.getParkingZones();
    setZones(list);
  };

  useEffect(() => {
    loadParking();
  }, []);

  const handleUpdateCount = async (zoneId: string, delta: number) => {
    setIsUpdating(true);
    const updated = await opsDb.updateParkingZoneCount(zoneId, delta);
    if (updated) {
      if (updated.status === 'full') {
        setTrafficAlert(`ALERT: ${updated.name} has reached 100% capacity! Redirect vehicles to auxiliary layby.`);
      }
      loadParking();
    }
    setIsUpdating(false);
  };

  const totalOccupied = zones.reduce((acc, z) => acc + z.currentCount, 0);
  const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
  const overallPercentage = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  const getVehicleIcon = (type: ParkingZone['vehicleType']) => {
    if (type.includes('4-Wheelers')) return <Car className="w-5 h-5 text-amber-600" />;
    if (type.includes('2-Wheelers')) return <Bike className="w-5 h-5 text-amber-600" />;
    if (type.includes('VIP')) return <Sparkles className="w-5 h-5 text-amber-600" />;
    return <Bus className="w-5 h-5 text-amber-600" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-white border border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-amber-600" /> Ground Parking & Traffic Hub
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-bold">
              4-Acre School Ground Layout
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Vehicle Inflow & Parking Lot Control
          </h1>
          <p className="text-xs text-slate-500">
            Real-time space availability for 4-wheelers, 2-wheelers, VIP convoys, and church buses.
          </p>
        </div>

        {/* Global Capacity Meter */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total Ground Occupancy
            </div>
            <div className="text-2xl font-black text-amber-800">
              {totalOccupied} <span className="text-sm font-semibold text-slate-400">/ {totalCapacity}</span>
            </div>
            <div className="text-[10px] font-bold text-amber-700">{overallPercentage}% Full</div>
          </div>
        </div>
      </div>

      {/* Traffic Alert Banner */}
      {trafficAlert && (
        <div className="p-4 rounded-2xl bg-amber-100 border border-amber-400 text-xs text-amber-900 flex items-center justify-between gap-3 animate-in fade-in shadow-sm">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{trafficAlert}</span>
          </div>
          <button
            onClick={() => setTrafficAlert(null)}
            className="px-3 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 font-bold cursor-pointer"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Parking Zone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone) => {
          const percentage = Math.round((zone.currentCount / zone.capacity) * 100);
          const isFull = percentage >= 100;
          const isNear = percentage >= 85 && !isFull;

          return (
            <div
              key={zone.id}
              className={`p-6 rounded-3xl border transition-all space-y-4 bg-white ${
                isFull
                  ? 'border-amber-500 shadow-[0_8px_30px_rgba(217,119,6,0.15)] ring-1 ring-amber-500/40'
                  : isNear
                  ? 'border-amber-300 shadow-[0_8px_30px_rgba(217,119,6,0.08)]'
                  : 'border-amber-200/80 shadow-[0_8px_30px_rgba(217,119,6,0.06)]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                    {getVehicleIcon(zone.vehicleType)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{zone.name}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{zone.vehicleType}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                    isFull
                      ? 'bg-amber-100 text-amber-900 border-amber-400 font-black'
                      : isNear
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {zone.status.replace('-', ' ')}
                </span>
              </div>

              {/* Progress Bar & Numbers */}
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-black text-slate-900">
                    {zone.currentCount}{' '}
                    <span className="text-sm font-semibold text-slate-400">
                      / {zone.capacity} spots
                    </span>
                  </div>
                  <div className="text-sm font-bold text-amber-700">
                    {percentage}%
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      isFull ? 'bg-amber-600' : isNear ? 'bg-amber-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
              </div>

              {/* Marshals Assigned */}
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold">
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  Parking Marshals On Duty
                </div>
                <div className="font-semibold text-slate-800">
                  {zone.marshalsAssigned.join(' • ')}
                </div>
              </div>

              {/* Quick Entry / Exit Clicker Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateCount(zone.id, -1)}
                  disabled={zone.currentCount <= 0 || isUpdating}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 disabled:opacity-40 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm"
                >
                  <Minus className="w-4 h-4" />
                  <span>Exit (-1)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateCount(zone.id, 1)}
                  disabled={zone.currentCount >= zone.capacity || isUpdating}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Entry (+1)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateCount(zone.id, 5)}
                  disabled={zone.currentCount + 5 > zone.capacity || isUpdating}
                  className="py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-mono font-bold text-xs cursor-pointer shadow-sm"
                  title="Fast entry +5 vehicles"
                >
                  +5
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
