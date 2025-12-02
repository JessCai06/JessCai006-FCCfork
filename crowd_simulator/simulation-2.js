//! helpers
export function measureThroughput(gatesList) {
  return gatesList.map(gateData => ({
    id: gateData.id,
    totalServed: gateData.throughput,
    perTick: gateData.throughputPerTick.slice()
  }));
}

export function measureCongestion(gatesList) {
  return gatesList.map(gateData => ({
    id: gateData.id,
    peakQueue: gateData.peakQueue,
    reroutedOut: gateData.reroutedOut,
    reroutedIn: gateData.reroutedIn
  }));
}

export function nextTick(tick) { return tick + 1; }

function hasWork(gates, tick, maxTick) {
  return tick < maxTick || gates.some(gate => gate.pendingAttendees > 0);
}

function applyCapacityUpdate(gate, tick, capacityUpdates) {
  const updates = capacityUpdates[gate.id];
  if (updates?.[tick] != null) gate.capacity = updates[tick];
}