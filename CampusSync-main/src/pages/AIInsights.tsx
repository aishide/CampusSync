import DashboardLayout from '@/components/DashboardLayout';
import { aiInsights, mockComplaints } from '@/lib/mockData';
import { Brain, TrendingUp, MapPin, Lightbulb, AlertTriangle, Sparkles } from 'lucide-react';

const AIInsights = () => {
  // Duplicate detection
  const duplicates = [
    { original: 'CS-2024-0001', duplicate: 'CS-2024-0008', similarity: 92, category: 'Projector issues' },
    { original: 'CS-2024-0004', duplicate: 'CS-2024-0012', similarity: 87, category: 'Lights not working' },
  ];

  // Predictive insights
  const predictions = [
    { issue: 'AC failures', prediction: 'Expected 60% increase in next 2 weeks', confidence: 85, reason: 'Seasonal pattern + aging equipment' },
    { issue: 'WiFi outages', prediction: 'Likely recurring outage in Library zone', confidence: 78, reason: 'Network switch showing intermittent failures' },
    { issue: 'Plumbing issues', prediction: 'Washroom 3A pipe replacement needed within 30 days', confidence: 72, reason: 'Corrosion rate analysis' },
  ];

  // Hotspots
  const hotspots = [
    { location: 'Lab 2, Floor 3', count: 6, topIssue: 'Electrical' },
    { location: 'Library, Floor 4', count: 4, topIssue: 'WiFi' },
    { location: 'Room 201, Floor 3', count: 3, topIssue: 'Projector' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Brain size={24} className="text-accent" /> AI Insights
        </h1>

        {/* Active Insights */}
        <div className="grid md:grid-cols-2 gap-4">
          {aiInsights.map((insight, i) => (
            <div key={i} className={`glass rounded-xl p-5 border-l-4 animate-slide-up ${
              insight.severity === 'high' ? 'border-l-destructive' : insight.severity === 'medium' ? 'border-l-warning' : 'border-l-success'
            }`} style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  insight.severity === 'high' ? 'bg-destructive/20 text-destructive' : insight.severity === 'medium' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                }`}>{insight.severity}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Duplicate Detection */}
          <div className="glass rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-accent" /> Duplicate Detection
            </h2>
            <div className="space-y-3">
              {duplicates.map((d, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-accent/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{d.category}</span>
                    <span className="text-xs text-accent font-bold">{d.similarity}% match</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono">{d.original}</span> ↔ <span className="font-mono">{d.duplicate}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hotspots */}
          <div className="glass rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-destructive" /> Problem Hotspots
            </h2>
            <div className="space-y-3">
              {hotspots.map((h, i) => (
                <div key={i} className="p-3 rounded-lg bg-secondary/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{h.location}</p>
                    <p className="text-xs text-muted-foreground">{h.count} complaints · Top: {h.topIssue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Predictive Insights */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> Predictive Analysis
          </h2>
          <div className="space-y-4">
            {predictions.map((p, i) => (
              <div key={i} className="p-4 rounded-lg bg-secondary/20 border border-border/20">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Lightbulb size={14} className="text-warning" /> {p.issue}
                  </h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{p.confidence}% confidence</span>
                </div>
                <p className="text-sm text-muted-foreground">{p.prediction}</p>
                <p className="text-xs text-muted-foreground mt-1">Reason: {p.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="glass rounded-xl p-5 border border-accent/20 glow-accent">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain size={18} className="text-accent" /> AI Recommendations
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2 text-muted-foreground">
              <span className="text-accent mt-0.5">→</span>
              Increase maintenance staff allocation for 3rd floor — highest complaint density
            </li>
            <li className="flex items-start gap-2 text-muted-foreground">
              <span className="text-accent mt-0.5">→</span>
              Schedule preventive AC maintenance before summer peak
            </li>
            <li className="flex items-start gap-2 text-muted-foreground">
              <span className="text-accent mt-0.5">→</span>
              Upgrade Library WiFi access point — recurring failure pattern detected
            </li>
            <li className="flex items-start gap-2 text-muted-foreground">
              <span className="text-accent mt-0.5">→</span>
              Replace projector lamp in Room 201 — exceeded recommended hours
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIInsights;
