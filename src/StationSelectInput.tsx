import { useState } from "react";
import { getStations } from "./db-api";

export default function StationSelectInput({
  label,
  query,
  setQuery,
  setId,
  className,
}: {
  label: string;
  query: string;
  setQuery: (value: string) => void;
  setId: (value: string) => void;
  className: string;
}) {
  const [results, setResults] = useState<any[]>([]);
  const [show, setShow] = useState(false);

  const handleChange = async (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    const stations = await getStations(value);
    console.log(stations);
    setResults(Object.values(stations));
    setShow(true);
  };

  const handleSelect = (station: any) => {
    setQuery(station.name);
    setId(station.id);
    setShow(false);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <label className="block mb-2">{label}:</label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
        placeholder="Berlin Hbf"
        className={`w-full p-2 rounded-md`}
      />
      {show && results.length > 0 && (
        <ul className="absolute z-100 left-0 mt-2 right-0 bg-black text-white border rounded-md max-h-60 overflow-y-auto shadow-md">
          {results.map((station) => (
            <li
              key={station.id}
              onClick={() => handleSelect(station)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {station.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
