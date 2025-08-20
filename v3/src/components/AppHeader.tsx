import { useAppStore } from "../store/appStore";
import { useTranslation } from "react-i18next";
import { Settings } from "lucide-react";
import { ToolbarSection } from "./ToolbarSection";
import Logo from "./Logo";
import pkg from "../../package.json";
import { open } from "@tauri-apps/plugin-shell";

export default function AppHeader() {
  const { toolbarOpen, setToolbarOpen } = useAppStore();
  const { t } = useTranslation();

  const handleVersionClick = async () => {
    try {
      await open(`https://github.com/BetterRTX/BetterRTX-Installer/releases/tag/v${pkg.version}`);
    } catch (error) {
      console.error('Failed to open release page:', error);
    }
  };
  return (
    <header className="top-toolbar">
      <div className="toolbar-left">
        <Logo width={163} height={32} />
      </div>

      <div className="toolbar-right">
        <button 
          className="app-version app-version--link" 
          onClick={handleVersionClick}
          title={t('open_release_page', 'Open release page on GitHub')}
        >
          {t('installer_version', {
            version: pkg.version
          })}
        </button>
        {/* Menu button to show toolbar */}
        <button
          id="toolbar-menu-btn"
          className="toolbar-menu-btn"
          onClick={() => setToolbarOpen(!toolbarOpen)}
          aria-expanded={toolbarOpen}
          aria-controls="toolbar-popover"
        >
          <Settings size={16} />
        </button>

        {/* Toolbar popover */}
        <div
          id="toolbar-popover"
          className={`toolbar-popover ${toolbarOpen ? "block" : "hidden"}`}
          role="dialog"
          aria-modal="false"
          aria-label={t("toolbar_options_label")}
        >
          <ToolbarSection />
        </div>
      </div>
    </header>
  );
}
