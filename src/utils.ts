export function calculateDuration(departure: string, arrival: string): string {
  const departureTime = new Date(departure);
  const arrivalTime = new Date(arrival);
  const durationInMinutes = Math.floor(
    (arrivalTime.getTime() - departureTime.getTime()) / 60000,
  );
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  if (hours === 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}
