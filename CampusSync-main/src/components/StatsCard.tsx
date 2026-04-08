import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  glowColor?: 'primary' | 'accent' | 'success' | 'warning' | 'destructive';
}

const glowMap = {
  primary: 'border-primary/20 shadow-[0_0_15px_hsl(187_92%_52%/0.1)]',
  accent: 'border-accent/20 shadow-[0_0_15px_hsl(260_70%_58%/0.1)]',
  success: 'border-success/20 shadow-[0_0_15px_hsl(152_70%_45%/0.1)]',
  warning: 'border-warning/20 shadow-[0_0_15px_hsl(38_92%_55%/0.1)]',
  destructive: 'border-destructive/20 shadow-[0_0_15px_hsl(0_72%_55%/0.1)]',
};

const iconBgMap = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
};

const StatsCard = ({ title, value, change, icon: Icon, trend, glowColor = 'primary' }: StatsCardProps) => {
  return (
    <div className={`glass rounded-xl p-5 border ${glowMap[glowColor]} animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${trend === 'up' ? 'text-success' : trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-2.5 rounded-lg ${iconBgMap[glowColor]}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
