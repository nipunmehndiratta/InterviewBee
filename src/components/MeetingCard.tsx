import React from 'react';
import { cn } from '@/lib/utils';

interface MeetingCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const MeetingCard = ({ title, icon, children, className }: MeetingCardProps) => {
  return (
    <div 
      className={cn(
        "bg-card text-card-foreground rounded-2xl shadow-sm border border-border/50",
        "p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20",
        "animate-fade-in backdrop-blur-sm",
        className
      )}
    >
      <h2 className="text-xl font-medium mb-6 flex items-center gap-3">
        <span className="text-primary">{icon}</span>
        <span>{title}</span>
      </h2>
      <div>{children}</div>
    </div>
  );
};

export default MeetingCard;