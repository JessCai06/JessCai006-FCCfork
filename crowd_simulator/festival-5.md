---
id: festival-crowd-flow-simulator-5
title: Step 5
challengeType: 0
dashedName: step-5
---

# --description--

Now you'll build the main `simulateFestival` function that orchestrates the entire simulation. This is the core function that ties everything together.

This function should:

1. Accept `baseGates` array and an `options` object (with `backups`, `capUpdates`, etc.)
2. Extract options with default values using the nullish coalescing operator (`??`)
3. Calculate the maximum number of ticks needed by finding the longest queue
4. Clone each gate and extend it with runtime fields: `pendingAttendees`, `throughput`, `throughputPerTick`, `peakQueue`, `reroutedOut`, and `reroutedIn` (all initialized to 0 or empty arrays)
5. Use a `while` loop to process ticks until all work is complete
6. In each tick iteration: apply capacity updates, then process each gate
7. Increment the tick counter using `nextTick()`
8. Return an object with the final `gates` array and `totalTicks`

Create a function called `simulateFestival` that takes parameters `baseGates` and `options` (default to empty object). Use `.reduce()` to find the maximum queue length, `.map()` to clone gates, and `.forEach()` to process gates each tick.

You'll need helper functions `hasWork`, `applyCapacityUpdate`, `processGate`, and `nextTick` which will be implemented in later steps.

**Hint**: Use `.slice()` to copy the queue array to avoid mutating the original data.

# --hints--

You should declare a function called `simulateFestival`.

```js
assert.isFunction(simulateFestival);
```

Your `simulateFestival` function should take two parameters.

```js
assert.equal(simulateFestival.length, 2);
```

Your function should use the nullish coalescing operator (`??`) to provide default values.

```js
assert.match(code, /\?\?/);
```

Your function should use `.reduce()` to find the maximum queue length.

```js
assert.match(code, /\.reduce\s*\(/);
```

Your function should use `.map()` to clone and extend the gates.

```js
assert.match(code, /\.map\s*\(/);
```

Your function should initialize gates with all required runtime fields.

```js
const testGates = [{ id: "A", capacity: 5, queue: [3, 2] }];
const result = simulateFestival(testGates, { backups: [], capUpdates: {} });
assert.property(result.gates[0], 'pendingAttendees');
assert.property(result.gates[0], 'throughput');
assert.property(result.gates[0], 'throughputPerTick');
assert.property(result.gates[0], 'peakQueue');
assert.property(result.gates[0], 'reroutedOut');
assert.property(result.gates[0], 'reroutedIn');
```

Your function should use a `while` loop to process ticks.

```js
assert.match(code, /while\s*\(/);
```

Your function should use `.forEach()` to iterate over gates.

```js
assert.match(code, /\.forEach\s*\(/);
```

Your function should return an object with `gates` and `totalTicks` properties.

```js
const testGates = [{ id: "A", capacity: 5, queue: [3, 2] }];
const result = simulateFestival(testGates, { backups: [], capUpdates: {} });
assert.isObject(result);
assert.property(result, 'gates');
assert.property(result, 'totalTicks');
assert.isArray(result.gates);
assert.isNumber(result.totalTicks);
```

Your function should copy the queue array using `.slice()`.

```js
assert.match(code, /\.slice\s*\(\s*\)/);
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

// Helper functions (to be implemented in later steps)
function hasWork(gates, tick, maxTick) {
  return tick < maxTick || gates.some(gate => gate.pendingAttendees > 0);
}

function applyCapacityUpdate(gate, tick, capacityUpdates) {
  const updates = capacityUpdates[gate.id];
  if (updates?.[tick] != null) gate.capacity = updates[tick];
}

function nextTick(tick) {
  return tick + 1;
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

function hasWork(gates, tick, maxTick) {
  return tick < maxTick || gates.some(gate => gate.pendingAttendees > 0);
}

function applyCapacityUpdate(gate, tick, capacityUpdates) {
  const updates = capacityUpdates[gate.id];
  if (updates?.[tick] != null) gate.capacity = updates[tick];
}

function nextTick(tick) {
  return tick + 1;
}

function simulateFestival(baseGates, options = {}) {
  const backups = options.backups ?? {};
  const capacityUpdates = options.capUpdates ?? {};
  const maxTick = baseGates.reduce((max, gate) => Math.max(max, gate.queue.length), 0);
  // clone + extend gates with runtime fields
  const gates = baseGates.map(gate => ({
    id: gate.id, capacity: gate.capacity, queue: gate.queue.slice(),
    pendingAttendees: 0, throughput: 0, throughputPerTick: [],
    peakQueue: 0, reroutedOut: 0, reroutedIn: 0
  }));
  let tick = 0;
  // main while loop: time + dynamic capacity
  while (hasWork(gates, tick, maxTick)) {
    gates.forEach(gate => applyCapacityUpdate(gate, tick, capacityUpdates));
    gates.forEach(gate => processGate(gate, gates, backups, tick));
    tick = nextTick(tick);
  }
  return { gates, totalTicks: tick };
}
```
