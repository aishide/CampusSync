import { ComplaintStatus, ComplaintPriority } from '@/lib/mockData';

const statusConfig: Record<ComplaintStatus, { label: string; className: string }> = {
  submitted: { label: 'Submitted', className: 'bg-muted text-muted-foreground' },
  assigned: { label: 'Assigned', className: 'bg-accent/20 text-accent' },
  in_progress: { label: 'In Progress', className: 'bg-warning/20 text-warning' },
  resolved: { label: 'Resolved', className: 'bg-success/20 text-success' },
  escalated: { label: 'Escalated', className: 'bg-destructive/20 text-destructive' },
};

const priorityConfig: Record<ComplaintPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-warning/20 text-warning' },
  high: { label: 'High', className: 'bg-destructive/20 text-destructive' },
  critical: { label: 'Critical', className: 'bg-destructive/30 text-destructive animate-pulse-slow' },
};

export const StatusBadge = ({ status }: { status: ComplaintStatus }) => {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

export const PriorityBadge = ({ priority }: { priority: ComplaintPriority }) => {
  const config = priorityConfig[priority];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};
