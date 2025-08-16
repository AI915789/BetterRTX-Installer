import React, { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Settings } from 'lucide-react';
import { ToolbarSection } from './ToolbarSection';
import { PresetCard } from './PresetCard';
import { InstallationCard } from './InstallationCard';
import { StatusBar } from './StatusBar';
import { ConsolePanel } from './ConsolePanel';
import { useAppStore } from '../store/appStore';

export const App: React.FC = () => {
  const {
    installations,
    presets,
    selectedInstallations,
    selectedPreset,
    status,
    isLoading,
    isError,
    consoleOutput,
    activeTab,
    toolbarOpen,
    setSelectedInstallations,
    setSelectedPreset,
    setStatus,
    setIsError,
    setActiveTab,
    setToolbarOpen,
    addConsoleOutput,
    clearConsole,
    refreshInstallations,
    refreshPresets,
    clearCache
  } = useAppStore();

  useEffect(() => {
    refreshInstallations();
    refreshPresets();
  }, [refreshInstallations, refreshPresets]);


  const handleInstallationSelection = (path: string, selected: boolean) => {
    const newSet = new Set(selectedInstallations);
    if (selected) {
      newSet.add(path);
    } else {
      newSet.delete(path);
    }
    setSelectedInstallations(newSet);
  };

  const handlePresetSelection = (uuid: string, selected: boolean) => {
    setSelectedPreset(selected ? uuid : null);
  };

  const handlePresetInstall = async (uuid: string) => {
    if (selectedInstallations.size === 0) {
      setStatus('Please select at least one installation');
      setIsError(true);
      return;
    }

    try {
      const store = useAppStore.getState();
      store.setStatus('Installing preset...');
      store.setIsLoading(true);
      store.setIsError(false);
      store.addConsoleOutput(`Installing preset ${uuid} to ${selectedInstallations.size} installation(s)`);
      
      for (const installPath of selectedInstallations) {
        await invoke('install_preset', { uuid, installPath });
        store.addConsoleOutput(`Installed to: ${installPath}`);
      }
      
      store.setStatus('Preset installed successfully');
      store.addConsoleOutput('Installation completed successfully');
      // Refresh installations to show updated preset info
      await refreshInstallations();
    } catch (error) {
      const errorMsg = `Error installing preset: ${error}`;
      const store = useAppStore.getState();
      store.setStatus(errorMsg);
      store.setIsError(true);
      store.addConsoleOutput(errorMsg);
    }
  };

  const handleSettings = () => {
    addConsoleOutput('Settings clicked - Feature coming soon');
  };

  const handleHelp = () => {
    addConsoleOutput('Help clicked - Feature coming soon');
  };

  const handleAbout = () => {
    addConsoleOutput('About clicked - Feature coming soon');
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-fg">
      {/* Top toolbar with popover API */}
      <header className="top-toolbar">
        <div className="toolbar-left">
          <nav className="nav-tabs">
            <button 
              className={`nav-btn ${activeTab === 'installations' ? 'active' : ''}`}
              onClick={() => setActiveTab('installations')}
            >
              Installations
            </button>
            <button 
              className={`nav-btn ${activeTab === 'presets' ? 'active' : ''}`}
              onClick={() => setActiveTab('presets')}
            >
              Presets
            </button>
            <button 
              className={`nav-btn ${activeTab === 'actions' ? 'active' : ''}`}
              onClick={() => setActiveTab('actions')}
            >
              Actions
            </button>
          </nav>
        </div>
        <div className="toolbar-right">
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
            className={`toolbar-popover ${toolbarOpen ? 'block' : 'hidden'}`}
            role="dialog"
            aria-modal="false"
            aria-label="Toolbar options"
          >
            <ToolbarSection
              onSettingsClick={handleSettings}
              onHelpClick={handleHelp}
              onRefreshClick={refreshInstallations}
              onForceRefreshClick={() => refreshPresets(true)}
              onClearCacheClick={clearCache}
              onAboutClick={handleAbout}
            />
          </div>
        </div>
      </header>

      {/* Status bar */}
      <div className="px-4">
        <StatusBar 
          message={status}
          isError={isError}
          isLoading={isLoading}
        />
      </div>

      {/* Main content */}
      <main className="p-4 pb-32">
        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'installations' && (
            <section className="installations-container">
              <div className="section-toolbar flex justify-between items-center mb-4">
                <div className="toolbar-title">
                  <h2 className="text-lg font-semibold">Minecraft Installations</h2>
                  <span className="text-sm opacity-75">{installations.length} found</span>
                </div>
              </div>
              <div className="installations-list grid gap-4">
                {installations.length > 0 ? (
                  installations.map((installation) => (
                    <InstallationCard
                      key={installation.InstallLocation}
                      installation={installation}
                      selected={selectedInstallations.has(installation.InstallLocation)}
                      onSelectionChange={handleInstallationSelection}
                    />
                  ))
                ) : (
                  <div className="empty-state text-center py-8">
                    <p>No Minecraft installations found</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === 'presets' && (
            <section className="presets-container">
              <div className="section-toolbar flex justify-between items-center mb-4">
                <div className="toolbar-title">
                  <h2 className="text-lg font-semibold">Available Presets</h2>
                  <span className="text-sm opacity-75">{presets.length} loaded</span>
                </div>
              </div>
              <div className="presets-list grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {presets.length > 0 ? (
                  presets.map((preset) => (
                    <PresetCard
                      key={preset.uuid}
                      preset={preset}
                      selected={selectedPreset === preset.uuid}
                      onSelectionChange={handlePresetSelection}
                      onInstall={handlePresetInstall}
                    />
                  ))
                ) : (
                  <div className="empty-state text-center py-8 col-span-full">
                    <p>No presets available</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === 'actions' && (
            <section className="actions-container">
              <div className="section-toolbar mb-4">
                <h2 className="text-lg font-semibold">Actions</h2>
              </div>
              <div className="actions-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <button className="action-btn p-4 rounded-lg border text-left hover:bg-opacity-80 transition-colors bg-app-panel border-app-border">
                  <h3 className="font-semibold mb-2">Install .rtpack File</h3>
                  <p className="text-sm opacity-75">Install a preset from a local .rtpack file</p>
                </button>
                <button className="action-btn p-4 rounded-lg border text-left hover:bg-opacity-80 transition-colors bg-app-panel border-app-border">
                  <h3 className="font-semibold mb-2">Install Material Files</h3>
                  <p className="text-sm opacity-75">Install individual material files</p>
                </button>
                <button className="action-btn p-4 rounded-lg border text-left hover:bg-opacity-80 transition-colors bg-app-panel border-app-border">
                  <h3 className="font-semibold mb-2">Backup Selected</h3>
                  <p className="text-sm opacity-75">Create backups of selected installations</p>
                </button>
              </div>
            </section>
          )}
        </div>

      </main>

      {/* Fixed Console Panel at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <ConsolePanel 
          output={consoleOutput}
          onClear={clearConsole}
        />
      </div>
    </div>
  );
};
