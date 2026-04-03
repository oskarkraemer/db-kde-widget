import { calculateDuration } from "./utils";

const colorMapping: { [key: string]: string } = {
  S: "bg-green-600",
  regional: "bg-blue-600",
  ICE: "bg-gray-900",
};

export default function JourneyComponent({ journey }: any) {
  const firstLeg = journey.legs[0];
  const lastLeg = journey.legs[journey.legs.length - 1];

  return (
    <div className="flex flex-col gap-1 p-4 pb-1">
      <div className="flex flex-row justify-between">
        <p className="font-bold">
          {firstLeg.plannedDeparture.substring(11, 16)} -{" "}
          {lastLeg.plannedArrival.substring(11, 16)}
          <span className="font-normal text-gray-400">
            | {calculateDuration(firstLeg.departure, lastLeg.arrival)}
          </span>
        </p>
        <p className="px-2 font-bold">{firstLeg.departurePlatform}</p>
      </div>

      {((firstLeg.departureDelay ?? 0) > 0 ||
        (lastLeg.arrivalDelay ?? 0) > 0) && (
        <p className="text-red-500">
          {firstLeg.departure.substring(11, 16)} -{" "}
          {lastLeg.arrival.substring(11, 16)}
        </p>
      )}
      <div className="flex flex-row gap-1 mt-2">
        {journey.legs.map((leg: any, index: number) => (
          <>
            {leg.line && (
              <p
                className={`rounded-md w-full p-1 text-center font-bold ${colorMapping[leg.line.productName] || "bg-gray-600"}`}
                key={index}
              >
                {leg.line.name}
              </p>
            )}
          </>
        ))}
      </div>
    </div>
  );
}
