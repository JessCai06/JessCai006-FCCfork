// helpers.js

export function measureThroughput(gs) {
  return gs.map(g => ({
    id: g.id,
    totalServed: g.throughput,
    perTick: g.throughputPerTick.slice()
  }));
}

export function measureCongestion(gs) {
  return gs.map(g => ({
    id: g.id,
    peakQueue: g.peakQueue,
    reroutedOut: g.reroutedOut,
    reroutedIn: g.reroutedIn
  }));
}

export function nextTick(t) {
  return t + 1;
}
