---
id: festival-crowd-flow-simulator-3
title: Step 3
challengeType: 0
dashedName: step-3
---

# --description--

Next, you'll implement the handleCongestion function, which is the heart of the backup routing system. This function detects when a gate has more pending attendees than its capacity can handle, then attempts to reroute the overflow to backup gates. It should:


1. Check if the gate's pendingAttendees exceeds its capacity
Before doing any work, compare gate.pendingAttendees to gate.capacity. If the number of people waiting at this gate is less than or equal to what it can handle this tick, there is no congestion and no rerouting needed. In that case, you should return early from the function. This keeps the logic efficient and ensures you only run the rerouting code when there is actually a problem to solve.

2. Calculate the overflow amount
If the gate is congested, compute how many attendees it cannot handle by subtracting gate.capacity from gate.pendingAttendees. For example, if there are 30 people waiting and the capacity is 20, the overflow is 10. This overflow value represents the group that needs to be moved to a backup gate, and you’ll use it both to update the current gate’s pending count and to increment the backup gate’s pending count.

3. Loop through the backups array to find the first backup gate that is not over capacity (pendingAttendees <= capacity)
The backups array stores candidate backup gate IDs in priority order. Use a for...of loop to iterate through this array and check each backup gate in turn. For each backup ID, look up the actual gate object (using gates.find(...) as suggested). For each candidate backup gate, check whether backupGate.pendingAttendees <= backupGate.capacity. This ensures you only reroute attendees to a gate that still has room this tick, mimicking a real system that tries backups in order until it finds one that can help.

4. Transfer the overflow attendees to that backup gate
Once you find an eligible backup gate, adjust both gates’ state. Decrease gate.pendingAttendees by the overflow amount, and increase backupGate.pendingAttendees by the same amount. Conceptually, this is like moving a group of people from one line to another. This step is crucial because it keeps the simulation’s state consistent: the total number of attendees in the system stays the same, but they are redistributed across gates.

4. Update the rerouting statistics (reroutedOut and reroutedIn)
To make the simulation more informative, keep track of how many attendees are rerouted. Increment gate.reroutedOut by the overflow amount to record how many people were sent away from this gate. Similarly, increment backupGate.reroutedIn by the overflow amount to record how many people were received there. These fields will be useful later when you summarize gate performance and explain how often backup routing was needed.

5. Log a success message and return early
After successfully rerouting to a backup gate, log a message that includes useful context, such as the current tick, the original gate’s ID, the backup gate’s ID, and the number of attendees moved. This logging helps learners (and testers) understand when and why rerouting happened. Once the reroute is done, you should return immediately from the function, because the congestion for this gate has been resolved and you don’t need to check any additional backup gates.

6. If no backup gate has capacity, log a congestion message
If the loop finishes and you never found a backup gate with available capacity, then the overflow cannot be rerouted anywhere. In this case, log a message indicating that the gate remains congested and that no backup was available. This models a realistic worst-case scenario (all gates overloaded) and gives clear visibility into failure conditions during the simulation.

# --hints--

You should declare a function called `handleCongestion`.

```js
assert.isFunction(handleCongestion);
```

Your `handleCongestion` function should take four parameters.

```js
assert.equal(handleCongestion.length, 4);
```

Your function should return early if `gate.pendingAttendees` is less than or equal to `gate.capacity`.

```js
const gate = { id: "A", capacity: 5, pendingAttendees: 3, reroutedOut: 0 };
const gates = [gate];
const result = handleCongestion(gate, gates, [], 0);
assert.equal(gate.pendingAttendees, 3);
```

Your function should calculate the overflow as `gate.pendingAttendees - gate.capacity`.

```js
const gate = { id: "A", capacity: 5, pendingAttendees: 8, reroutedOut: 0, reroutedIn: 0 };
const backup = { id: "B", capacity: 10, pendingAttendees: 2, reroutedOut: 0, reroutedIn: 0 };
const gates = [gate, backup];
handleCongestion(gate, gates, ["B"], 0);
assert.equal(gate.reroutedOut, 3);
```

Your function should use `gates.find()` to locate the backup gate.

```js
assert.match(code, /gates\.find\s*\(/);
```

Your function should check if the backup gate's `pendingAttendees` is less than or equal to its `capacity`.

```js
const gate = { id: "A", capacity: 5, pendingAttendees: 10, reroutedOut: 0, reroutedIn: 0 };
const backup1 = { id: "B", capacity: 3, pendingAttendees: 5, reroutedOut: 0, reroutedIn: 0 };
const backup2 = { id: "C", capacity: 10, pendingAttendees: 3, reroutedOut: 0, reroutedIn: 0 };
const gates = [gate, backup1, backup2];
handleCongestion(gate, gates, ["B", "C"], 0);
// Should skip B (over capacity) and use C
assert.equal(gate.pendingAttendees, 5);
assert.equal(backup2.pendingAttendees, 8);
```

Your function should transfer overflow attendees from the congested gate to the backup gate.

```js
const gate = { id: "A", capacity: 5, pendingAttendees: 9, reroutedOut: 0, reroutedIn: 0 };
const backup = { id: "B", capacity: 10, pendingAttendees: 2, reroutedOut: 0, reroutedIn: 0 };
const gates = [gate, backup];
handleCongestion(gate, gates, ["B"], 0);
assert.equal(gate.pendingAttendees, 5);
assert.equal(backup.pendingAttendees, 6);
```

Your function should update `reroutedOut` on the source gate and `reroutedIn` on the backup gate.

```js
const gate = { id: "A", capacity: 5, pendingAttendees: 8, reroutedOut: 0, reroutedIn: 0 };
const backup = { id: "B", capacity: 10, pendingAttendees: 2, reroutedOut: 0, reroutedIn: 0 };
const gates = [gate, backup];
handleCongestion(gate, gates, ["B"], 0);
assert.equal(gate.reroutedOut, 3);
assert.equal(backup.reroutedIn, 3);
```

Your function should use `console.log()` to log reroute messages.

```js
assert.match(code, /console\.log\s*\(/);
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
```
