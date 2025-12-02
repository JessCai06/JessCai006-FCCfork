//! run tests
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

// run when called directly
if (import.meta.url === `file://${process.argv[1]}`) runTests();
