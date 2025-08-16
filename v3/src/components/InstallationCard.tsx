import React from 'react';

export interface Installation {
  FriendlyName: string;
  InstallLocation: string;
  Preview: boolean;
  installed_preset?: {
    uuid: string;
    name: string;
    installed_at: string;
  };
}

interface InstallationCardProps {
  installation: Installation;
  selected?: boolean;
  onSelectionChange?: (path: string, selected: boolean) => void;
}

export const InstallationCard: React.FC<InstallationCardProps> = ({
  installation,
  selected = false,
  onSelectionChange,
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSelected = e.target.checked;
    onSelectionChange?.(installation.InstallLocation, isSelected);
  };

  const checkboxId = `install-${installation.InstallLocation.replace(/[^a-zA-Z0-9]/g, '')}`;

  const presetIcon = installation.installed_preset ? (
    <img 
      src={`https://cdn.jsdelivr.net/gh/BetterRTX/BetterRTX-Packs@main/packs/${installation.installed_preset.uuid}/icon.png`}
      className="preset-icon w-6 h-6 rounded"
      alt={installation.installed_preset.name}
      title={`Installed: ${installation.installed_preset.name}`}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  ) : null;

  return (
    <div 
      className={`installation-card rounded-lg border p-4 transition-all duration-200 ${
        selected ? 'selected bg-brand-accent/5 border-brand-accent-600' : 'bg-app-panel border-app-border'
      }`}
      data-path={installation.InstallLocation}
    >
      <div className="installation-header flex justify-between items-center mb-2">
        <div className="installation-title flex items-center gap-2">
          {presetIcon}
          <h3 className="m-0 text-base font-semibold text-app-fg">
            {installation.FriendlyName}
          </h3>
        </div>
        {installation.Preview && (
          <span className="preview-badge px-2 py-0.5 rounded text-xs font-semibold text-white bg-brand-accent-600">
            Preview
          </span>
        )}
      </div>
      
      <p className="installation-path text-sm my-1 break-all text-app-muted">
        {installation.InstallLocation}
      </p>
      
      {installation.installed_preset ? (
        <p className="installed-preset-info text-sm my-2 text-success-600">
          Current preset: {installation.installed_preset.name}
        </p>
      ) : (
        <p className="no-preset-info text-sm my-2 text-app-muted">
          No preset installed
        </p>
      )}
      
      <div className="installation-actions flex items-center gap-2 mt-3">
        <input 
          type="checkbox" 
          id={checkboxId}
          className="installation-checkbox w-4 h-4"
          value={installation.InstallLocation}
          checked={selected}
          onChange={handleCheckboxChange}
        />
        <label 
          htmlFor={checkboxId} 
          className="checkbox-label text-sm cursor-pointer select-none text-app-fg"
        >
          Select for installation
        </label>
      </div>
    </div>
  );
};
