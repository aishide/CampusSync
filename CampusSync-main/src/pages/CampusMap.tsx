import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FLOORS, mockComplaints } from '@/lib/mockData';
import { PriorityBadge, StatusBadge } from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Layers, AlertCircle } from 'lucide-react';

const CampusMap = () => {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const navigate = useNavigate();

  const floor = FLOORS.find(f => f.id === selectedFloor)!;
  const roomComplaints = (room: string) =>
    mockComplaints.filter(c => c.location.floor === selectedFloor && c.location.room === room);

  const floorComplaints = mockComplaints.filter(c => c.location.floor === selectedFloor);
  const selectedRoomComplaints = selectedRoom ? roomComplaints(selectedRoom) : [];

  // Room types for visual distinction
  const roomType = (name: string): string => {
    if (name.includes('Lab')) return 'bg-accent/15 border-accent/30';
    if (name.includes('Washroom')) return 'bg-primary/10 border-primary/20';
    if (name.includes('Faculty')) return 'bg-warning/10 border-warning/20';
    if (name.includes('Seminar') || name.includes('Auditorium')) return 'bg-success/10 border-success/20';
    if (name.includes('Library')) return 'bg-accent/20 border-accent/30';
    return 'bg-secondary/40 border-border/30';
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Layers size={24} className="text-primary" /> Campus Map
          </h1>
        </div>

        {/* Floor selector */}
        <div className="flex gap-2">
          {FLOORS.map((f) => {
            const count = mockComplaints.filter(c => c.location.floor === f.id && c.status !== 'resolved').length;
            return (
              <button key={f.id} onClick={() => { setSelectedFloor(f.id); setSelectedRoom(null); }}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFloor === f.id ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/60 border border-transparent'
                }`}>
                {f.name}
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 glass rounded-xl p-6">
            <div className="grid grid-cols-3 gap-3 min-h-[400px]">
              {floor.rooms.map((room) => {
                const complaints = roomComplaints(room);
                const activeComplaints = complaints.filter(c => c.status !== 'resolved');
                const hasCritical = complaints.some(c => c.priority === 'critical');

                return (
                  <button key={room} onClick={() => setSelectedRoom(room === selectedRoom ? null : room)}
                    className={`relative p-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[100px] ${roomType(room)} ${
                      selectedRoom === room ? 'ring-2 ring-primary scale-[1.02]' : 'hover:scale-[1.01]'
                    } ${hasCritical ? 'animate-pulse-slow' : ''}`}>
                    <span className="text-sm font-medium text-center">{room}</span>
                    {activeComplaints.length > 0 && (
                      <div className="flex items-center gap-1">
                        <AlertCircle size={12} className={hasCritical ? 'text-destructive' : 'text-warning'} />
                        <span className="text-xs text-muted-foreground">{activeComplaints.length} issue{activeComplaints.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border/30 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-secondary/40 border border-border/30" /> Classroom</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent/15 border border-accent/30" /> Lab</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-warning/10 border border-warning/20" /> Faculty</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success/10 border border-success/20" /> Hall</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/10 border border-primary/20" /> Washroom</span>
            </div>
          </div>

          {/* Room detail panel */}
          <div className="glass rounded-xl p-5">
            {selectedRoom ? (
              <div className="animate-fade-in">
                <h2 className="text-lg font-semibold mb-1">{selectedRoom}</h2>
                <p className="text-xs text-muted-foreground mb-4">Floor {selectedFloor} · {selectedRoomComplaints.length} complaint{selectedRoomComplaints.length !== 1 ? 's' : ''}</p>
                {selectedRoomComplaints.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRoomComplaints.map(c => (
                      <div key={c.id} onClick={() => navigate(`/complaint/${c.id}`)}
                        className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
                        <p className="text-sm font-medium">{c.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <PriorityBadge priority={c.priority} />
                          <StatusBadge status={c.status} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{c.trackingId}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No complaints for this room</p>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Layers size={32} className="mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Select a room to view details</p>
                <p className="text-xs text-muted-foreground mt-1">{floorComplaints.length} total complaints on this floor</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampusMap;
