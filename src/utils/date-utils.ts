export function areSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

export function getUnixFromUnixEpoch(unixEpochTimestamp: number): number {
  return Math.round(unixEpochTimestamp / 1000);
}
