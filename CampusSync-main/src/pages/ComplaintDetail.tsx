import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { mockComplaints, ComplaintStatus } from '@/lib/mockData';
import { useAuth } from '@/lib/authContext';
import { useState } from 'react';
import {
  ArrowLeft, MapPin, Clock, User, Building, Brain, CheckCircle,
  AlertTriangle, ArrowUpCircle
} from 'lucide-react';

const statusOrder: ComplaintStatus[] = ['submitted', 'assigned', 'in_progress', 'resolved'];

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const complaint = mockComplaints.find(c => c.id === id);
  const [status, setStatus] = useState(complaint?.status || 'submitted');

  if (!complaint) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Complaint not found</p>
          <button onClick={() => navigate('/complaints')} className="mt-4 text-primary hover:underline text-sm">Back to complaints</button>
        </div>
      </DashboardLayout>
    );
  }

  const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin';

  const handleStatusUpdate = (newStatus: ComplaintStatus) => {
    setStatus(newStatus);
  };

  const currentStepIndex = statusOrder.indexOf(status === 'escalated' ? 'in_progress' : status);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-secondary/50 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-mono text-primary text-sm">{complaint.trackingId}</span>
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={status} />
            </div>
            <h1 className="text-xl font-bold">{complaint.title}</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="glass rounded-xl p-5">
              <h2 className="text-sm font-semibold mb-3">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{complaint.description}</p>
              {complaint.imageUrl && (
                <img src={complaint.imageUrl} alt="Complaint" className="mt-4 w-full h-48 object-cover rounded-lg" />
              )}
            </div>

            {/* Timeline / Progress */}
            <div className="glass rounded-xl p-5">
              <h2 className="text-sm font-semibold mb-4">Progress Timeline</h2>
              {/* Progress bar */}
              <div className="flex items-center mb-6">
                {statusOrder.map((s, i) => (
                  <div key={s} className="flex-1 flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      i <= currentStepIndex ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {i <= currentStepIndex ? '✓' : i + 1}
                    </div>
                    {i < statusOrder.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 ${i < currentStepIndex ? 'bg-primary' : 'bg-secondary'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-6">
                {statusOrder.map(s => <span key={s} className="capitalize">{s.replace('_', ' ')}</span>)}
              </div>

              {/* Timeline entries */}
              <div className="space-y-4">
                {complaint.timeline.map((entry, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      {i < complaint.timeline.length - 1 && <div className="w-0.5 flex-1 bg-border/50 mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium capitalize">{entry.status.replace('_', ' ')}</p>
                      {entry.note && <p className="text-xs text-muted-foreground">{entry.note}</p>}
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock size={12} /> {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty/Admin Actions */}
            {isFacultyOrAdmin && (
              <div className="glass rounded-xl p-5">
                <h2 className="text-sm font-semibold mb-4">Actions</h2>
                <div className="flex flex-wrap gap-2">
                  {status !== 'resolved' && (
                    <button onClick={() => handleStatusUpdate('resolved')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 text-success text-sm font-medium hover:bg-success/20 transition-colors">
                      <CheckCircle size={16} /> Mark Resolved
                    </button>
                  )}
                  {status !== 'in_progress' && status !== 'resolved' && (
                    <button onClick={() => handleStatusUpdate('in_progress')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning/10 text-warning text-sm font-medium hover:bg-warning/20 transition-colors">
                      <Clock size={16} /> Mark In Progress
                    </button>
                  )}
                  {status !== 'escalated' && status !== 'resolved' && (
                    <button onClick={() => handleStatusUpdate('escalated')}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors">
                      <ArrowUpCircle size={16} /> Escalate
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Details */}
            <div className="glass rounded-xl p-5 space-y-3">
              <h2 className="text-sm font-semibold">Details</h2>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <User size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">By:</span>
                  <span>{complaint.submittedByName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span>{complaint.location.room}, Floor {complaint.location.floor}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Dept:</span>
                  <span>{complaint.assignedDepartment || 'Pending'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(complaint.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* AI Suggestion */}
            {complaint.aiSuggestion && (
              <div className="glass rounded-xl p-5 border border-accent/20">
                <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Brain size={16} className="text-accent" /> AI Suggestion
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{complaint.aiSuggestion}</p>
              </div>
            )}

            {/* 24-hour timer */}
            <div className="glass rounded-xl p-5">
              <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle size={14} className="text-warning" /> Resolution Timer
              </h2>
              <p className="text-xs text-muted-foreground mb-2">24-hour resolution target</p>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-success via-warning to-destructive rounded-full transition-all"
                  style={{ width: `${Math.min(100, ((Date.now() - new Date(complaint.createdAt).getTime()) / (24 * 3600000)) * 100)}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.max(0, 24 - Math.round((Date.now() - new Date(complaint.createdAt).getTime()) / 3600000))}h remaining
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintDetail;
