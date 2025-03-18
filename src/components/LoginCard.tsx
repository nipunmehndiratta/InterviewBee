import React from 'react';
import AppButton from './AppButton';

interface LoginCardProps {
  onLogin: () => void;
}

const LoginCard = ({ onLogin }: LoginCardProps) => {
  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-card text-card-foreground shadow-lg border border-border/50 animate-fade-in">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="rounded-full bg-primary/10 p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">InterviewBee</h1>
          <p className="text-muted-foreground">Schedule and manage your meetings with ease</p>
        </div>
        
        <div className="w-full pt-4">
          <AppButton onClick={onLogin} fullWidth size="lg" className="gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
            </svg>
            Continue with Google
          </AppButton>
        </div>
        
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginCard;