---
id: 692e463dfef29dc6e27b470a
title: Step 1
challengeType: 0
dashedName: step-1
---

# --description--

In this workshop, you'll build a Festival Crowd Flow Simulator that manages attendee flow through multiple entrance gates with dynamic capacity changes and congestion handling. You'll practice working with time-based simulations, queue processing, and data structures.

All of the starter data structures for this project have been provided for you.

The `morningGates` and `eveningGates` arrays represent two different scenarios. Each gate object contains:

- `id`: A string identifier for the gate (e.g., "North", "East", "West")
- `capacity`: The maximum number of attendees that can be processed per time tick
- `queue`: An array where each index represents a time tick, and the value is the number of attendees arriving at that tick

For example, in `morningGates`, the North gate has `capacity: 5` and `queue: [8, 3, 4, 10, 1, 0, 2]`. This means at tick 0, 8 attendees arrive; at tick 1, 3 arrive; and so on.

The `morningBackups` and `eveningBackups` arrays define backup gate routing. Each index corresponds to a gate in the same position in the gates array, and the value is the ID of the backup gate to use when that gate becomes congested.

The `morningCapacityUpdates` and `eveningCapacityUpdates` objects define dynamic capacity changes. The structure is `{ gateId: { tick: newCapacity } }`. For example, `North: { 3: 3, 6: 2 }` means the North gate's capacity changes to 3 at tick 3, and to 2 at tick 6.

When you're ready to get started, use `console.log()` to log the `morningGates` array to see its structure.

# --hints--

You should use `console.log()` to log the `morningGates` array.

```js
assert.match(code, /console\.log\(\s*morningGates\s*\)/);
```

The `morningGates` array should have exactly three gate objects.

```js
assert.strictEqual(morningGates.length, 3);
```

Each gate in `morningGates` should have an `id`, `capacity`, and `queue` property.

```js
morningGates.forEach(gate => {
  assert.isString(gate.id);
  assert.isNumber(gate.capacity);
  assert.isArray(gate.queue);
});
```

The North gate in `morningGates` should have a capacity of 5.

```js
const northGate = morningGates.find(gate => gate.id === 'North');
assert.strictEqual(northGate.capacity, 5);
```

The North gate in `morningGates` should have a queue array with 7 elements.

```js
const northGate = morningGates.find(gate => gate.id === 'North');
assert.strictEqual(northGate.queue.length, 7);
```

The first element in the North gate's queue should be 8.

```js
const northGate = morningGates.find(gate => gate.id === 'North');
assert.strictEqual(northGate.queue[0], 8);
```

The `morningBackups` array should have exactly one element.

```js
assert.strictEqual(morningBackups.length, 1);
```

The `morningCapacityUpdates` object should have a `North` property.

```js
assert.isObject(morningCapacityUpdates.North);
```

The North gate's capacity should update to 3 at tick 3.

```js
assert.strictEqual(morningCapacityUpdates.North[3], 3);
```

The `eveningGates` array structure should match `morningGates` with the same properties.

```js
eveningGates.forEach(gate => {
  assert.isString(gate.id);
  assert.isNumber(gate.capacity);
  assert.isArray(gate.queue);
});
```


# --seed--

## --seed-contents--

```js
--fcc - editable - region--;
// Festival Crowd Flow Simulator

// base gates: only { id, capacity, queue }
const morningGates = [
  { id: 'North', capacity: 5, queue: [8, 3, 4, 10, 1, 0, 2] },
  { id: 'East', capacity: 4, queue: [4, 6, 0, 2, 8, 3, 1] },
  { id: 'West', capacity: 3, queue: [2, 5, 3, 1, 0, 0, 0] }
];

const eveningGates = [
  { id: 'North', capacity: 4, queue: [2, 2, 2, 2, 2, 2] },
  { id: 'East', capacity: 3, queue: [1, 1, 1, 5, 0, 0] },
  { id: 'West', capacity: 2, queue: [0, 0, 3, 3, 3, 3] }
];

// backup routing config (per scenario)
const morningBackups = ['West'];
const eveningBackups = ['East'];

// dynamic capacity updates: gateId -> { tick: newCap }
const morningCapacityUpdates = {
  North: { 3: 3, 6: 2 },
  East: { 4: 6 },
  West: { 2: 1 }
};
const eveningCapacityUpdates = { North: { 5: 2 }, East: {}, West: { 3: 4 } };

--fcc - editable - region--;
```

# --solutions--

```js
// Festival Crowd Flow Simulator

// base gates: only { id, capacity, queue }
const morningGates = [
  { id: 'North', capacity: 5, queue: [8, 3, 4, 10, 1, 0, 2] },
  { id: 'East', capacity: 4, queue: [4, 6, 0, 2, 8, 3, 1] },
  { id: 'West', capacity: 3, queue: [2, 5, 3, 1, 0, 0, 0] }
];

const eveningGates = [
  { id: 'North', capacity: 4, queue: [2, 2, 2, 2, 2, 2] },
  { id: 'East', capacity: 3, queue: [1, 1, 1, 5, 0, 0] },
  { id: 'West', capacity: 2, queue: [0, 0, 3, 3, 3, 3] }
];

// backup routing config (per scenario)
const morningBackups = ['East', 'West', 'North'];
const eveningBackups = ['East', 'West', 'North'];

// dynamic capacity updates: gateId -> { tick: newCap }
const morningCapacityUpdates = {
  North: { 3: 3, 6: 2 },
  East: { 4: 6 },
  West: { 2: 1 }
};
const eveningCapacityUpdates = { North: { 5: 2 }, East: {}, West: { 3: 4 } };

console.log(morningGates);
```
