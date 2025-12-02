//! process gates function
function processGate(gate, gates, backups, tick) {
  gate.pendingAttendees += gate.queue[tick] ?? 0;
  if (gate.pendingAttendees > gate.peakQueue) gate.peakQueue = gate.pendingAttendees;
  let served = Math.min(gate.capacity, gate.pendingAttendees);
  gate.pendingAttendees -= served;
  gate.throughput += served;
  gate.throughputPerTick.push(served);
  handleCongestion(gate, gates, backups, tick);
}