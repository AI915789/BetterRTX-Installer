import React from "react";
import {
  Settings,
  HelpCircle,
  RefreshCw,
  RefreshCcw,
  Trash2,
  Info,
} from "lucide-react";
import { useAppStore } from "../store/appStore";
import { useTranslation } from "react-i18next";

export const ToolbarSection: React.FC = () => {
  const { t } = useTranslation();
  const {
    addConsoleOutput,
    refreshInstallations,
    refreshPresets,
    clearCache,
  } = useAppStore();

  const handleSettingsClick = () => addConsoleOutput(t("log_settings_clicked"));
  const handleHelpClick = () => addConsoleOutput(t("log_help_clicked"));
  const handleAboutClick = () => addConsoleOutput(t("log_about_clicked"));

  const handleRefreshClick = () => {
    addConsoleOutput(t("log_refreshing_installations"));
    refreshInstallations();
  };

  const handleForceRefreshClick = () => {
    addConsoleOutput(t("log_force_refreshing_presets"));
    refreshPresets(true);
  };

  const handleClearCacheClick = () => {
    addConsoleOutput(t("log_clearing_cache"));
    clearCache();
  };
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-app-panel border-app-border text-app-fg">
      <div className="flex gap-2">
        <button
          onClick={handleSettingsClick}
          className="inline-flex items-center gap-2 p-2 text-sm font-medium rounded-md border transition-colors cursor-pointer hover:bg-opacity-80 bg-app-bg border-app-border text-app-fg"
          title="Settings"
        >
          <Settings size={16} />
        </button>
        <button
          onClick={handleHelpClick}
          className="inline-flex items-center gap-2 p-2 text-sm font-medium rounded-md border transition-colors cursor-pointer hover:bg-opacity-80 bg-app-bg border-app-border text-app-fg"
          title="Help"
        >
          <HelpCircle size={16} />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleRefreshClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors cursor-pointer hover:bg-opacity-80 bg-app-bg border-app-border text-app-fg"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
        <button
          onClick={handleForceRefreshClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors cursor-pointer hover:bg-opacity-80 bg-app-bg border-app-border text-app-fg"
        >
          <RefreshCcw size={16} />
          <span>Force Refresh</span>
        </button>
        <button
          onClick={handleClearCacheClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors cursor-pointer hover:bg-opacity-80 bg-app-bg border-app-border text-app-fg"
        >
          <Trash2 size={16} />
          <span>Clear Cache</span>
        </button>
        <button
          onClick={handleAboutClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border transition-colors cursor-pointer hover:bg-opacity-80 bg-app-bg border-app-border text-app-fg"
        >
          <Info size={16} />
          <span>About</span>
        </button>
      </div>
    </div>
  );
};
