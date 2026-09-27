"use client";

import dynamic from "next/dynamic";

// ssr:false dynamic imports aren't allowed directly in a Server Component
// (Next 16) — this client-component wrapper is what the server layout
// imports instead, keeping the ssr:false boundary inside client code.
const VisualEditingGate = dynamic(() => import("./VisualEditingGate"), { ssr: false });

export default function VisualEditingLoader() {
  return <VisualEditingGate />;
}
