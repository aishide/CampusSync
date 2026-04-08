import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import InteractiveBackground from './InteractiveBackground';
import NotificationPanel from './NotificationPanel';
import {
  LayoutDashboard, FileText, MapPin, Trophy, BarChart3, Brain,
  Bell, LogOut, Menu, X, Users, Settings, ChevronRight
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const roleNavItems: Record<string, NavItem[]> = {
  student: [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'New Complaint', path: '/complaint/new', icon: <FileText size={18} /> },
    { label: 'My Complaints', path: '/complaints', icon: <FileText size={18} /> },
    { label: 'Campus Map', path: '/map', icon: <MapPin size={18} /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={18} /> },
  ],
  faculty: [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Complaints', path: '/complaints', icon: <FileText size={18} /> },
    { label: 'Campus Map', path: '/map', icon: <MapPin size={18} /> },
    { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={18} /> },
    { label: 'AI Insights', path: '/insights', icon: <Brain size={18} /> },
  ],
  admin: [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'All Complaints', path: '/complaints', icon: <FileText size={18} /> },
    { label: 'Campus Map', path: '/map', icon: <MapPin size={18} /> },
    { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={18} /> },
    { label: 'AI Insights', path: '/insights', icon: <Brain size={18} /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={18} /> },
    { label: 'Users', path: '/users', icon: <Users size={18} /> },
  ],
  club: [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'New Complaint', path: '/complaint/new', icon: <FileText size={18} /> },
    { label: 'Complaints', path: '/complaints', icon: <FileText size={18} /> },
    { label: 'Volunteer', path: '/volunteer', icon: <Users size={18} /> },
    { label: 'Campus Map', path: '/map', icon: <MapPin size={18} /> },
    { label: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={18} /> },
  ],
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  if (!user) return null;

  const navItems = roleNavItems[user.role] || roleNavItems.student;
  const roleLabel = user.role === 'club' ? 'Club / Volunteer' : user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 glass-strong z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 border-b border-border/50">
          <h1 className="text-xl font-bold text-gradient">CampusSync</h1>
          <p className="text-xs text-muted-foreground mt-1">{roleLabel} Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? 'bg-primary/10 text-primary glow-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                {item.icon}
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen relative z-10">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-border/30">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-secondary/50 rounded-lg">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 hover:bg-secondary/50 rounded-lg transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
