import { useTranslation } from "react-i18next";
import PresetIcon from "../presets/PresetIcon";
import { useAppStore } from "../../store/appStore";
import CreatorIcon from "../creator/CreatorIcon";

export default function InstallationNav() {
  const { t } = useTranslation();
  const { installations } = useAppStore();
  
  // Extract installations with presets
  const presetInstallations = installations
    .map((installation) => {
      if (!installation.installed_preset) return null;

      return {
        uuid: installation.installed_preset.uuid,
        name: installation.installed_preset.name,
        installed_at: installation.installed_preset.installed_at,
        installation,
      };
    })
    .filter((preset): preset is NonNullable<typeof preset> => preset !== null);
  
  // Deduplicate by preset UUID, keeping the most recently installed one
  const uniquePresetMap = new Map();
  presetInstallations.forEach((preset) => {
    if (!uniquePresetMap.has(preset.uuid) || 
        new Date(preset.installed_at) > new Date(uniquePresetMap.get(preset.uuid).installed_at)) {
      uniquePresetMap.set(preset.uuid, preset);
    }
  });
  
  const installedPresets = Array.from(uniquePresetMap.values());

  return (
    <div className="flex flex-col gap-4 divide-y divide-app-border/50 px-2 pt-4">
      {installedPresets.map((preset) => (
        <button
          key={preset.uuid}
          className="flex flex-row items-center gap-2 cursor-pointer pb-4"
          title={t("open_installation", {
            installation: preset.installation.FriendlyName,
          })}
          onClick={() => {
            if (preset.installation.Preview) {
              window.open(`minecraft-preview://`);
              return;
            }

            window.open(`minecraft://`);
          }}
          type="button"
        >
          {preset.installation.installed_preset?.is_creator || preset.uuid === "material-files" ? <CreatorIcon /> : <PresetIcon uuid={preset.uuid} extra="max-w-16 h-12" />}
          <div className="flex flex-col items-start gap-1 group">
            <h3
              className="m-0 leading-snug text-sm font-semibold text-app-fg group-hover:underline underline-offset-4"
              title={preset.installation.InstallLocation}
            >
              {preset.installation.FriendlyName}
            </h3>
            <span className="text-xs opacity-75 group-hover:opacity-100 transition-opacity max-w-[20ch] overflow-hidden text-ellipsis">{preset.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
