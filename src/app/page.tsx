'use client'
import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import MeetingCard from '@/components/MeetingCard';
import AppButton from '@/components/AppButton';
import MeetingLink from '@/components/MeetingLink';
import LoginCard from '@/components/LoginCard';

const Home = () => {
  const { data: session } = useSession();
  const [scheduledMeeting, setScheduledMeeting] = useState<{
    date: string;
    time: string;
    link: string;
  } | null>(null);
  const [instantMeeting, setInstantMeeting] = useState<string | null>(null);
  const [isCreatingInstant, setIsCreatingInstant] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInstantMeeting = async () => {
    try {
      setIsCreatingInstant(true);
      setError(null);
      
      const response = await fetch('/api/meetings/instant', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to create instant meeting');
      }
      
      const data = await response.json();
      setInstantMeeting(data.meetLink);
    } catch (err) {
      setError('Failed to create instant meeting. Please try again.');
      console.error('Error creating instant meeting:', err);
    } finally {
      setIsCreatingInstant(false);
    }
  };

  const createScheduledMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsScheduling(true);
      setError(null);
      
      const formData = new FormData(e.currentTarget);
      const date = formData.get('date') as string;
      const time = formData.get('time') as string;
      
      const response = await fetch('/api/meetings/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          date, 
          time,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule meeting');
      }
      
      const data = await response.json();
      setScheduledMeeting({
        date,
        time,
        link: data.meetLink,
      });
    } catch (err) {
      setError('Failed to schedule meeting. Please try again.');
      console.error('Error scheduling meeting:', err);
    } finally {
      setIsScheduling(false);
    }
  };

  const resetInstantMeeting = () => {
    setInstantMeeting(null);
    setError(null);
    setIsCreatingInstant(false);
  };

  const resetScheduledMeeting = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setScheduledMeeting(null);
    setError(null);
    setIsScheduling(false);
    // Reset form fields
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      form.reset();
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
        <LoginCard onLogin={() => signIn('google')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-medium">InterviewBee</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline-block">
                Welcome, {session.user?.name}
              </span>
              <AppButton 
                variant="outline" 
                size="sm" 
                onClick={() => signOut()}
              >
                Sign Out
              </AppButton>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold">Create a Meeting</h1>
          <p className="text-muted-foreground mt-2">Start an instant meeting or schedule one for later</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Instant Meeting Card */}
          <MeetingCard 
            title="Instant Meeting" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
          >
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-muted-foreground">
                Start a meeting right now and share the link with participants
              </p>
              
              <AppButton 
                fullWidth 
                onClick={createInstantMeeting} 
                isLoading={isCreatingInstant}
              >
                Start Now
              </AppButton>
              
              {instantMeeting && (
                <div className="space-y-4 animate-fade-in">
                  <MeetingLink url={instantMeeting} />
                  <div className="flex justify-end">
                    <AppButton 
                      onClick={resetInstantMeeting}
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground"
                    >
                      Create New Meeting
                    </AppButton>
                  </div>
                </div>
              )}
            </div>
          </MeetingCard>

          {/* Scheduled Meeting Card */}
          <MeetingCard 
            title="Schedule Meeting" 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          >
            <form onSubmit={createScheduledMeeting} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full rounded-lg border-input border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  required
                  className="w-full rounded-lg border-input border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              
              <AppButton 
                type="submit" 
                fullWidth
                isLoading={isScheduling}
              >
                Schedule Meeting
              </AppButton>
            </form>
            
            {scheduledMeeting && (
              <div className="mt-5 p-4 bg-secondary/50 rounded-xl border border-border/50 animate-fade-in">
                <p className="font-medium text-sm text-muted-foreground mb-2">Meeting Details</p>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Date:</span>{' '}
                    {new Date(scheduledMeeting.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Time:</span>{' '}
                    {scheduledMeeting.time}
                  </p>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border">
                  <MeetingLink url={scheduledMeeting.link} />
                  <div className="flex justify-end mt-4">
                    <AppButton 
                      onClick={resetScheduledMeeting}
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground"
                    >
                      Schedule Another Meeting
                    </AppButton>
                  </div>
                </div>
              </div>
            )}
          </MeetingCard>
        </div>
      </main>
      
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} InterviewBee. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home; 