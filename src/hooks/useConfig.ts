import { useEffect, useState } from "react";

declare global {
  interface Window {
    qt: {
      webChannelTransport: any;
    };
    QWebChannel: any;
  }
}

interface ConfigBridge {
  // Properties
  from_station_id: string;
  from_station_name: string;
  to_station_id: string;
  to_station_name: string;
  refresh_interval: number;

  // Save Methods
  setFromStation: (id: string, name: string) => void;
  setToStation: (id: string, name: string) => void;
  setRefreshInterval: (interval: number) => void;

  from_station_idChanged: {
    connect: (cb: (val: string) => void) => void;
    disconnect: (cb: (val: string) => void) => void;
  };
  from_station_nameChanged: {
    connect: (cb: (val: string) => void) => void;
    disconnect: (cb: (val: string) => void) => void;
  };
  to_station_idChanged: {
    connect: (cb: (val: string) => void) => void;
    disconnect: (cb: (val: string) => void) => void;
  };
  to_station_nameChanged: {
    connect: (cb: (val: string) => void) => void;
    disconnect: (cb: (val: string) => void) => void;
  };
  refresh_intervalChanged: {
    connect: (cb: (val: number) => void) => void;
    disconnect: (cb: (val: number) => void) => void;
  };
}

export function useConfig() {
  const [fromStationId, setFromStationId] = useState<string>("8011160");
  const [fromStationName, setFromStationName] = useState<string>(
    "Berlin Hauptbahnhof",
  );
  const [toStationId, setToStationId] = useState<string>("8089045");
  const [toStationName, setToStationName] =
    useState<string>("Warschauer Straße");
  const [refreshInterval, setRefreshInterval] = useState<number>(300);

  const [bridge, setBridge] = useState<ConfigBridge | null>(null);

  useEffect(() => {
    if (typeof window.qt !== "undefined" && window.QWebChannel) {
      new window.QWebChannel(window.qt.webChannelTransport, (channel: any) => {
        const configBridge = channel.objects.configBridge as ConfigBridge;

        setBridge(configBridge);

        setFromStationId(configBridge.from_station_id);
        setFromStationName(configBridge.from_station_name);
        setToStationId(configBridge.to_station_id);
        setToStationName(configBridge.to_station_name);
        setRefreshInterval(configBridge.refresh_interval);
      });
    } else {
      console.warn("Not running inside Qt WebEngine. Using fallback state.");
    }
  }, []);

  const savePersistentConfig = (
    newFromStationId: string,
    newFromStationName: string,
    newToStationId: string,
    newToStationName: string,
    newRefreshInterval: number,
  ) => {
    setFromStationId(newFromStationId);
    setFromStationName(newFromStationName);
    setToStationId(newToStationId);
    setToStationName(newToStationName);
    setRefreshInterval(newRefreshInterval);

    if (bridge) {
      bridge.setFromStation(newFromStationId, newFromStationName);
      bridge.setToStation(newToStationId, newToStationName);
      bridge.setRefreshInterval(newRefreshInterval);
    }
  };

  return {
    fromStationId,
    fromStationName,
    toStationId,
    toStationName,
    refreshInterval,
    savePersistentConfig,
  };
}
