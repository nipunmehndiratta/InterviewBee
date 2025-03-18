import React, { useState } from 'react';

interface MeetingLinkProps {
  url: string;
}

const MeetingLink = ({ url }: MeetingLinkProps) => {
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-5 p-4 bg-secondary/50 rounded-xl border border-border/50 animate-fade-in">
      <p className="font-medium text-sm text-muted-foreground mb-2">Meeting Link</p>
      <div className="flex items-center gap-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 text-sm truncate transition-colors duration-200 flex-1"
        >
          {url}
        </a>
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
          aria-label="Copy link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
      
      {showToast && (
        <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm animate-fade-in">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default MeetingLink;