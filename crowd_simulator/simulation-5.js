//! overall simulator function
export function simulateFestival(baseGates, options = {}) {
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