import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { mockComplaints } from '@/lib/mockData';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { HandHeart, CheckCircle, Star } from 'lucide-react';

const VolunteerPage = () => {
  const navigate = useNavigate();
  const [pickedUp, setPickedUp] = useState<string[]>([]);

  // Available complaints that can be picked up by volunteers
  const available = mockComplaints.filter(c => c.status === 'submitted' || c.status === 'assigned');
  const myPickedUp = mockComplaints.filter(c => pickedUp.includes(c.id));

  const handlePickUp = (id: string) => {
    setPickedUp(prev => [...prev, id]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <HandHeart size={24} className="text-accent" /> Volunteer Hub
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-primary">{pickedUp.length}</p>
            <p className="text-sm text-muted-foreground">Picked Up</p>
          </div>
          <div className="glass rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-success">0</p>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </div>
          <div className="glass rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-warning">{pickedUp.length * 50}</p>
            <p className="text-sm text-muted-foreground">Points Earned</p>
          </div>
        </div>

        {/* Picked up */}
        {myPickedUp.length > 0 && (
          <div className="glass rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star size={18} className="text-warning" /> My Active Tasks
            </h2>
            <div className="space-y-3">
              {myPickedUp.map(c => (
                <div key={c.id} onClick={() => navigate(`/complaint/${c.id}`)}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors">
                  <div>
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.trackingId} · {c.location.room}</p>
                  </div>
                  <PriorityBadge priority={c.priority} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Available Complaints</h2>
          <div className="space-y-3">
            {available.filter(c => !pickedUp.includes(c.id)).map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/complaint/${c.id}`)}>
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.trackingId} · {c.location.room}</p>
                  <div className="flex gap-2 mt-1">
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                </div>
                <button onClick={() => handlePickUp(c.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                  <CheckCircle size={14} /> Pick Up
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VolunteerPage;
