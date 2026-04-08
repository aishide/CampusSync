import { mockNotifications } from '@/lib/mockData';
import { X, Bell } from 'lucide-react';

const NotificationPanel = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="absolute top-14 right-4 w-80 glass-strong rounded-xl z-50 animate-slide-up overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Bell size={16} className="text-primary" />
          Notifications
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-secondary/50 rounded">
          <X size={16} />
        </button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {mockNotifications.map((n) => (
          <div
            key={n.id}
            className={`p-3 border-b border-border/20 hover:bg-secondary/30 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
          >
            <p className="text-sm">{n.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(n.time).toLocaleString()}
            </p>
            {!n.read && <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-1" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
