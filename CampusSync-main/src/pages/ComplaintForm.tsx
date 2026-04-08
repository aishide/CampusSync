import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { COMPLAINT_CATEGORIES, FLOORS, DEPARTMENTS } from '@/lib/mockData';
import { Camera, Upload, Mic, MicOff, MapPin, Send, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [floor, setFloor] = useState(1);
  const [room, setRoom] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [aiPriority, setAiPriority] = useState<string | null>(null);
  const [aiDepartment, setAiDepartment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [trackingId, setTrackingId] = useState<string>('');

  const selectedFloor = FLOORS.find(f => f.id === floor);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(t => t.stop());
      // In real app, would capture from video
      setImagePreview('/placeholder.svg');
    } catch {
      alert('Camera access denied');
    }
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    if (!isRecording) {
      setIsRecording(true);
      recognition.start();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription(prev => prev + (prev ? ' ' : '') + transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
    }
  };

  // Simulate AI classification
  const runAiClassification = () => {
    const priorities = ['low', 'medium', 'high', 'critical'];
    const catToPriority: Record<string, string> = {
      'WiFi issues': 'critical', 'Safety concern': 'critical',
      'Projector issues': 'high', 'AC/Heating': 'high', 'Plumbing': 'high',
      'Lights not working': 'medium', 'Desk damage': 'medium',
      'Cleanliness': 'low', 'Noise complaint': 'low',
    };
    const catToDept: Record<string, string> = {
      'WiFi issues': 'IT Services', 'Website issues': 'IT Services', 'Projector issues': 'IT Services',
      'Lights not working': 'Electrical', 'Desk damage': 'Maintenance',
      'AC/Heating': 'Maintenance', 'Plumbing': 'Maintenance', 'Infrastructure': 'Infrastructure',
      'Cleanliness': 'Housekeeping', 'Safety concern': 'Security',
    };
    setAiPriority(catToPriority[category] || priorities[Math.floor(Math.random() * 3)]);
    setAiDepartment(catToDept[category] || DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !room || !user) return;
    
    if (!aiPriority) runAiClassification();
    
    setLoading(true);
    
    try {
      // Generate tracking ID
      const newTrackingId = `CS-2024-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
      setTrackingId(newTrackingId);
      
      // Insert complaint into Supabase
      const complaintData = {
        tracking_id: newTrackingId,
        title,
        description,
        category,
        priority: aiPriority || 'medium',
        status: 'submitted',
        location_floor: floor,
        location_room: room,
        location_x: Math.random() * 100, // Random position for demo
        location_y: Math.random() * 100,
        submitted_by: user.id,
        submitted_by_name: user.name,
        assigned_department: aiDepartment,
        image_url: imagePreview,
        ai_suggestion: `${aiDepartment} recommended. Priority: ${aiPriority}.`
      };
      
      console.log('Submitting complaint data:', complaintData);
      
      const { data, error } = await supabase
        .from('complaints')
        .insert(complaintData)
        .select()
        .single();

      if (error) {
        console.error('Error creating complaint:', error);
        alert(`Failed to submit complaint: ${error.message}`);
        return;
      }

      // Create initial timeline entry
      const { error: timelineError } = await supabase
        .from('complaint_timeline')
        .insert({
          complaint_id: data.id,
          status: 'submitted',
          note: 'Complaint submitted successfully'
        });

      if (timelineError) {
        console.error('Error creating timeline:', timelineError);
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto text-center animate-slide-up">
          <div className="glass-strong rounded-2xl p-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center mb-4">
              <Send size={28} className="text-success" />
            </div>
            <h2 className="text-xl font-bold mb-2">Complaint Submitted!</h2>
            <p className="text-muted-foreground text-sm mb-4">Your complaint has been registered and AI has classified it.</p>
            <div className="glass rounded-xl p-4 text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tracking ID</span>
                <span className="font-mono font-bold text-primary">{trackingId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">AI Priority</span>
                <span className={`font-medium capitalize ${aiPriority === 'critical' ? 'text-destructive' : aiPriority === 'high' ? 'text-destructive' : aiPriority === 'medium' ? 'text-warning' : 'text-success'}`}>{aiPriority}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Assigned Dept</span>
                <span className="font-medium">{aiDepartment}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Location</span>
                <span>{room}, Floor {floor}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/complaints')} className="flex-1 py-2.5 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors">
                View Complaints
              </button>
              <button onClick={() => { setSubmitted(false); setTitle(''); setDescription(''); setCategory(''); setRoom(''); setAiPriority(null); setAiDepartment(null); setImagePreview(null); }}
                className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                New Complaint
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Report an Issue</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div className="glass rounded-xl p-5">
            <label className="text-sm font-medium mb-3 block">Category</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {COMPLAINT_CATEGORIES.map((cat) => (
                <button key={cat} type="button" onClick={() => { setCategory(cat); setAiPriority(null); }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    category === cat ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border/30 bg-secondary/30 hover:bg-secondary/50'
                  }`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Description */}
          <div className="glass rounded-xl p-5 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 focus:border-primary/50 focus:outline-none text-sm" placeholder="Brief description of the issue" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">Description</label>
                <button type="button" onClick={handleVoice}
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${isRecording ? 'bg-destructive/20 text-destructive' : 'bg-secondary/50 hover:bg-secondary text-muted-foreground'}`}>
                  {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
                  {isRecording ? 'Stop' : 'Voice'}
                </button>
              </div>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
                className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border/50 focus:border-primary/50 focus:outline-none text-sm resize-none" placeholder="Describe the issue in detail..." />
            </div>
          </div>

          {/* Media */}
          <div className="glass rounded-xl p-5">
            <label className="text-sm font-medium mb-3 block">Attach Media</label>
            <div className="flex gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-secondary/50 border border-dashed border-border/50 cursor-pointer hover:border-primary/50 transition-colors text-sm text-muted-foreground">
                <Upload size={16} /> Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <button type="button" onClick={handleCamera}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/50 transition-colors text-sm text-muted-foreground">
                <Camera size={16} /> Camera
              </button>
            </div>
            {imagePreview && (
              <div className="mt-3 relative">
                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                <button type="button" onClick={() => setImagePreview(null)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/80 flex items-center justify-center text-xs">✕</button>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="glass rounded-xl p-5 space-y-4">
            <label className="text-sm font-medium mb-1 block flex items-center gap-2">
              <MapPin size={16} className="text-primary" /> Location
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Floor</label>
                <select value={floor} onChange={(e) => { setFloor(Number(e.target.value)); setRoom(''); }}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none">
                  {FLOORS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Room</label>
                <select value={room} onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm focus:outline-none">
                  <option value="">Select room</option>
                  {selectedFloor?.rooms.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Mini map */}
            <div className="relative w-full h-48 rounded-lg bg-secondary/30 border border-border/30 overflow-hidden">
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-0.5 p-2">
                {selectedFloor?.rooms.map((r) => (
                  <button key={r} type="button" onClick={() => setRoom(r)}
                    className={`rounded text-[10px] flex items-center justify-center transition-colors border ${
                      room === r ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-secondary/40 border-border/20 text-muted-foreground hover:bg-secondary/60'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">{selectedFloor?.name}</div>
            </div>
          </div>

          {/* AI Classification Preview */}
          {category && !aiPriority && (
            <button type="button" onClick={runAiClassification}
              className="w-full py-3 rounded-xl border border-accent/30 bg-accent/5 text-sm font-medium text-accent flex items-center justify-center gap-2 hover:bg-accent/10 transition-colors">
              <Sparkles size={16} /> Run AI Classification
            </button>
          )}

          {aiPriority && (
            <div className="glass rounded-xl p-5 border border-accent/20 glow-accent animate-slide-up">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-accent" /> AI Classification
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Priority</p>
                  <p className={`font-semibold capitalize ${aiPriority === 'critical' ? 'text-destructive' : aiPriority === 'high' ? 'text-destructive' : aiPriority === 'medium' ? 'text-warning' : 'text-success'}`}>{aiPriority}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Department</p>
                  <p className="font-semibold">{aiDepartment}</p>
                </div>
              </div>
            </div>
          )}

          <button type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity glow-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} /> Submit Complaint
              </>
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ComplaintForm;
