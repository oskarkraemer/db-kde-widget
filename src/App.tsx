import { RefreshCwIcon, SettingsIcon } from "lucide-react";
import "./App.css";
import { useJourneys } from "./db-api";

import JourneyComponent from "./JourneyComponent";
import SettingsModal from "./SettingsModal";
import { useState } from "react";
import { useLocalStorage } from "react-use";
import {
  DEFAULT_FROM_STATION_ID,
  DEFAULT_FROM_STATION_NAME,
  DEFAULT_TO_STATION_ID,
  DEFAULT_TO_STATION_NAME,
  DEFUALT_REFRESH_INTERVAL,
} from "./defaults";

function App() {
  const [fromStationId, setFromStationId] = useLocalStorage<string | undefined>(
    "from_station_id",
    DEFAULT_FROM_STATION_ID,
  );
  const [fromStationName, setFromStationName] = useLocalStorage<
    string | undefined
  >("from_station_name", DEFAULT_FROM_STATION_NAME);

  const [toStationId, setToStationId] = useLocalStorage<string | undefined>(
    "to_station_id",
    DEFAULT_TO_STATION_ID,
  );
  const [toStationName, setToStationName] = useLocalStorage<string | undefined>(
    "to_station_name",
    DEFAULT_TO_STATION_NAME,
  );

  const [refreshInterval, setRefreshInterval] = useLocalStorage<
    number | undefined
  >("refresh_interval", DEFUALT_REFRESH_INTERVAL); //in seconds

  const { journeys, lastUpdated, isLoading, refresh } = useJourneys({
    fromStationId: fromStationId!,
    setFromStationId: setFromStationId,
    toStationId: toStationId!,
    setToStationId: setToStationId,
    refreshInterval: refreshInterval!,
    setRefreshInterval: setRefreshInterval,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  if (!navigator.userAgent.includes("QtWebEngine")) {
    document.body.style.setProperty("background-color", "black");
  }

  function swapStations() {
    const fromId = fromStationId;
    const fromName = fromStationName;
    setFromStationId(toStationId);
    setFromStationName(toStationName);

    setToStationId(fromId);
    setToStationName(fromName);
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
        setFromStationId={setFromStationId}
        fromStationName={fromStationName!}
        setFromStationName={setFromStationName}
        toStationId={toStationId!}
        setToStationId={setToStationId}
        toStationName={toStationName!}
        setToStationName={setToStationName}
        refreshInterval={refreshInterval!}
        setRefreshInterval={setRefreshInterval}
      />
    </>
  );
}

export default App;
