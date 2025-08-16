import React from 'react';
import { Settings, HelpCircle, RefreshCw, RefreshCcw, Trash2, Info } from 'lucide-react';

interface ToolbarSectionProps {
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onRefreshClick?: () => void;
  onForceRefreshClick?: () => void;
  onClearCacheClick?: () => void;
  onAboutClick?: () => void;
}

export const ToolbarSection: React.FC<ToolbarSectionProps> = ({
  onSettingsClick,
  onHelpClick,
  onRefreshClick,
  onForceRefreshClick,
  onClearCacheClick,
  onAboutClick,
}) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-app-panel border-app-border text-app-fg">
      <div className="flex gap-2">
        <button
          onClick={onSettingsClick}
          className="inline-flex items-center gap-2 p-2 text-sm font-medium rounded-md border transition-colors cursor-pointer hover:bg-opacity-80 bg-app-bg border-app-border text-app-fg"
          title="Settings"
        >
          <Settings size={16} />
        </button>
        <button
          onClick={onHelpClick}
          className="inline-flex items-center gap-2 p-2 text-sm font-medium rounded-md border transition-colors cursor-pointer hover:bg-opacity-80 bg-app-bg border-app-border text-app-fg"
          title="Help"
        >
          <HelpCircle size={16} />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onRefreshClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors cursor-pointer hover:bg-opacity-80 bg-app-bg border-app-border text-app-fg"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
        <button
          onClick={onForceRefreshClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors cursor-pointer hover:bg-opacity-80 bg-app-bg border-app-border text-app-fg"
        >
          <RefreshCcw size={16} />
          <span>Force Refresh</span>
        </button>
        <button
          onClick={onClearCacheClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors cursor-pointer hover:bg-opacity-80 bg-app-bg border-app-border text-app-fg"
        >
          <Trash2 size={16} />
          <span>Clear Cache</span>
        </button>
        <button
          onClick={onAboutClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors cursor-pointer hover:bg-opacity-80 bg-app-bg border-app-border text-app-fg"
        >
          <Info size={16} />
          <span>About</span>
        </button>
      </div>
    </div>
  );
};
