export type UserRole = 'student' | 'faculty' | 'admin' | 'club';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  clubName?: string;
}

export type ComplaintStatus = 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'escalated';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Complaint {
  id: string;
  trackingId: string;
  title: string;
  description: string;
  category: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  location: { floor: number; room: string; x: number; y: number };
  submittedBy: string;
  submittedByName: string;
  assignedTo?: string;
  assignedDepartment?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  aiSuggestion?: string;
  timeline: { status: ComplaintStatus; timestamp: string; note?: string }[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  role: 'student' | 'club' | 'faculty';
  score: number;
  resolved: number;
  avgResolutionTime: string;
  avatar?: string;
}

export const COMPLAINT_CATEGORIES = [
  'Lights not working', 'Projector issues', 'Desk damage', 'WiFi issues',
  'Website issues', 'Infrastructure', 'Plumbing', 'AC/Heating',
  'Cleanliness', 'Safety concern', 'Noise complaint', 'Other'
];

export const DEPARTMENTS = [
  'Electrical', 'IT Services', 'Maintenance', 'Housekeeping',
  'Security', 'Infrastructure', 'Administration'
];

export const FLOORS = [
  { id: 1, name: 'Ground Floor', rooms: ['Lobby', 'Auditorium', 'Admin Office', 'Reception', 'Washroom G1', 'Washroom G2'] },
  { id: 2, name: 'First Floor', rooms: ['Room 101', 'Room 102', 'Lab 1', 'Faculty Room A', 'Washroom 1A', 'Seminar Hall 1'] },
  { id: 3, name: 'Second Floor', rooms: ['Room 201', 'Room 202', 'Lab 2', 'Lab 3', 'Faculty Room B', 'Washroom 2A'] },
  { id: 4, name: 'Third Floor', rooms: ['Room 301', 'Room 302', 'Lab 4', 'Library', 'Faculty Room C', 'Washroom 3A'] },
];

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

export const mockComplaints: Complaint[] = [
  {
    id: '1', trackingId: 'CS-2024-0001', title: 'Projector not working in Room 201',
    description: 'The projector in Room 201 has been flickering and shutting off during lectures. Multiple students have reported this issue.',
    category: 'Projector issues', priority: 'high', status: 'in_progress',
    location: { floor: 3, room: 'Room 201', x: 45, y: 30 },
    submittedBy: 'student1', submittedByName: 'Arjun Mehta',
    assignedTo: 'faculty1', assignedDepartment: 'IT Services',
    createdAt: hoursAgo(48), updatedAt: hoursAgo(2),
    aiSuggestion: 'Check projector lamp hours. If >3000hrs, replace lamp. Also verify HDMI cable connection.',
    timeline: [
      { status: 'submitted', timestamp: hoursAgo(48) },
      { status: 'assigned', timestamp: hoursAgo(46), note: 'Assigned to IT Services' },
      { status: 'in_progress', timestamp: hoursAgo(24), note: 'Technician dispatched' },
    ]
  },
  {
    id: '2', trackingId: 'CS-2024-0002', title: 'WiFi down in Library',
    description: 'No WiFi connectivity in the entire library section. Students unable to access online resources.',
    category: 'WiFi issues', priority: 'critical', status: 'assigned',
    location: { floor: 4, room: 'Library', x: 70, y: 50 },
    submittedBy: 'student2', submittedByName: 'Priya Sharma',
    assignedDepartment: 'IT Services',
    createdAt: hoursAgo(6), updatedAt: hoursAgo(4),
    aiSuggestion: 'Check access point AP-LIB-01. Similar outage occurred last month due to firmware issue. Recommend reboot + firmware update.',
    timeline: [
      { status: 'submitted', timestamp: hoursAgo(6) },
      { status: 'assigned', timestamp: hoursAgo(4), note: 'Assigned to IT Services - Priority escalated by AI' },
    ]
  },
  {
    id: '3', trackingId: 'CS-2024-0003', title: 'Broken desk in Room 102',
    description: 'Third desk in the second row has a broken leg. Safety hazard for students.',
    category: 'Desk damage', priority: 'medium', status: 'resolved',
    location: { floor: 2, room: 'Room 102', x: 30, y: 60 },
    submittedBy: 'student3', submittedByName: 'Rahul Kumar',
    assignedTo: 'faculty2', assignedDepartment: 'Maintenance',
    createdAt: hoursAgo(120), updatedAt: hoursAgo(48),
    aiSuggestion: 'Replace desk leg bracket. Part available in maintenance inventory.',
    timeline: [
      { status: 'submitted', timestamp: hoursAgo(120) },
      { status: 'assigned', timestamp: hoursAgo(118) },
      { status: 'in_progress', timestamp: hoursAgo(72) },
      { status: 'resolved', timestamp: hoursAgo(48), note: 'Desk repaired successfully' },
    ]
  },
  {
    id: '4', trackingId: 'CS-2024-0004', title: 'Lights flickering in Lab 2',
    description: 'Multiple tube lights in Lab 2 are flickering, making it difficult to work.',
    category: 'Lights not working', priority: 'medium', status: 'submitted',
    location: { floor: 3, room: 'Lab 2', x: 55, y: 45 },
    submittedBy: 'club1', submittedByName: 'Tech Club',
    createdAt: hoursAgo(3), updatedAt: hoursAgo(3),
    aiSuggestion: 'Likely ballast issue. Check electrical panel E-2F. Similar issue resolved in Lab 1 last week.',
    timeline: [
      { status: 'submitted', timestamp: hoursAgo(3) },
    ]
  },
  {
    id: '5', trackingId: 'CS-2024-0005', title: 'AC not working in Seminar Hall',
    description: 'Air conditioning in Seminar Hall 1 is completely non-functional. Room temperature is unbearable.',
    category: 'AC/Heating', priority: 'high', status: 'escalated',
    location: { floor: 2, room: 'Seminar Hall 1', x: 80, y: 25 },
    submittedBy: 'student4', submittedByName: 'Ananya Singh',
    assignedTo: 'faculty3', assignedDepartment: 'Maintenance',
    createdAt: hoursAgo(72), updatedAt: hoursAgo(12),
    aiSuggestion: 'Compressor may need replacement. Escalate to external vendor. Estimated cost: ₹15,000-25,000.',
    timeline: [
      { status: 'submitted', timestamp: hoursAgo(72) },
      { status: 'assigned', timestamp: hoursAgo(70) },
      { status: 'in_progress', timestamp: hoursAgo(48) },
      { status: 'escalated', timestamp: hoursAgo(12), note: 'Requires external vendor - compressor failure' },
    ]
  },
  {
    id: '6', trackingId: 'CS-2024-0006', title: 'Water leakage in Washroom 2A',
    description: 'Continuous water leakage from ceiling in washroom 2A. Floor is slippery and dangerous.',
    category: 'Plumbing', priority: 'critical', status: 'in_progress',
    location: { floor: 3, room: 'Washroom 2A', x: 90, y: 70 },
    submittedBy: 'student5', submittedByName: 'Vikram Patel',
    assignedTo: 'faculty2', assignedDepartment: 'Maintenance',
    createdAt: hoursAgo(12), updatedAt: hoursAgo(4),
    aiSuggestion: 'Check pipe junction above washroom. Possible pipe corrosion. Place wet floor signs immediately.',
    timeline: [
      { status: 'submitted', timestamp: hoursAgo(12) },
      { status: 'assigned', timestamp: hoursAgo(11), note: 'Critical priority - assigned immediately' },
      { status: 'in_progress', timestamp: hoursAgo(4), note: 'Plumber on site' },
    ]
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', name: 'Tech Club', role: 'club', score: 950, resolved: 23, avgResolutionTime: '4.2 hrs' },
  { id: '2', name: 'Dr. Raghav Iyer', role: 'faculty', score: 870, resolved: 45, avgResolutionTime: '6.1 hrs' },
  { id: '3', name: 'Arjun Mehta', role: 'student', score: 720, resolved: 12, avgResolutionTime: '3.8 hrs' },
  { id: '4', name: 'Green Campus Club', role: 'club', score: 680, resolved: 18, avgResolutionTime: '5.5 hrs' },
  { id: '5', name: 'Prof. Sunita Das', role: 'faculty', score: 640, resolved: 38, avgResolutionTime: '7.2 hrs' },
  { id: '6', name: 'Priya Sharma', role: 'student', score: 590, resolved: 9, avgResolutionTime: '4.0 hrs' },
  { id: '7', name: 'Infrastructure Club', role: 'club', score: 510, resolved: 14, avgResolutionTime: '8.1 hrs' },
  { id: '8', name: 'Dr. Amit Verma', role: 'faculty', score: 480, resolved: 31, avgResolutionTime: '9.3 hrs' },
];

export const mockNotifications = [
  { id: '1', message: 'Your complaint CS-2024-0001 status updated to In Progress', time: hoursAgo(2), read: false },
  { id: '2', message: 'New complaint assigned: WiFi down in Library', time: hoursAgo(4), read: false },
  { id: '3', message: 'Complaint CS-2024-0003 has been resolved', time: hoursAgo(48), read: true },
  { id: '4', message: 'AI detected a duplicate complaint for Lab 2 lights', time: hoursAgo(3), read: false },
  { id: '5', message: 'Escalation alert: AC issue in Seminar Hall unresolved for 72hrs', time: hoursAgo(12), read: true },
];

export const aiInsights = [
  { title: 'WiFi Issues Trending', description: 'WiFi complaints increased 40% this week. 3rd floor most affected.', severity: 'high' as const },
  { title: 'Maintenance Backlog', description: 'Maintenance department has 12 pending complaints. Avg resolution: 5.2 days.', severity: 'medium' as const },
  { title: 'Infrastructure Hotspot', description: 'Lab 2 has the highest complaint density. 6 complaints in 30 days.', severity: 'high' as const },
  { title: 'Seasonal Pattern', description: 'AC complaints expected to rise 60% based on last year\'s data.', severity: 'low' as const },
];

export const departmentStats = [
  { name: 'IT Services', total: 45, resolved: 38, pending: 5, escalated: 2 },
  { name: 'Maintenance', total: 62, resolved: 48, pending: 10, escalated: 4 },
  { name: 'Electrical', total: 28, resolved: 24, pending: 3, escalated: 1 },
  { name: 'Housekeeping', total: 35, resolved: 32, pending: 3, escalated: 0 },
  { name: 'Security', total: 12, resolved: 11, pending: 1, escalated: 0 },
];
