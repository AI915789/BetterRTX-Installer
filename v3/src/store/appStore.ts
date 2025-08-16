import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';

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

export interface PackInfo {
  name: string;
  uuid: string;
  stub: string;
  tonemapping: string;
  bloom: string;
}

interface AppState {
  // State
  installations: Installation[];
  presets: PackInfo[];
  selectedInstallations: Set<string>;
  selectedPreset: string | null;
  status: string;
  isLoading: boolean;
  isError: boolean;
  consoleOutput: string[];
  activeTab: 'installations' | 'presets' | 'actions';
  toolbarOpen: boolean;

  // Actions
  setInstallations: (installations: Installation[]) => void;
  setPresets: (presets: PackInfo[]) => void;
  setSelectedInstallations: (selected: Set<string>) => void;
  setSelectedPreset: (preset: string | null) => void;
  setStatus: (status: string) => void;
  setIsLoading: (loading: boolean) => void;
  setIsError: (error: boolean) => void;
  setActiveTab: (tab: 'installations' | 'presets' | 'actions') => void;
  setToolbarOpen: (open: boolean) => void;
  addConsoleOutput: (message: string) => void;
  clearConsole: () => void;

  // Async actions
  refreshInstallations: () => Promise<void>;
  refreshPresets: (forceRefresh?: boolean) => Promise<void>;
  clearCache: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  installations: [],
  presets: [],
  selectedInstallations: new Set(),
  selectedPreset: null,
  status: 'Ready',
  isLoading: false,
  isError: false,
  consoleOutput: [],
  activeTab: 'installations',
  toolbarOpen: false,

  // Setters
  setInstallations: (installations) => set({ installations }),
  setPresets: (presets) => set({ presets }),
  setSelectedInstallations: (selectedInstallations) => set({ selectedInstallations }),
  setSelectedPreset: (selectedPreset) => set({ selectedPreset }),
  setStatus: (status) => set({ status }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsError: (isError) => set({ isError }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setToolbarOpen: (toolbarOpen) => set({ toolbarOpen }),

  addConsoleOutput: (message) => {
    const timestamp = new Date().toLocaleTimeString();
    set((state) => ({
      consoleOutput: [...state.consoleOutput, `[${timestamp}] ${message}`]
    }));
  },

  clearConsole: () => set({ consoleOutput: [] }),

  // Async actions
  refreshInstallations: async () => {
    const { setStatus, setIsLoading, setIsError, addConsoleOutput, setInstallations } = get();
    
    try {
      setStatus('Loading Minecraft installations...');
      setIsLoading(true);
      setIsError(false);
      addConsoleOutput('Scanning for Minecraft installations...');
      
      const data = await invoke<Installation[]>('list_installations');
      setInstallations(data);
      setStatus(`Found ${data.length} Minecraft installation(s)`);
      addConsoleOutput(`Found ${data.length} installations`);
    } catch (error) {
      const errorMsg = `Error loading installations: ${error}`;
      setStatus(errorMsg);
      setIsError(true);
      addConsoleOutput(errorMsg);
    } finally {
      setIsLoading(false);
    }
  },

  refreshPresets: async (forceRefresh = false) => {
    const { setStatus, setIsLoading, setIsError, addConsoleOutput, setPresets } = get();
    
    try {
      setStatus('Loading RTX presets...');
      setIsLoading(true);
      setIsError(false);
      addConsoleOutput('Fetching RTX presets...');
      
      const data = await invoke<PackInfo[]>('list_presets', { forceRefresh });
      setPresets(data);
      setStatus(`Loaded ${data.length} RTX preset(s)`);
      addConsoleOutput(`Loaded ${data.length} presets`);
    } catch (error) {
      const errorMsg = `Error loading presets: ${error}`;
      setStatus(errorMsg);
      setIsError(true);
      addConsoleOutput(errorMsg);
    } finally {
      setIsLoading(false);
    }
  },

  clearCache: async () => {
    const { addConsoleOutput, setStatus } = get();
    
    try {
      addConsoleOutput('Clearing cache...');
      await invoke('clear_cache');
      addConsoleOutput('Cache cleared successfully');
      setStatus('Cache cleared');
    } catch (error) {
      const errorMsg = `Error clearing cache: ${error}`;
      addConsoleOutput(errorMsg);
      setStatus(errorMsg);
    }
  },
}));
