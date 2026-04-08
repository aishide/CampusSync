import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { mockLeaderboard } from '@/lib/mockData';
import { Trophy, Medal, Star, Users, Award } from 'lucide-react';

type RoleFilter = 'all' | 'student' | 'club' | 'faculty';

const Leaderboard = () => {
  const [filter, setFilter] = useState<RoleFilter>('all');

  const filtered = filter === 'all' ? mockLeaderboard : mockLeaderboard.filter(e => e.role === filter);

  const filters: { value: RoleFilter; label: string; icon: React.ReactNode }[] = [
    { value: 'all', label: 'All', icon: <Users size={14} /> },
    { value: 'student', label: 'Students', icon: <Star size={14} /> },
    { value: 'club', label: 'Clubs', icon: <Award size={14} /> },
    { value: 'faculty', label: 'Faculty', icon: <Medal size={14} /> },
  ];

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy size={20} className="text-warning" />;
    if (index === 1) return <Medal size={20} className="text-muted-foreground" />;
    if (index === 2) return <Medal size={20} className="text-warning/60" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm text-muted-foreground font-bold">{index + 1}</span>;
  };

  const roleLabel = (role: string) => {
    if (role === 'club') return 'Club';
    if (role === 'faculty') return 'Faculty';
    return 'Volunteer';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy size={24} className="text-warning" /> Leaderboard
        </h1>

        {/* Filters */}
        <div className="flex gap-2">
          {filters.map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.value ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/60 border border-transparent'
              }`}>
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Top 3 */}
        {filtered.length >= 3 && (
          <div className="grid grid-cols-3 gap-4">
            {[filtered[1], filtered[0], filtered[2]].map((entry, i) => {
              const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
              const isFirst = rank === 1;
              return (
                <div key={entry.id} className={`glass rounded-2xl p-6 text-center ${isFirst ? 'glow-primary border border-primary/20 -mt-4' : ''} animate-slide-up`}
                  style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-xl font-bold mb-3 ${
                    isFirst ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {entry.name.charAt(0)}
                  </div>
                  <div className="mb-2">{getRankIcon(rank - 1)}</div>
                  <h3 className="font-semibold text-sm">{entry.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{roleLabel(entry.role)}</p>
                  <p className="text-2xl font-bold text-primary mt-2">{entry.score}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Full list */}
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-secondary/20">
                <th className="text-center py-3 px-4 w-16 text-muted-foreground font-medium">Rank</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Role</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Score</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Resolved</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Avg Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => (
                <tr key={entry.id} className="border-b border-border/10 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4 text-center">{getRankIcon(i)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                        {entry.name.charAt(0)}
                      </div>
                      <span className="font-medium">{entry.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-secondary text-muted-foreground capitalize">{roleLabel(entry.role)}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-primary">{entry.score}</td>
                  <td className="py-3 px-4 text-center">{entry.resolved}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{entry.avgResolutionTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
