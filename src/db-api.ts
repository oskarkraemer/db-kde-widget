import { useState, useEffect, useCallback, useRef } from "react";
import type { SettingsType } from "./SettingsModal";

const DB_API_URL = "https://v6.db.transport.rest/";
//const DB_API_URL = "http://localhost:3000/";

export async function getStations(query: string, results: number = 3) {
  const url = `${DB_API_URL}stations?query=${query}&limit=${results}&fuzzy=true`;
  const response = await fetch(url);
  return response.json();
}

export async function getStationById(id: string) {
  const url = `${DB_API_URL}stations/${id}`;
  const response = await fetch(url);
  return response.json();
}

async function getJourneys(from: string, to: string, results: number) {
  const url = `${DB_API_URL}journeys?from=${from}&to=${to}&results=${results}`;
  const response = await fetch(url);
  return response.json();
}

export function useJourneys(props: SettingsType) {
  const [journeys, setJourneys] = useState<any | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isFetching = useRef(false);

  const fetchJourneysData = useCallback(
    async (retries = 3) => {
      if (isFetching.current) return;

      isFetching.current = true;
      setIsLoading(true);
      setError(null);

      for (let i = 0; i < retries; i++) {
        try {
          console.log(`Fetching journeys (Attempt ${i + 1})...`);
          console.log(
            props.fromStationId,
            props.toStationId,
            props.refreshInterval,
          );
          const data = await getJourneys(
            props.fromStationId,
            props.toStationId,
            3,
          );

          setJourneys(data);
          setLastUpdated(new Date());
          setIsLoading(false);
          isFetching.current = false;

          console.log("Journeys data fetched successfully:", data);
          return;
        } catch (err) {
          console.error(`Attempt ${i + 1} failed:`, err);
          // Wait 2 seconds before retrying
          if (i < retries - 1)
            await new Promise((res) => setTimeout(res, 2000));
        }
      }

      // If we get here, all retries failed
      setError("Failed to load journey data after multiple attempts.");
      setIsLoading(false);
      isFetching.current = false;
    },
    [props.fromStationId, props.toStationId],
  );

  useEffect(() => {
    // Initial fetch
    fetchJourneysData();

    // Polling logic
    const interval = setInterval(() => {
      fetchJourneysData();
    }, props.refreshInterval * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchJourneysData, props.refreshInterval]);

  return {
    journeys,
    lastUpdated,
    isLoading,
    error,
    refresh: fetchJourneysData,
  };
}
