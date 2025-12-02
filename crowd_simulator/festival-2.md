---
id: festival-crowd-flow-simulator-2
title: Step 2
challengeType: 0
dashedName: step-2
---

# --description--

Now that you understand the data structures, let's start building the helper functions that will support the simulation.

First, you'll create a `measureThroughput` function that analyzes how many attendees each gate successfully processed. This function will take an array of gates and return an array of objects containing throughput statistics.

Each returned object should have:
- `id`: the gate's identifier
- `totalServed`: the total number of attendees processed (from `gate.throughput`)
- `perTick`: a copy of the per-tick throughput array (from `gate.throughputPerTick`)

Create a function called `measureThroughput` that takes a parameter called `gatesList`. Use the `.map()` method to transform each gate object into a throughput statistics object with the three properties described above.

**Hint**: Use `.slice()` to create a copy of the `throughputPerTick` array.

# --hints--

You should declare a function called `measureThroughput`.

```js
assert.isFunction(measureThroughput);
```

Your `measureThroughput` function should take one parameter.

```js
assert.equal(measureThroughput.length, 1);
```

Your `measureThroughput` function should use the `.map()` method.

```js
assert.match(code, /\.map\s*\(/);
```

Your `measureThroughput` function should return an array.

```js
const testGates = [
  { id: "A", throughput: 10, throughputPerTick: [5, 3, 2] }
];
assert.isArray(measureThroughput(testGates));
```

The returned objects should have an `id` property matching the gate's id.

```js
const testGates = [
  { id: "TestGate", throughput: 10, throughputPerTick: [5, 3, 2] }
];
const result = measureThroughput(testGates);
assert.equal(result[0].id, "TestGate");
```

The returned objects should have a `totalServed` property equal to the gate's `throughput`.

```js
const testGates = [
  { id: "A", throughput: 15, throughputPerTick: [5, 5, 5] }
];
const result = measureThroughput(testGates);
assert.equal(result[0].totalServed, 15);
```

The returned objects should have a `perTick` property that is a copy of `throughputPerTick`.

```js
const testGates = [
  { id: "A", throughput: 10, throughputPerTick: [5, 3, 2] }
];
const result = measureThroughput(testGates);
assert.deepEqual(result[0].perTick, [5, 3, 2]);
assert.notStrictEqual(result[0].perTick, testGates[0].throughputPerTick);
```

# --seed--

## --seed-contents--

```js
// Festival Crowd Flow Simulator

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
const morningBackups = ["East", "West", "North"];
const eveningBackups = ["East", "West", "North"];

// dynamic capacity updates: gateId -> { tick: newCap }
const morningCapacityUpdates = { North: { 3: 3, 6: 2 }, East: { 4: 6 }, West: { 2: 1 } };
const eveningCapacityUpdates = { North: { 5: 2 }, East: { }, West: { 3: 4 } };

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
  { id: "West", capacity: 3, queue: [2, 5, 3, 1, 0, 0, 0] }
];

const eveningGates = [
  { id: "North", capacity: 4, queue: [2, 2, 2, 2, 2, 2] },
  { id: "East", capacity: 3, queue: [1, 1, 1, 5, 0, 0] },
  { id: "West", capacity: 2, queue: [0, 0, 3, 3, 3, 3] }
];

// backup routing config (per scenario)
const morningBackups = ["East", "West", "North"];
const eveningBackups = ["East", "West", "North"];

// dynamic capacity updates: gateId -> { tick: newCap }
const morningCapacityUpdates = { North: { 3: 3, 6: 2 }, East: { 4: 6 }, West: { 2: 1 } };
const eveningCapacityUpdates = { North: { 5: 2 }, East: { }, West: { 3: 4 } };

function measureThroughput(gatesList) {
  return gatesList.map(gateData => ({
    id: gateData.id,
    totalServed: gateData.throughput,
    perTick: gateData.throughputPerTick.slice()
  }));
}
```
