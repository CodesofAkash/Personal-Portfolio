"use client";

import { useEffect, useState } from "react";
import type { Group } from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

interface SafeGLTFState {
  scene: Group | null;
  progress: number;
  failed: boolean;
}

// Loads a GLTF outside React Three Fiber's Suspense/error-boundary machinery.
// useGLTF (drei) throws while pending and re-throws on fetch failure, which
// an error boundary catches by unmounting the Canvas — but R3F's own
// reconciler can lose the race with React's unmount, producing an uncaught
// "removeChild" DOM error on top of the original failure. Resolving the
// model in plain state before the Canvas ever mounts avoids that path
// entirely: Canvas is only rendered once a scene actually exists.
export function useSafeGLTF(url: string): SafeGLTFState {
  const [state, setState] = useState<SafeGLTFState>({
    scene: null,
    progress: 0,
    failed: false,
  });

  useEffect(() => {
    let cancelled = false;

    // The Corvette model is compressed with EXT_meshopt_compression — without
    // this decoder registered, GLTFLoader can't decompress the vertex
    // buffers and silently produces garbage/NaN positions instead of
    // erroring, which is what "Featured 3D model unavailable" traced back to.
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      url,
      (gltf: GLTF) => {
        if (!cancelled) setState({ scene: gltf.scene, progress: 100, failed: false });
      },
      (event: ProgressEvent) => {
        if (!cancelled && event.lengthComputable) {
          setState((s) => ({ ...s, progress: Math.round((event.loaded / event.total) * 100) }));
        }
      },
      () => {
        if (!cancelled) setState({ scene: null, progress: 0, failed: true });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}
