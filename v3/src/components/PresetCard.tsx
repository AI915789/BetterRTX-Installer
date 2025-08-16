import React from 'react';

export interface PackInfo {
  name: string;
  uuid: string;
  stub: string;
  tonemapping: string;
  bloom: string;
}

interface PresetCardProps {
  preset: PackInfo;
  selected?: boolean;
  onSelectionChange?: (uuid: string, selected: boolean) => void;
  onInstall?: (uuid: string) => void;
}

export const PresetCard: React.FC<PresetCardProps> = ({
  preset,
  selected = false,
  onSelectionChange,
  onInstall,
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.install-preset-btn')) return;
    
    const newSelected = !selected;
    onSelectionChange?.(preset.uuid, newSelected);
  };

  const handleInstallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onInstall?.(preset.uuid);
  };

  return (
    <div 
      className={`preset-card cursor-pointer transition-all duration-200 rounded-lg border p-4 hover:-translate-y-0.5 hover:shadow-lg hover:border-brand-accent ${
        selected ? 'selected bg-brand-accent/5 border-brand-accent-600' : 'bg-app-panel border-app-border'
      }`}
      data-uuid={preset.uuid}
      onClick={handleCardClick}
    >
      <div className="preset-header flex items-center gap-3 mb-3">
        <img 
          className="preset-icon w-12 h-12 rounded-lg object-cover"
          src={`https://cdn.jsdelivr.net/gh/BetterRTX/presets@main/data/${preset.uuid}/icon.png`}
          alt={`${preset.name} icon`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <h3 className="m-0 text-base font-semibold text-app-fg">
          {preset.name}
        </h3>
      </div>
      <button
        className="install-preset-btn w-full px-4 py-2 text-sm font-medium rounded-md border-none cursor-pointer transition-all duration-200 hover:scale-98 active:scale-95 bg-brand-accent-600 text-white hover:bg-brand-accent-600/90"
        onClick={handleInstallClick}
        data-uuid={preset.uuid}
      >
        Install
      </button>
    </div>
  );
};
