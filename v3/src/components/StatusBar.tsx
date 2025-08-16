import React from 'react';

interface StatusBarProps {
  message?: string;
  isError?: boolean;
  isLoading?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  message = 'Ready',
  isError = false,
  isLoading = false,
}) => {
  return (
    <div className="status-bar flex items-center gap-3 px-4 py-3 rounded-lg border bg-app-panel border-app-border">
      <span 
        className={`status-message flex-1 text-sm ${
          isError ? 'error text-danger' : 'text-app-fg'
        }`}
      >
        {message}
      </span>
      {isLoading && (
        <div className="progress-spinner w-4 h-4 border-2 rounded-full animate-spin border-app-border border-t-brand-accent-600" />
      )}
    </div>
  );
};
