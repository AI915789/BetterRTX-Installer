import { useState } from "react";
import { cx } from "classix";
import { useTranslation } from "react-i18next";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { InstallationCard, Installation } from "./InstallationCard";
import Button from "../ui/Button";

interface InstallationsPanelProps {
  installations: Installation[];
  selectedInstallations: Set<string>;
  onInstallationSelection: (path: string, selected: boolean) => void;
  onInstallationAdded: () => void;
}

export default function InstallationsPanel({
  installations,
  selectedInstallations,
  onInstallationSelection,
  onInstallationAdded,
}: InstallationsPanelProps) {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInstallPath, setNewInstallPath] = useState("");
  const [newInstallName, setNewInstallName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddInstallation = async () => {
    if (!newInstallPath.trim()) return;

    setIsAdding(true);
    try {
      const isValid = await invoke<boolean>("validate_minecraft_path", {
        path: newInstallPath,
      });

      if (!isValid) {
        alert("Invalid Minecraft installation path");
        return;
      }

      // Trigger refresh of installations list
      onInstallationAdded();
      
      // Reset form
      setShowAddForm(false);
      setNewInstallPath("");
      setNewInstallName("");
    } catch (error) {
      console.error("Error adding installation:", error);
      alert(`Error adding installation: ${error}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBrowseFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: t("add_installation")
      });
      if (selected) {
        setNewInstallPath(selected as string);
      }
    } catch (error) {
      console.error("Error opening folder dialog:", error);
    }
  };

  return (
    <div className="installations-panel">
      <div className="section-toolbar mb-4">
        <div className="toolbar-title">
          <h2>{t("installations_title")}</h2>
          <span className="item-count">
            {t("installations_found_count", { count: installations.length })}
          </span>
        </div>
      </div>

      <div className="installations-list flex flex-wrap gap-4 justify-stretch">
        {installations.length > 0
          ? installations.map((installation) => (
            <InstallationCard
              key={installation.InstallLocation}
              installation={installation}
              selected={selectedInstallations.has(
                installation.InstallLocation
              )}
              onSelectionChange={onInstallationSelection}
            />
          ))
          : !showAddForm && (
            <div className="empty-state text-center py-8 col-span-full">
              <p>{t("installations_none_found")}</p>
              <p className="text-xs mt-2">
                {t("installations_none_found_hint")}
              </p>
            </div>
          )}
      </div>

      <Button
        className={cx("btn mt-4", showAddForm ? "btn--secondary w-fit" : "btn--primary")}
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? t("cancel") : t("add_installation")}
      </Button>

      {showAddForm && (
        <div className="installation-card panel flex flex-col p-4 border-dashed border-2 border-brand-accent/50 bg-brand-accent/5">
          <h3 className="text-sm font-semibold mb-4 text-center select-none cursor-default">
            {t("add_custom_installation")}
          </h3>
          <div className="space-y-3 flex-1">
            <div className="field">
              <label className="field__label select-none cursor-default">{t("installation_name")}</label>
              <input
                type="text"
                className="field__input"
                value={newInstallName}
                onChange={(e) => setNewInstallName(e.target.value)}
                placeholder={t("installation_name_placeholder")}
              />
            </div>
            <div className="field">
              <label className="field__label">{t("installation_path")}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="field__input flex-1"
                  value={newInstallPath}
                  onChange={(e) => setNewInstallPath(e.target.value)}
                  placeholder={t("installation_path_placeholder")}
                />
                <Button className="btn" onClick={handleBrowseFolder}>
                  {t("browse")}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              className="btn button--ghost flex-1"
              onClick={() => {
                setShowAddForm(false);
                setNewInstallPath("");
                setNewInstallName("");
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              className="btn btn--primary flex-1"
              onClick={handleAddInstallation}
              disabled={!newInstallPath.trim() || isAdding}
            >
              {isAdding ? t("adding") : t("add")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
