---
id: festival-crowd-flow-simulator-6
title: Step 6
challengeType: 0
dashedName: step-6
---

# --description--

Finally, you'll create test runner functions to execute and display the results of your simulation.

First, you'll build a `summarize` function that takes a simulation result and displays formatted output to the console. This function should:

1. Destructure `gates` and `totalTicks` from the result object
2. Call `measureThroughput` and `measureCongestion` to get statistics
3. Display a "=== Summary ===" header and the total ticks
4. Display throughput data for each gate (id, total served, per-tick array)
5. Display congestion data for each gate (id, peak queue, rerouted out, rerouted in)
6. Check if all queues are empty and display "YES" or "NO"

Then create a `runTests` function that:
1. Runs the morning scenario simulation
2. Calls `summarize` to display results
3. Runs the evening scenario simulation
4. Calls `summarize` to display results

Create a function called `summarize` that takes a `result` parameter. Use `.forEach()` to iterate through the statistics arrays and `console.log()` for output. Use `.every()` to check if all gates have `pendingAttendees === 0`.

Then create a `runTests` function that calls `simulateFestival` twice with the appropriate configurations.

**Hint**: Use template literals for formatted console output and `.join(",")` to format arrays.

# --hints--

You should declare a function called `summarize`.

```js
assert.isFunction(summarize);
```

Your `summarize` function should take one parameter.

```js
assert.equal(summarize.length, 1);
```

Your `summarize` function should destructure the result object.

```js
assert.match(code, /const\s*\{[^}]*gates[^}]*totalTicks[^}]*\}\s*=\s*result/);
```

Your function should call `measureThroughput` with the gates.

```js
assert.match(code, /measureThroughput\s*\(\s*gates\s*\)/);
```

Your function should call `measureCongestion` with the gates.

```js
assert.match(code, /measureCongestion\s*\(\s*gates\s*\)/);
```

Your function should use `console.log()` to display output.

```js
assert.match(code, /console\.log\s*\(/);
```

Your function should use `.forEach()` to iterate through statistics.

```js
assert.match(code, /\.forEach\s*\(/);
```

Your function should use `.every()` to check if all queues are empty.

```js
assert.match(code, /\.every\s*\(/);
```

You should declare a function called `runTests`.

```js
assert.isFunction(runTests);
```

Your `runTests` function should call `simulateFestival` with `morningGates`.

```js
assert.match(code, /simulateFestival\s*\(\s*morningGates/);
```

Your `runTests` function should call `simulateFestival` with `eveningGates`.

```js
assert.match(code, /simulateFestival\s*\(\s*eveningGates/);
```

Your `runTests` function should call `summarize` twice.

```js
const matches = code.match(/summarize\s*\(/g);
assert.isAtLeast(matches?.length || 0, 2);
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

function measureCongestion(gatesList) {
  return gatesList.map(gateData => ({
    id: gateData.id,
    peakQueue: gateData.peakQueue,
    reroutedOut: gateData.reroutedOut,
    reroutedIn: gateData.reroutedIn
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
  const gates = baseGates.map(gate => ({
    id: gate.id, capacity: gate.capacity, queue: gate.queue.slice(),
    pendingAttendees: 0, throughput: 0, throughputPerTick: [],
    peakQueue: 0, reroutedOut: 0, reroutedIn: 0
  }));
  let tick = 0;
  while (hasWork(gates, tick, maxTick)) {
    gates.forEach(gate => applyCapacityUpdate(gate, tick, capacityUpdates));
    gates.forEach(gate => processGate(gate, gates, backups, tick));
    tick = nextTick(tick);
  }
  return { gates, totalTicks: tick };
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

function measureCongestion(gatesList) {
  return gatesList.map(gateData => ({
    id: gateData.id,
    peakQueue: gateData.peakQueue,
    reroutedOut: gateData.reroutedOut,
    reroutedIn: gateData.reroutedIn
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
  const gates = baseGates.map(gate => ({
    id: gate.id, capacity: gate.capacity, queue: gate.queue.slice(),
    pendingAttendees: 0, throughput: 0, throughputPerTick: [],
    peakQueue: 0, reroutedOut: 0, reroutedIn: 0
  }));
  let tick = 0;
  while (hasWork(gates, tick, maxTick)) {
    gates.forEach(gate => applyCapacityUpdate(gate, tick, capacityUpdates));
    gates.forEach(gate => processGate(gate, gates, backups, tick));
    tick = nextTick(tick);
  }
  return { gates, totalTicks: tick };
}

function summarize(result) {
  const { gates, totalTicks } = result;
  const throughput = measureThroughput(gates);
  const congestion = measureCongestion(gates);
  console.log("=== Summary ===");
  console.log(`ticks: ${totalTicks}`);
  console.log("Throughput:");
  throughput.forEach(d => console.log(` ${d.id}: total=${d.totalServed}, perTick=[${d.perTick.join(",")}]`));
  console.log("Congestion:");
  congestion.forEach(d => console.log(` ${d.id}: peak=${d.peakQueue}, out=${d.reroutedOut}, in=${d.reroutedIn}`));
  console.log("Queues empty:", gates.every(gate => gate.pendingAttendees === 0) ? "YES" : "NO");
}

function runTests() {
  console.log("== Morning ==");
  summarize(simulateFestival(morningGates, { backups: morningBackups, capUpdates: morningCapacityUpdates, congestionThreshold: 7 }));
  console.log("== Evening ==");
  summarize(simulateFestival(eveningGates, { backups: eveningBackups, capUpdates: eveningCapacityUpdates, congestionThreshold: 5 }));
}
```
