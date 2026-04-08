import { useAuth } from '@/lib/authContext';
import { mockComplaints, aiInsights, departmentStats } from '@/lib/mockData';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { useNavigate } from 'react-router-dom';
import {
  FileText, AlertTriangle, CheckCircle, Clock, TrendingUp,
  Brain, Plus, ArrowRight, Zap
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const total = mockComplaints.length;
  const active = mockComplaints.filter(c => !['resolved'].includes(c.status)).length;
  const resolved = mockComplaints.filter(c => c.status === 'resolved').length;
  const escalated = mockComplaints.filter(c => c.status === 'escalated').length;
  const critical = mockComplaints.filter(c => c.priority === 'critical').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
            <p className="text-muted-foreground text-sm mt-1">Here's your campus overview</p>
          </div>
          {(user.role === 'student' || user.role === 'club') && (
            <button
              onClick={() => navigate('/complaint/new')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity glow-primary"
            >
              <Plus size={16} /> New Complaint
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Complaints" value={total} change="+12% this week" trend="up" icon={FileText} glowColor="primary" />
          <StatsCard title="Active" value={active} change={`${critical} critical`} trend="neutral" icon={AlertTriangle} glowColor="warning" />
          <StatsCard title="Resolved" value={resolved} change="83% rate" trend="up" icon={CheckCircle} glowColor="success" />
          <StatsCard title="Escalated" value={escalated} icon={Zap} glowColor="destructive" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Complaints */}
          <div className="lg:col-span-2 glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Complaints</h2>
              <button onClick={() => navigate('/complaints')} className="text-sm text-primary flex items-center gap-1 hover:underline">
                View all <ArrowRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {mockComplaints.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/complaint/${c.id}`)}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{c.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {c.trackingId} · {c.location.room} · {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain size={18} className="text-accent" /> AI Insights
            </h2>
            <div className="space-y-3">
              {aiInsights.slice(0, 3).map((insight, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      insight.severity === 'high' ? 'bg-destructive' : insight.severity === 'medium' ? 'bg-warning' : 'bg-success'
                    }`} />
                    <p className="text-sm font-medium">{insight.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              ))}
              <button onClick={() => navigate('/insights')} className="text-sm text-primary flex items-center gap-1 hover:underline w-full justify-center pt-2">
                View all insights <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Department Performance (admin/faculty) */}
        {(user.role === 'admin' || user.role === 'faculty') && (
          <div className="glass rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Department Performance
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Department</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Total</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Resolved</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Pending</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Escalated</th>
                    <th className="text-center py-2 px-3 text-muted-foreground font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentStats.map((d) => (
                    <tr key={d.name} className="border-b border-border/10 hover:bg-secondary/20">
                      <td className="py-2.5 px-3 font-medium">{d.name}</td>
                      <td className="text-center py-2.5 px-3">{d.total}</td>
                      <td className="text-center py-2.5 px-3 text-success">{d.resolved}</td>
                      <td className="text-center py-2.5 px-3 text-warning">{d.pending}</td>
                      <td className="text-center py-2.5 px-3 text-destructive">{d.escalated}</td>
                      <td className="text-center py-2.5 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full" style={{ width: `${(d.resolved / d.total * 100)}%` }} />
                          </div>
                          <span className="text-xs">{Math.round(d.resolved / d.total * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
