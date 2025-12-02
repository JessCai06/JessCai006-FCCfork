//! congestion function
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