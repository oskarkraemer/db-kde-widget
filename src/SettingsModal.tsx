import { useEffect, useState } from "react";
import StationSelectInput from "./StationSelectInput";

export type SettingsType = {
  fromStationId: string;
  toStationId: string;
  refreshInterval: number;
  savePersistentConfig: (
    newFromStationId: string,
    newFromStationName: string,
    newToStationId: string,
    newToStationName: string,
    newRefreshInterval: number,
  ) => void;
};

type SettingsModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;

  fromStationName: string;
  toStationName: string;
} & SettingsType;

export default function SettingsModal(props: SettingsModalProps) {
  const [fromId, setFromId] = useState(props.fromStationId);
  const [fromName, setFromName] = useState(props.fromStationName);

  const [toId, setToId] = useState(props.toStationId);
  const [toName, setToName] = useState(props.toStationName);

  const [interval, setIntervalValue] = useState(props.refreshInterval);

  useEffect(() => {
    setFromId(props.fromStationId);
    setFromName(props.fromStationName);

    setToId(props.toStationId);
    setToName(props.toStationName);

    setIntervalValue(props.refreshInterval);
  }, [props.fromStationId, props.toStationId, props.refreshInterval]);

  if (!props.isOpen) return null;

  function saveSettings() {
    try {
      props.savePersistentConfig(fromId, fromName, toId, toName, interval);
    } catch (error) {
      alert("Failed to save settings: " + error);
    }
    props.setIsOpen(false);
  }

  return (
    <div className="fixed inset-1 bg-slate-950/85 backdrop-blur-md text-white flex items-center justify-center z-50 rounded-lg">
      <div className="p-6 w-full h-full">
        <h2 className="text-xl font-bold mb-4">Settings</h2>

        <StationSelectInput
          label="From"
          query={fromName}
          setQuery={setFromName}
          setId={setFromId}
          className="mb-4"
        />

        <StationSelectInput
          label="To"
          query={toName}
          setQuery={setToName}
          setId={setToId}
          className="mb-4"
        />

        <label className="block mb-2">Refresh interval (seconds):</label>
        <input
          type="number"
          value={interval}
          min={5}
          onChange={(e) => setIntervalValue(Number(e.target.value))}
          placeholder="300"
          className="w-full p-2 mb-4 rounded-md"
        />

        <button
          onClick={saveSettings}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
}
