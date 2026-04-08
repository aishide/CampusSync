import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { ComplaintStatus, ComplaintPriority } from '@/lib/mockData';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';
import { Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';

interface Complaint {
  id: string;
  tracking_id: string;
  title: string;
  description: string;
  category: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  location_floor: number;
  location_room: string;
  location_x: number;
  location_y: number;
  submitted_by: string;
  submitted_by_name: string;
  assigned_to?: string;
  assigned_department?: string;
  created_at: string;
  updated_at: string;
  image_url?: string;
  ai_suggestion?: string;
}

const ComplaintsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ComplaintPriority | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter based on user role
      if (user.role === 'student') {
        query = query.eq('submitted_by', user.id);
      } else if (user.role === 'faculty') {
        query = query.or(`submitted_by.eq.${user.id},assigned_to.eq.${user.id}`);
      }
      // Admins see all complaints

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching complaints:', error);
      } else {
        setComplaints(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = complaints.filter(c => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.tracking_id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && c.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{user?.role === 'admin' ? 'All Complaints' : user?.role === 'faculty' ? 'Assigned Complaints' : 'My Complaints'}</h1>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 text-sm hover:bg-secondary transition-colors">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 focus:border-primary/50 focus:outline-none text-sm"
            placeholder="Search by title or tracking ID..." />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="glass rounded-xl p-4 flex flex-wrap gap-4 animate-slide-up">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none">
                <option value="all">All</option>
                <option value="submitted">Submitted</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none">
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="glass rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/30 bg-secondary/20">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tracking ID</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Title</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Location</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Priority</th>
                    <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-muted-foreground font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}
                      onClick={() => navigate(`/complaint/${c.id}`)}
                      className="border-b border-border/10 hover:bg-secondary/20 cursor-pointer transition-colors">
                      <td className="py-3 px-4 font-mono text-primary text-xs">{c.tracking_id}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium truncate max-w-[300px]">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.submitted_by_name}</p>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{c.location_room}</td>
                      <td className="py-3 px-4 text-center"><PriorityBadge priority={c.priority} /></td>
                      <td className="py-3 px-4 text-center"><StatusBadge status={c.status} /></td>
                      <td className="py-3 px-4 text-right text-muted-foreground text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Filter size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No complaints found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintsList;
