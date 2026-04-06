import { RefreshCwIcon, SettingsIcon } from "lucide-react";
import "./App.css";
import { useJourneys } from "./db-api";

import JourneyComponent from "./JourneyComponent";
import SettingsModal from "./SettingsModal";
import { useState } from "react";
import { useConfig } from "./hooks/useConfig";

function App() {
  const {
    fromStationId,
    fromStationName,
    toStationId,
    toStationName,
    refreshInterval,
    savePersistentConfig,
  } = useConfig();

  const { journeys, lastUpdated, isLoading, refresh } = useJourneys({
    fromStationId: fromStationId!,
    toStationId: toStationId!,
    refreshInterval: refreshInterval!,
    savePersistentConfig,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!navigator.userAgent.includes("QtWebEngine")) {
    document.body.style.setProperty("background-color", "black");
  }

  function swapStations() {
    const fromId = fromStationId;
    const fromName = fromStationName;
    savePersistentConfig(
      toStationId!,
      toStationName!,
      fromId!,
      fromName!,
      refreshInterval!,
    );
  }

  return (
    <>
      <section className="text-white">
        <div className="flex flex-row justify-between w-full p-4 pb-0">
          <p className="text-xl font-bold">
            {fromStationName}{" "}
            <a onClick={swapStations} className="cursor-pointer">
              ⮕
            </a>{" "}
            {toStationName}
          </p>
          <div>
            <button
              onClick={() => {
                setIsSettingsOpen(true);
              }}
              className="cursor-pointer"
            >
              <SettingsIcon className="text-gray-400 mr-2" />
            </button>
            <button
              onClick={() => {
                if (isLoading) return;
                refresh(7);
              }}
              className={isLoading ? "cursor-not-allowed" : "cursor-pointer"}
            >
              <RefreshCwIcon
                className={`text-gray-400 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-400 p-4 py-1">
          Last updated:{" "}
          {lastUpdated
            ? lastUpdated.toLocaleTimeString("en-GB", { hour12: false })
            : "Never"}
        </p>

        {journeys && (
          <div className="flex flex-col gap-y-3 mt-2">
            {journeys.journeys
              .slice(0, 3)
              .map((journey: any, index: number) => (
                <JourneyComponent key={index} journey={journey} />
              ))}
          </div>
        )}
      </section>
      <SettingsModal
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        fromStationId={fromStationId!}
        fromStationName={fromStationName!}
        toStationId={toStationId!}
        toStationName={toStationName!}
        refreshInterval={refreshInterval!}
        savePersistentConfig={savePersistentConfig}
      />
    </>
  );
}

export default App;
