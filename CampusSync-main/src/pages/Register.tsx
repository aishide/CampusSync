import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';
import { UserRole, DEPARTMENTS } from '@/lib/mockData';
import InteractiveBackground from '@/components/InteractiveBackground';
import { ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [department, setDepartment] = useState('');
  const [clubName, setClubName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const roles: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Student' },
    { value: 'faculty', label: 'Faculty / Officer' },
    { value: 'admin', label: 'Administrator' },
    { value: 'club', label: 'Student Club / Volunteer' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (role === 'faculty' && !department) {
      setError('Please select a department');
      return;
    }
    if (role === 'club' && !clubName) {
      setError('Please enter your club name');
      return;
    }

    setLoading(true);
    
    try {
      const result = await register(name, email, password, role, { department, clubName });
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <InteractiveBackground />
      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">CampusSync</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">Register</h2>

          {error && <p className="text-sm text-destructive mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm" placeholder="John Doe" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm" placeholder="you@campus.edu" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm" placeholder="••••••••" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 focus:border-primary/50 focus:outline-none text-sm">
                {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {role === 'faculty' && (
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 focus:border-primary/50 focus:outline-none text-sm">
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}

            {role === 'club' && (
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Club Name</label>
                <input type="text" value={clubName} onChange={(e) => setClubName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm" placeholder="e.g. Tech Club" />
              </div>
            )}

            <button type="submit"
              disabled={loading || authLoading}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 glow-primary disabled:opacity-50 disabled:cursor-not-allowed">
              {loading || authLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
