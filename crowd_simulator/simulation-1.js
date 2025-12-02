// simulation.js
// base gates: only { id, capacity, queue }
const morningGates = [
  { id: "North", capacity: 5, queue: [8, 3, 4, 10, 1, 0, 2] },
  { id: "East", capacity: 4, queue: [4, 6, 0, 2, 8, 3, 1] },
  { id: "West", capacity: 3, queue: [2, 5, 3, 1, 0, 0, 0] }
];

const eveningGates = [
  { id: "North", capacity: 4, queue: [2, 2, 2, 2, 2, 2] },
  { id: "East", capacity: 3, queue: [1, 1, 1, 5, 0, 0] },
  { id: "West", capacity: 2, queue: [0, 0, 3, 3, 3, 3] }
];

// backup routing config (per scenario)
const morningBackups = ["West"];
const eveningBackups = ["East"];

// dynamic capacity updates: gateId -> { tick: newCap }
const morningCapacityUpdates = { North: { 3: 3, 6: 2 }, East: { 4: 6 }, West: { 2: 1 } };
const eveningCapacityUpdates = { North: { 5: 2 }, East: { }, West: { 3: 4 } };
