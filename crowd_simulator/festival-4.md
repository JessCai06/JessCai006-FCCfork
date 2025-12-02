---
id: festival-crowd-flow-simulator-4
title: Step 4
challengeType: 0
dashedName: step-4
---

# --description--

Now you'll build the `processGate` function, which handles the core logic of processing attendees at each gate during a single tick.

This function orchestrates multiple operations for each gate:

1. Add arriving attendees from the queue at the current tick to `pendingAttendees`
2. Track the peak queue size by updating `peakQueue` if current `pendingAttendees` is higher
3. Calculate how many attendees can be served (the minimum of `capacity` and `pendingAttendees`)
4. Reduce `pendingAttendees` by the number served
5. Update the total `throughput` counter
6. Record the number served in the `throughputPerTick` array
7. Call `handleCongestion` to check if backup routing is needed

Create a function called `processGate` that takes four parameters: `gate`, `gates`, `backups`, and `tick`.

Use the nullish coalescing operator (`??`) to safely get the arrivals from `gate.queue[tick]`, defaulting to 0 if undefined. Use `Math.min()` to calculate the number served.

**Hint**: The queue index corresponds to the tick number - `queue[0]` contains arrivals at tick 0, `queue[1]` at tick 1, etc.

# --hints--

You should declare a function called `processGate`.

```js
assert.isFunction(processGate);
```

Your `processGate` function should take four parameters.

```js
assert.equal(processGate.length, 4);
```

Your function should add arrivals from the queue to `pendingAttendees`.

```js
const gate = { 
  id: "A", capacity: 5, queue: [3, 2, 1], 
  pendingAttendees: 0, throughput: 0, throughputPerTick: [], 
  peakQueue: 0, reroutedOut: 0, reroutedIn: 0 
};
processGate(gate, [gate], [], 0);
assert.equal(gate.pendingAttendees, 0);
```

Your function should use the nullish coalescing operator (`??`) when accessing the queue.

```js
assert.match(code, /\?\?/);
```

Your function should update `peakQueue` when `pendingAttendees` exceeds it.

```js
const gate = { 
  id: "A", capacity: 2, queue: [5, 0], 
  pendingAttendees: 0, throughput: 0, throughputPerTick: [], 
  peakQueue: 0, reroutedOut: 0, reroutedIn: 0 
};
processGate(gate, [gate], [], 0);
assert.equal(gate.peakQueue, 5);
```

Your function should use `Math.min()` to calculate the number served.

```js
assert.match(code, /Math\.min\s*\(/);
```

Your function should serve the minimum of capacity and pending attendees.

```js
const gate = { 
  id: "A", capacity: 3, queue: [5, 0], 
  pendingAttendees: 0, throughput: 0, throughputPerTick: [], 
  peakQueue: 0, reroutedOut: 0, reroutedIn: 0 
};
processGate(gate, [gate], [], 0);
assert.equal(gate.throughput, 3);
assert.equal(gate.pendingAttendees, 2);
```

Your function should update the total `throughput` counter.

```js
const gate = { 
  id: "A", capacity: 5, queue: [3, 2], 
  pendingAttendees: 0, throughput: 0, throughputPerTick: [], 
  peakQueue: 0, reroutedOut: 0, reroutedIn: 0 
};
processGate(gate, [gate], [], 0);
assert.equal(gate.throughput, 3);
```

Your function should push the number served to `throughputPerTick`.

```js
const gate = { 
  id: "A", capacity: 5, queue: [3, 2], 
  pendingAttendees: 0, throughput: 0, throughputPerTick: [], 
  peakQueue: 0, reroutedOut: 0, reroutedIn: 0 
};
processGate(gate, [gate], [], 0);
assert.deepEqual(gate.throughputPerTick, [3]);
```

Your function should call `handleCongestion` after processing.

```js
assert.match(code, /handleCongestion\s*\(/);
```

# --seed--

## --seed-contents--

```js
// Festival Crowd Flow Simulator

// base gates: only { id, capacity, queue }
const morningGates = [
  { id: "North", capacity: 5, queue: [8, 3, 4, 10, 1, 0, 2] },
  { id: "East", capacity: 4, queue: [4, 6, 0, 2, 8, 3, 1] },
  { id: "West", capacity: 3, queue: [2, 5, 3, 1, 0, 0, 0] },
  { id: "South", capacity: 2, queue: [5, 2, 3, 7, 2, 1, 0] }
];

const eveningGates = [
  { id: "North", capacity: 4, queue: [2, 2, 2, 2, 2, 2] },
  { id: "East", capacity: 3, queue: [1, 1, 1, 5, 0, 0] },
  { id: "West", capacity: 2, queue: [0, 0, 3, 3, 3, 3] },
  { id: "South", capacity: 2, queue: [3, 3, 2, 2, 1, 1] },
  { id: "Southwest", capacity: 2, queue: [2, 2, 3, 4, 0, 0] }
];

// backup routing config (per scenario)
const morningBackups = ["East", "West", "North", "South"];
const eveningBackups = ["East", "West", "North", "Southwest", "South"];

// dynamic capacity updates: gateId -> { tick: newCap }
const morningCapacityUpdates = { North: { 3: 3, 6: 2 }, East: { 4: 6 }, West: { 2: 1 }, South: { 4: 1 } };
const eveningCapacityUpdates = { North: { 5: 2 }, East: { }, West: { 3: 4 }, South: { 3: 1 }, Southwest: { 4: 1 } };

function measureThroughput(gatesList) {
  return gatesList.map(gateData => ({
    id: gateData.id,
    totalServed: gateData.throughput,
    perTick: gateData.throughputPerTick.slice()
  }));
}

function handleCongestion(gate, gates, backups, tick) {
  if (gate.pendingAttendees <= gate.capacity) return;
  const overflow = gate.pendingAttendees - gate.capacity;
  // Find first backup gate that is not over capacity
  for (const backupGateId of backups) {
    const backupGate = gates.find(g => g.id === backupGateId);
    if (backupGate && backupGate.pendingAttendees <= backupGate.capacity) {
      gate.pendingAttendees -= overflow;
      backupGate.pendingAttendees += overflow;
      gate.reroutedOut += overflow;
      backupGate.reroutedIn += overflow;
      console.log(`[T${tick}] reroute ${overflow} from ${gate.id} -> ${backupGate.id}`);
      return;
    }
  }
  // All backup gates are over capacity, do nothing
  console.log(`[T${tick}] congest at ${gate.id}, q=${gate.pendingAttendees}, all backups over capacity`);
}

--fcc-editable-region--

--fcc-editable-region--
```

# --solutions--

```js
// Festival Crowd Flow Simulator

// base gates: only { id, capacity, queue }
const morningGates = [
  { id: "North", capacity: 5, queue: [8, 3, 4, 10, 1, 0, 2] },
  { id: "East", capacity: 4, queue: [4, 6, 0, 2, 8, 3, 1] },
  { id: "West", capacity: 3, queue: [2, 5, 3, 1, 0, 0, 0] },
  { id: "South", capacity: 2, queue: [5, 2, 3, 7, 2, 1, 0] }
];

const eveningGates = [
  { id: "North", capacity: 4, queue: [2, 2, 2, 2, 2, 2] },
  { id: "East", capacity: 3, queue: [1, 1, 1, 5, 0, 0] },
  { id: "West", capacity: 2, queue: [0, 0, 3, 3, 3, 3] },
  { id: "South", capacity: 2, queue: [3, 3, 2, 2, 1, 1] },
  { id: "Southwest", capacity: 2, queue: [2, 2, 3, 4, 0, 0] }
];

// backup routing config (per scenario)
const morningBackups = ["East", "West", "North", "South"];
const eveningBackups = ["East", "West", "North", "Southwest", "South"];

// dynamic capacity updates: gateId -> { tick: newCap }
const morningCapacityUpdates = { North: { 3: 3, 6: 2 }, East: { 4: 6 }, West: { 2: 1 }, South: { 4: 1 } };
const eveningCapacityUpdates = { North: { 5: 2 }, East: { }, West: { 3: 4 }, South: { 3: 1 }, Southwest: { 4: 1 } };

function measureThroughput(gatesList) {
  return gatesList.map(gateData => ({
    id: gateData.id,
    totalServed: gateData.throughput,
    perTick: gateData.throughputPerTick.slice()
  }));
}

function handleCongestion(gate, gates, backups, tick) {
  if (gate.pendingAttendees <= gate.capacity) return;
  const overflow = gate.pendingAttendees - gate.capacity;
  // Find first backup gate that is not over capacity
  for (const backupGateId of backups) {
    const backupGate = gates.find(g => g.id === backupGateId);
    if (backupGate && backupGate.pendingAttendees <= backupGate.capacity) {
      gate.pendingAttendees -= overflow;
      backupGate.pendingAttendees += overflow;
      gate.reroutedOut += overflow;
      backupGate.reroutedIn += overflow;
      console.log(`[T${tick}] reroute ${overflow} from ${gate.id} -> ${backupGate.id}`);
      return;
    }
  }
  // All backup gates are over capacity, do nothing
  console.log(`[T${tick}] congest at ${gate.id}, q=${gate.pendingAttendees}, all backups over capacity`);
}

function processGate(gate, gates, backups, tick) {
  gate.pendingAttendees += gate.queue[tick] ?? 0;
  if (gate.pendingAttendees > gate.peakQueue) gate.peakQueue = gate.pendingAttendees;
  let served = Math.min(gate.capacity, gate.pendingAttendees);
  gate.pendingAttendees -= served;
  gate.throughput += served;
  gate.throughputPerTick.push(served);
  handleCongestion(gate, gates, backups, tick);
}
```
