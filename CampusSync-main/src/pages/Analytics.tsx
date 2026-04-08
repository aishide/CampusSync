import DashboardLayout from '@/components/DashboardLayout';
import StatsCard from '@/components/StatsCard';
import { departmentStats, mockComplaints } from '@/lib/mockData';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const Analytics = () => {
  const total = mockComplaints.length;
  const resolved = mockComplaints.filter(c => c.status === 'resolved').length;
  const avgResolution = '18.4 hrs';

  // Category distribution
  const catCounts: Record<string, number> = {};
  mockComplaints.forEach(c => { catCounts[c.category] = (catCounts[c.category] || 0) + 1; });
  const topCategories = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 size={24} className="text-primary" /> Analytics
        </h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Complaints" value={total} change="+12% vs last month" trend="up" icon={BarChart3} glowColor="primary" />
          <StatsCard title="Resolution Rate" value={`${Math.round(resolved / total * 100)}%`} change="+5% improvement" trend="up" icon={TrendingUp} glowColor="success" />
          <StatsCard title="Avg Resolution" value={avgResolution} change="-2.1 hrs vs last month" trend="up" icon={Activity} glowColor="accent" />
          <StatsCard title="Active Issues" value={total - resolved} icon={PieChart} glowColor="warning" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="glass rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4">Complaint Categories</h2>
            <div className="space-y-3">
              {topCategories.map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                      style={{ width: `${(count / total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Performance */}
          <div className="glass rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4">Department Performance</h2>
            <div className="space-y-4">
              {departmentStats.map((d) => {
                const rate = Math.round(d.resolved / d.total * 100);
                return (
                  <div key={d.name} className="p-3 rounded-lg bg-secondary/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{d.name}</span>
                      <span className={`text-sm font-bold ${rate >= 80 ? 'text-success' : rate >= 60 ? 'text-warning' : 'text-destructive'}`}>{rate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${rate >= 80 ? 'bg-success' : rate >= 60 ? 'bg-warning' : 'bg-destructive'}`}
                        style={{ width: `${rate}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{d.resolved} resolved</span>
                      <span>{d.pending} pending</span>
                      <span>{d.escalated} escalated</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trend chart (simplified visual) */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4">Weekly Trend</h2>
          <div className="flex items-end gap-2 h-40">
            {[28, 35, 22, 45, 38, 42, 31].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-md transition-all hover:from-primary/80 hover:to-primary/40"
                  style={{ height: `${(val / 50) * 100}%` }} />
                <span className="text-[10px] text-muted-foreground">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
