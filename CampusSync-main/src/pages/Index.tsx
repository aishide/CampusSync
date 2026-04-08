import { useNavigate } from 'react-router-dom';
import InteractiveBackground from '@/components/InteractiveBackground';
import { ArrowRight, Shield, Brain, MapPin, BarChart3, Trophy, Bell } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Brain, title: 'AI-Powered Classification', desc: 'Automatic priority detection, department assignment, and duplicate detection' },
    { icon: MapPin, title: 'Interactive Campus Map', desc: 'Pin complaints to exact locations with floor-wise navigation' },
    { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Department performance, trends, and resolution tracking' },
    { icon: Bell, title: 'Live Notifications', desc: 'Instant updates on complaint status changes' },
    { icon: Trophy, title: 'Leaderboard System', desc: 'Recognize top volunteers, clubs, and responsive officers' },
    { icon: Shield, title: 'Role-Based Access', desc: 'Separate dashboards for students, faculty, admins, and clubs' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <InteractiveBackground />
      <div className="relative z-10">
        {/* Hero */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm mb-6 border border-primary/20">
              <Brain size={14} /> AI-Powered Campus Management
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
              <span className="text-gradient">CampusSync</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              The intelligent grievance & campus management platform. Report issues, track resolutions, and improve campus life — all powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-primary flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-3 rounded-xl bg-secondary/50 border border-border/50 font-semibold text-sm hover:bg-secondary transition-colors"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need for <span className="text-gradient">campus governance</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
