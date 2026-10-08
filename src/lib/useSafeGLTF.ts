"use client";

import { useEffect, useState } from "react";
import { ImageBitmapLoader, LoadingManager, type AnimationClip, type Group } from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

interface SafeGLTFState {
  scene: Group | null;
  animations: AnimationClip[];
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
    animations: [],
    progress: 0,
    failed: false,
  });

  useEffect(() => {
    let cancelled = false;

    // Compressed models here use EXT_meshopt_compression — without this
    // decoder registered, GLTFLoader can't decompress the vertex buffers
    // and silently produces garbage/NaN positions instead of erroring,
    // which is what "Featured 3D model unavailable" once traced back to.
    //
    // useWorkers() matters as much as registering the decoder itself:
    // MeshoptDecoder only moves decompression off the main thread when
    // explicitly told to — decodeGltfBufferAsync checks workers.length
    // and falls back to a synchronous main-thread decode otherwise.
    // Confirmed via a direct Lighthouse run against production: Total
    // Blocking Time was 7,080ms on a model this size, almost entirely
    // attributable to this. Likely also what was crashing PageSpeed
    // Insights' remote Lighthouse runner outright (a ~7s unresponsive
    // main thread can make its own protocol calls time out), not just
    // scoring the page poorly. Not a React Hook despite the lint rule's
    // name-pattern match — a plain MeshoptDecoder method.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    MeshoptDecoder.useWorkers(4);

    // useWorkers() above only covers vertex decompression — texture decode
    // is a separate cost GLTFLoader doesn't move off the main thread by
    // default, and it turned out to be the dominant one: a production
    // trace showed the model's own network download finishing at ~10.8s
    // (ending ~20.9s), then ~12 MORE seconds of pure main-thread work
    // before the page settled, well past when the data was actually
    // available. ImageBitmapLoader decodes images via the browser's
    // native createImageBitmap() instead of the default <img>-element
    // path, which runs off the main thread — the standard Three.js fix
    // for exactly this symptom. Registered on the loading manager so
    // GLTFLoader uses it for every texture this model references.
    const manager = new LoadingManager();
    manager.addHandler(/\.(jpe?g|png|webp|ktx2?)$/i, new ImageBitmapLoader(manager).setOptions({ imageOrientation: "flipY" }));
    const loader = new GLTFLoader(manager);
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      url,
      (gltf: GLTF) => {
        if (!cancelled) setState({ scene: gltf.scene, animations: gltf.animations, progress: 100, failed: false });
      },
      (event: ProgressEvent) => {
        if (!cancelled && event.lengthComputable) {
          setState((s) => ({ ...s, progress: Math.round((event.loaded / event.total) * 100) }));
        }
      },
      () => {
        if (!cancelled) setState({ scene: null, animations: [], progress: 0, failed: true });
      },
    );

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}
