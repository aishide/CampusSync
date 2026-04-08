import DashboardLayout from '@/components/DashboardLayout';
import { Users, Shield, Settings } from 'lucide-react';

const UsersAdmin = () => {
  const mockUsers = [
    { id: '1', name: 'Arjun Mehta', email: 'arjun@campus.edu', role: 'student', status: 'active' },
    { id: '2', name: 'Priya Sharma', email: 'priya@campus.edu', role: 'student', status: 'active' },
    { id: '3', name: 'Dr. Raghav Iyer', email: 'raghav@campus.edu', role: 'faculty', status: 'active' },
    { id: '4', name: 'Tech Club', email: 'techclub@campus.edu', role: 'club', status: 'active' },
    { id: '5', name: 'Prof. Sunita Das', email: 'sunita@campus.edu', role: 'faculty', status: 'active' },
    { id: '6', name: 'Admin Office', email: 'admin@campus.edu', role: 'admin', status: 'active' },
  ];

  const roleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive/20 text-destructive';
      case 'faculty': return 'bg-warning/20 text-warning';
      case 'club': return 'bg-accent/20 text-accent';
      default: return 'bg-primary/20 text-primary';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users size={24} className="text-primary" /> User Management
        </h1>

        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30 bg-secondary/20">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">User</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Email</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Role</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Status</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.id} className="border-b border-border/10 hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-success/20 text-success">Active</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="p-1.5 hover:bg-secondary/50 rounded transition-colors">
                      <Settings size={14} className="text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersAdmin;
