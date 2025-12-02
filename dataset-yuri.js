// sample datasets
const morningGates = [
  {
    id: "North",
    capacity: 5,
    capacitySchedule: { 0: 5, 3: 3, 6: 2 },
    queue: [8, 3, 4, 10, 1, 0, 2],
    pending: 0,
    throughput: 0,
    throughputPerTick: [],
    peakQueue: 0,
    backupGateId: "East",
    reroutedOut: 0,
    reroutedIn: 0
  },
  {
    id: "East",
    capacity: 4,
    capacitySchedule: { 0: 4, 4: 6 },
    queue: [4, 6, 0, 2, 8, 3, 1],
    pending: 0,
    throughput: 0,
    throughputPerTick: [],
    peakQueue: 0,
    backupGateId: "West",
    reroutedOut: 0,
    reroutedIn: 0
  },
  {
    id: "West",
    capacity: 3,
    capacitySchedule: { 0: 3, 2: 1 },
    queue: [2, 5, 3, 1, 0, 0, 0],
    pending: 0,
    throughput: 0,
    throughputPerTick: [],
    peakQueue: 0,
    backupGateId: "North",
    reroutedOut: 0,
    reroutedIn: 0
  }
];

const eveningGates = [
  {
    id: "North",
    capacity: 4,
    capacitySchedule: { 0: 4, 5: 2 },
    queue: [2, 2, 2, 2, 2, 2],
    pending: 0,
    throughput: 0,
    throughputPerTick: [],
    peakQueue: 0,
    backupGateId: "East",
    reroutedOut: 0,
    reroutedIn: 0
  },
  {
    id: "East",
    capacity: 3,
    capacitySchedule: { 0: 3 },
    queue: [1, 1, 1, 5, 0, 0],
    pending: 0,
    throughput: 0,
    throughputPerTick: [],
    peakQueue: 0,
    backupGateId: "West",
    reroutedOut: 0,
    reroutedIn: 0
  },
  {
    id: "West",
    capacity: 2,
    capacitySchedule: { 0: 2, 3: 4 },
    queue: [0, 0, 3, 3, 3, 3],
    pending: 0,
    throughput: 0,
    throughputPerTick: [],
    peakQueue: 0,
    backupGateId: "North",
    reroutedOut: 0,
    reroutedIn: 0
  }
];
