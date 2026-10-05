"use client";

import { type ElementRef, type ReactNode, type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import {
  AnimationMixer,
  Box3,
  CubeCamera,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  NoToneMapping,
  PerspectiveCamera,
  Vector3,
  WebGLCubeRenderTarget,
  type AnimationClip,
  type Group,
  type MeshBasicMaterial,
} from "three";
import ModelErrorBoundary from "@/components/ModelErrorBoundary";
import ModelFallback from "@/components/ModelFallback";
import { useSafeGLTF } from "@/lib/useSafeGLTF";
import { MODELS } from "@/lib/cdn";

// Camera tuning mode, straight in the real hero container so values found
// here match production exactly (a separate lab page had a different aspect
// ratio/size, which is why the car's checkpoints needed re-tuning after
// migration). While true: OrbitControls are fully free (no distance/polar
// limits), the point-nav circles and reveal panel are replaced with a live
// position readout + Save/Copy bar pinned to the bottom edge. Checkpoints
// are picked and hardcoded below (CHECKPOINTS) — flip back to true here if
// any of them need re-tuning.
const TUNING_MODE = false;

// Click-to-pick mode for the marker positions, separate from TUNING_MODE
// above (camera checkpoints are already right, this was only about where
// the numbered button/panel sits). All 6 markerPos values below are now
// real re-verified picks — flip back to true if any need picking again.
const MARKER_PICK_MODE = false;

const FOV_DEG = 40;

// A multiple of the shared --hero-ui-unit (globals.css) — see that
// variable's own comment for why this replaced an independent clamp() here.
// x2.5 lands at ~40px at the ~1440px baseline, close to the original
// fixed 36px design, then grows/shrinks in step with every other hero UI
// element instead of drifting out of proportion with them.
const MARKER_SIZE = "calc(var(--hero-ui-unit) * 2.5)";

interface Checkpoint {
  label: string;
  cameraPos: [number, number, number];
  target: [number, number, number];
  // A real point on the model's surface, clicked by hand via
  // MARKER_PICK_MODE — not `target` (which is just where the camera looks,
  // not a point on the geometry; that mismatch was the original bug).
  markerPos: [number, number, number];
}

// The 6 real positions Akash picked by hand in tuning mode — one per reveal
// panel, in the same order as the Sketchfab reference's own numbered
// annotations (Sanctuary, machinery, Lightning protector, dark side,
// Dangerous climb, Steampunk). No more formula/approximation: point
// navigation just flies straight to these exact values.
const CHECKPOINTS: Checkpoint[] = [
  { label: "Sanctuary", cameraPos: [4.8210717160152825, 3.371883417880217, -4.042194331844829], target: [2.193306435777052, 3.185711561869726, 1.0279327232845215], markerPos: [-0.1502853483778331, 1.6693932859557161, 4.793827839170297] },
  { label: "Machinery", cameraPos: [8.231739014358567, -6.029397168197471, 4.9601086541606065], target: [5.681849262559194, -5.078124520041024, 5.557803212778364], markerPos: [1.2246701793970216, -3.5779482165868344, 7.503610100989376] },
  { label: "Lightning protector", cameraPos: [5.887773679556362, 10.454986333471133, 0.6808784449277355], target: [1.5494708686832375, 10.002645058779226, 1.402599597663977], markerPos: [-4.615326828377105, 10.750520358236725, -0.4461622929015273] },
  { label: "Dark side", cameraPos: [-19.728972039055165, 16.918017091729403, 16.747106126758677], target: [-0.3058442438409225, 5.291406301795986, 2.74052149906653], markerPos: [-5.94207881665506, 12.199037827564801, 5.398727006212699] },
  { label: "Dangerous climb", cameraPos: [16.480580593608263, 2.709334761406699, 16.432143453133282], target: [9.667004939860998, 0.061949129408046665, 4.043603955126122], markerPos: [4.820571304488823, -2.590434021585611, -0.5019263876768614] },
  { label: "Steampunk", cameraPos: [6.830610305256001, -0.12334877897546358, -2.742468362060534], target: [0.5898482484522549, 0.11281125979053265, -1.7042778588052996], markerPos: [1.8141110150654023, -0.43081130844006593, -3.177102562402288] },
];

export type PanelPosition = "top-left" | "top-right" | "center-left" | "center-right" | "bottom-left" | "bottom-right";

export interface HeroRevealPanel {
  position: PanelPosition;
  content: ReactNode;
}

// Only used as tuning mode's free-look starting position now that
// production point navigation reads exact values straight from CHECKPOINTS.
function sphericalOffset(distance: number, polarDeg: number, azimuthDeg: number) {
  const polar = MathUtils.degToRad(polarDeg);
  const az = MathUtils.degToRad(azimuthDeg);
  const horizontal = distance * Math.sin(polar);
  return new Vector3(horizontal * Math.sin(az), distance * Math.cos(polar), horizontal * Math.cos(az));
}

function useAutoFrame(scene: Group) {
  return useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const fovRad = MathUtils.degToRad(FOV_DEG);
    const distance = (maxDim / (2 * Math.tan(fovRad / 2))) * 1.6;
    return { center, size, distance };
  }, [scene]);
}

// The Fresnel glass look (transparent facing the camera, solid/reflective
// at the rim) is real in Sketchfab's own viewer but doesn't exist anywhere
// in the exported file's material data — verified directly: no
// KHR_materials_transmission, no alpha of any kind, on any of the 10
// materials. It's a Sketchfab-viewer-only shader that never made it into
// the GLB. This rebuilds the effect from scratch with a real glass material
// (MeshPhysicalMaterial's transmission) and a live environment reflection
// via CubeCamera — no external HDRI file, so no Suspense-loading risk.
const GLASS_MESH_MATERIAL_NAME = "sky_sketchfab";

export function GlassOrb({ scene }: { scene: Group }) {
  const { gl, scene: r3fScene } = useThree();
  const meshRef = useRef<Mesh | null>(null);
  const cubeCameraRef = useRef<CubeCamera | null>(null);
  const frameCount = useRef(0);

  useEffect(() => {
    let found: Mesh | undefined;
    scene.traverse((obj) => {
      if (obj instanceof Mesh && !Array.isArray(obj.material) && obj.material.name === GLASS_MESH_MATERIAL_NAME) {
        found = obj;
      }
    });
    if (!found) return;
    const target: Mesh = found;
    meshRef.current = target;

    const originalMap = (target.material as MeshBasicMaterial).map ?? null;
    const renderTarget = new WebGLCubeRenderTarget(128);
    const cubeCamera = new CubeCamera(0.05, 1000, renderTarget);
    target.add(cubeCamera);
    cubeCameraRef.current = cubeCamera;

    target.geometry.computeBoundingSphere();
    const radius = (target.geometry.boundingSphere?.radius ?? 1) * Math.max(target.scale.x, target.scale.y, target.scale.z);

    const glass = new MeshPhysicalMaterial({
      map: originalMap,
      color: 0xffffff,
      transmission: 1,
      roughness: 0.18,
      thickness: radius * 1.4,
      ior: 1.45,
      envMap: renderTarget.texture,
      envMapIntensity: 0.8,
    });
    target.material = glass;

    return () => {
      target.remove(cubeCamera);
      renderTarget.dispose();
      glass.dispose();
      meshRef.current = null;
      cubeCameraRef.current = null;
    };
  }, [scene]);

  useFrame(() => {
    const mesh = meshRef.current;
    const cubeCamera = cubeCameraRef.current;
    if (!mesh || !cubeCamera) return;
    // Throttled hard — a cube camera update re-renders the ENTIRE scene
    // six times (once per cube face) on top of the normal main-view
    // render, and this model's ~783K vertices make that genuinely
    // expensive, confirmed by reproducing PageSpeed Insights' crash
    // locally under forced software rendering (chrome --use-gl=swiftshader
    // — standing in for whatever headless/sandboxed environment PSI's
    // cloud runner actually uses, which almost certainly isn't backed by
    // a real GPU). The reflected surroundings (slow floating islands)
    // don't need anywhere near per-frame freshness to read correctly as
    // ambient motion — every 10th frame instead of every 3rd cuts this
    // specific cost by roughly 70% on top of that.
    frameCount.current++;
    if (frameCount.current % 10 !== 0) return;
    mesh.visible = false;
    cubeCamera.update(gl, r3fScene);
    mesh.visible = true;
  });

  return null;
}

const SceneContent = ({
  scene,
  animations,
  onPick,
}: {
  scene: Group;
  animations: AnimationClip[];
  onPick?: (point: Vector3) => void;
}) => {
  const mixerRef = useRef<AnimationMixer | null>(null);

  useEffect(() => {
    if (animations.length === 0) return;
    const mixer = new AnimationMixer(scene);
    animations.forEach((clip) => mixer.clipAction(clip).reset().play());
    mixerRef.current = mixer;
    return () => {
      mixer.stopAllAction();
      mixerRef.current = null;
    };
  }, [scene, animations]);

  useFrame((_, delta) => {
    mixerRef.current?.update(delta);
  });

  // No scene lights here — every material on this model is KHR_materials_unlit
  // with hand-painted, lighting-baked-into-the-texture color (confirmed via
  // the model's own description), so dynamic lights would have zero visible
  // effect regardless of intensity. That's also why NoToneMapping is set on
  // the canvas below: ACES filmic tone mapping is built for lit/HDR scenes
  // and visibly dulls flat, intentionally-authored color like this.
  return (
    <>
      <primitive
        object={scene}
        onClick={
          onPick &&
          ((e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onPick(e.point.clone());
          })
        }
      />
      <GlassOrb scene={scene} />
    </>
  );
};

// Flies the camera + OrbitControls target toward whichever point is active,
// then gets out of the way once it arrives. A manual drag cancels the
// transition immediately (see OrbitControls' onStart below) so a mid-flight
// click-and-drag never fights the animation.
const CameraRig = ({
  targetPos,
  lookAt,
  controlsRef,
  transitioningRef,
}: {
  targetPos: Vector3;
  lookAt: Vector3;
  controlsRef: RefObject<ElementRef<typeof OrbitControls> | null>;
  transitioningRef: RefObject<boolean>;
}) => {
  useFrame(({ camera }, delta) => {
    if (!transitioningRef.current) return;
    // Slower than the first pass (was 3.5) for a more cinematic "flying to
    // this spot" feel, closer to the ~1.5-2s transitions in the reference.
    const damping = 1 - Math.exp(-delta * 1.4);
    camera.position.lerp(targetPos, damping);
    const controls = controlsRef.current;
    if (controls) {
      controls.target.lerp(lookAt, damping);
      controls.update();
    }
    if (camera.position.distanceTo(targetPos) < 0.01) {
      transitioningRef.current = false;
    }
  });
  return null;
};

// Drives the canvas's frameloop="demand" at a fixed rate via a plain
// setInterval — deliberately not requestAnimationFrame — so the render
// rate is actually capped rather than merely following whatever the
// display's native refresh rate is. invalidate() asks R3F to render
// exactly one frame; everything already in the scene (CameraRig's
// transitions, GlassOrb's reflection, MarkerProjector's tracking, the
// GLTF animation mixer) keeps working unchanged, since each is still
// driven by useFrame — they just now fire at this capped rate instead of
// uncapped. OrbitControls' own drag/zoom interaction still renders
// responsively on top of this, independent of the interval: drei's
// OrbitControls calls invalidate() itself on every change under
// frameloop="demand", which is the standard, supported way it integrates
// with demand mode.
const FrameRateCap = ({ fps }: { fps: number }) => {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    const id = setInterval(invalidate, 1000 / fps);
    return () => clearInterval(id);
  }, [invalidate, fps]);
  return null;
};

// A PerspectiveCamera's `fov` is its VERTICAL field of view — the
// HORIZONTAL fov (what actually determines how much of a wide scene like
// this one is visible side-to-side) shrinks automatically as the canvas
// gets narrower, purely from aspect ratio math. That's what made the model
// look increasingly zoomed-in/cropped on tall, narrow phone screens even
// with the same fov number. REFERENCE_ASPECT is roughly the desktop aspect
// the checkpoints were framed for; below it, this widens the vertical fov
// just enough to hold the horizontal fov steady, so the framing scales down
// gracefully instead of narrowing in.
const REFERENCE_ASPECT = 16 / 9;

const ResponsiveFov = ({ baseFov }: { baseFov: number }) => {
  useFrame(({ camera, size }) => {
    if (!(camera instanceof PerspectiveCamera)) return;
    const aspect = size.width / size.height;
    const targetFov =
      aspect >= REFERENCE_ASPECT
        ? baseFov
        : (() => {
            const baseFovRad = MathUtils.degToRad(baseFov);
            const hFovAtReference = 2 * Math.atan(Math.tan(baseFovRad / 2) * REFERENCE_ASPECT);
            return MathUtils.radToDeg(2 * Math.atan(Math.tan(hFovAtReference / 2) / aspect));
          })();
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
};

export interface MarkerScreenPos {
  x: number;
  y: number;
  visible: boolean;
}

// Projects each marker's 3D world position to 2D screen space every frame
// and reports it up as plain React state — deliberately NOT using drei's
// <Html>. <Html>'s portal-based mounting hit a real, reproducible bug: a
// Next.js dev-overlay-blocking "Attempted to synchronously unmount a root
// while React was already rendering" error, consistently on the very first
// marker in the array, that survived several targeted fixes (removing
// occlude, delaying activation past first paint). This sidesteps the whole
// mechanism — same useFrame-reporting-to-state pattern already proven
// reliable here by TuningReadout, just for camera.project() instead of
// camera position. v.z >= 1 means the point is behind the camera, where a
// projected x/y is meaningless.
const MarkerProjector = ({
  positions,
  onUpdate,
}: {
  positions: [number, number, number][];
  onUpdate: (screens: MarkerScreenPos[]) => void;
}) => {
  // Heavier per-frame damping (was 0.35) plus a dead zone below it — drei's
  // OrbitControls runs with damping enabled, and damped velocity approaches
  // zero asymptotically rather than actually reaching it, so there's a tiny
  // perpetual residual drift even completely at rest. Invisible across a
  // whole 3D scene; very visible as a couple of pixels of shimmer on a
  // crisp 36px UI circle. The dead zone stops reporting (and re-rendering)
  // once a marker is within half a pixel of settled, so it actually comes
  // to rest instead of chasing sub-pixel noise forever.
  const smoothedRef = useRef<MarkerScreenPos[]>([]);
  const DEAD_ZONE = 0.5;

  useFrame(({ camera, size }) => {
    const v = new Vector3();
    const raw = positions.map(([x, y, z]) => {
      v.set(x, y, z).project(camera);
      return {
        x: ((v.x + 1) / 2) * size.width,
        y: ((1 - v.y) / 2) * size.height,
        visible: v.z < 1,
      };
    });

    const prev = smoothedRef.current;
    const next =
      prev.length === raw.length
        ? raw.map((r, i) => {
            const dx = r.x - prev[i].x;
            const dy = r.y - prev[i].y;
            if (Math.abs(dx) < DEAD_ZONE && Math.abs(dy) < DEAD_ZONE) return prev[i];
            return { x: MathUtils.lerp(prev[i].x, r.x, 0.18), y: MathUtils.lerp(prev[i].y, r.y, 0.18), visible: r.visible };
          })
        : raw;
    smoothedRef.current = next;
    onUpdate(next);
  });
  return null;
};

// The actual numbered circles + active-point content panel, as plain
// absolutely-positioned DOM — a regular sibling of the Canvas, not
// anything portaled from inside it. Sketchfab-style: pinned to each
// checkpoint's position on the model, panel rendered right next to the
// active one instead of a fixed screen corner.
const MarkerOverlay = ({
  panels,
  screens,
  activePoint,
  panelOpen,
  onSelect,
}: {
  panels: HeroRevealPanel[];
  screens: MarkerScreenPos[];
  activePoint: number;
  panelOpen: boolean;
  onSelect: (i: number) => void;
}) => (
  <>
    {panels.map((panel, i) => {
      const screen = screens[i];
      if (!screen || !screen.visible) return null;
      const cp = CHECKPOINTS[i % CHECKPOINTS.length];
      // Closing deselects fully — both the highlight color and the panel
      // depend on panelOpen, so a closed point looks and reads as closed.
      const isActive = panelOpen && i === activePoint;
      // The panel always opened to the right of its marker before — fine
      // on a wide screen, but on a narrow one a marker past the halfway
      // point sent the (~20-unit-wide) panel spilling off the right edge.
      // A left/right flip alone isn't enough below ~640px though: at
      // phone widths the panel is nearly as wide as the whole viewport,
      // so there's no room on *either* side of a centrally-placed marker.
      // Below that width the panel stops being anchored to the marker at
      // all and becomes a fixed, centered overlay instead — the same
      // side-popover-becomes-a-sheet pattern most mobile UIs use.
      const openLeft = typeof window !== "undefined" && screen.x > window.innerWidth / 2;
      const isNarrow = typeof window !== "undefined" && window.innerWidth < 640;
      return (
        <div key={i} className="absolute flex items-center" style={{ left: screen.x, top: screen.y, transform: "translate(-50%, -50%)", zIndex: 15 }}>
          <button
            type="button"
            onClick={(e) => {
              // Stops this from also bubbling to the "click anywhere else
              // closes the panel" handler on the container below — without
              // this, opening and closing would fire in the same click.
              e.stopPropagation();
              onSelect(i);
            }}
            aria-label={`View point ${i + 1}: ${cp.label}`}
            className="pointer-events-auto cursor-pointer rounded-full border-[1.5px] border-white hover:border-cyan-400 flex items-center justify-center font-semibold transition-colors duration-200"
            style={{
              // Multiples of --hero-ui-unit (globals.css) — grows/shrinks
              // in step with the panel, navigator and scroll indicator
              // instead of each having its own independently-tuned clamp().
              width: MARKER_SIZE,
              height: MARKER_SIZE,
              fontSize: "calc(var(--hero-ui-unit) * 0.85)",
              background: isActive ? "#0891b2" : "rgba(15,23,42,0.75)",
              color: "#fff",
            }}
          >
            {i + 1}
          </button>
          {isActive &&
            (isNarrow ? (
              // Fixed + centered on the true viewport, completely
              // independent of the marker's own position — top-anchored
              // (below the navbar) rather than bottom, so it doesn't
              // collide with the navigator/scroll-indicator cluster still
              // sitting near the bottom of the screen on mobile.
              <div
                className="pointer-events-auto fixed left-1/2 -translate-x-1/2 rounded-2xl transition-opacity duration-500"
                style={{
                  top: "calc(var(--navbar-height) + 1rem)",
                  // Reverted to a fixed width — fit-content was wrong for
                  // wrapping text: a browser sizes fit-content on wrapped
                  // text down toward its widest single word, not a
                  // readable paragraph width, so the longer panels
                  // (identity/what/how) turned into a tall narrow column.
                  // Short panels (a stat) having some empty space is the
                  // better tradeoff versus long panels being unreadable.
                  width: "calc(100vw - 2rem)",
                  maxWidth: "26rem",
                  padding: "calc(var(--hero-ui-unit) * 1)",
                  fontSize: "calc(var(--hero-ui-unit) * 0.9)",
                  background: "rgba(15,23,42,0.95)",
                  border: "1px solid rgba(148,163,184,0.15)",
                  zIndex: 25,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {panel.content}
              </div>
            ) : (
              <div
                className={`pointer-events-auto absolute rounded-2xl transition-opacity duration-500 ${openLeft ? "right-full mr-3" : "left-full ml-3"}`}
                style={{
                  // Reverted to a fixed width — see the mobile branch's
                  // comment above for why fit-content was wrong here.
                  width: "calc(var(--hero-ui-unit) * 20)",
                  maxWidth: "calc(100vw - 2rem)",
                  padding: "calc(var(--hero-ui-unit) * 1)",
                  fontSize: "calc(var(--hero-ui-unit) * 0.9)",
                  background: "rgba(15,23,42,0.9)",
                  border: "1px solid rgba(148,163,184,0.15)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {panel.content}
              </div>
            ))}
        </div>
      );
    })}
  </>
);

// Reports live camera + OrbitControls target up to the DOM readout, only
// while tuning — no cost in the real point-navigation mode.
const TuningReadout = ({
  controlsRef,
  onUpdate,
}: {
  controlsRef: RefObject<ElementRef<typeof OrbitControls> | null>;
  onUpdate: (pos: Vector3, target: Vector3) => void;
}) => {
  useFrame(({ camera }) => {
    const target = controlsRef.current?.target;
    if (target) onUpdate(camera.position, target);
  });
  return null;
};

// Touchpad drag/scroll for fine camera control is genuinely painful — these
// drive the button clicks through synthetic DOM events on the canvas
// instead of mutating camera.position/controls.target directly. That first
// approach silently did nothing: modern three.js OrbitControls keeps its
// own persistent internal spherical/pan state across frames rather than
// re-deriving it from camera.position each call, and since drei calls
// .update() automatically every frame regardless of us, any position we set
// by hand just got overwritten by that stale internal state on the very
// next frame. Dispatching the same pointer/wheel events a real drag or
// scroll produces goes through the actual gesture handlers that update that
// internal state correctly — the only reliable way to drive it
// programmatically.
type Controls = NonNullable<ElementRef<typeof OrbitControls>>;

function simulateDrag(el: HTMLElement, dx: number, dy: number, button: 0 | 2) {
  const rect = el.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const base = { bubbles: true, cancelable: true, pointerId: 9001, pointerType: "mouse", isPrimary: true, button, buttons: button === 0 ? 1 : 2 };
  el.dispatchEvent(new PointerEvent("pointerdown", { ...base, clientX: x, clientY: y }));
  el.dispatchEvent(new PointerEvent("pointermove", { ...base, clientX: x + dx, clientY: y + dy }));
  el.dispatchEvent(new PointerEvent("pointerup", { ...base, clientX: x + dx, clientY: y + dy }));
}

function simulateWheel(el: HTMLElement, deltaY: number) {
  const rect = el.getBoundingClientRect();
  el.dispatchEvent(
    new WheelEvent("wheel", {
      bubbles: true,
      cancelable: true,
      deltaY,
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
    }),
  );
}

// Left-drag orbits (look around); pixel deltas, not degrees — OrbitControls
// scales rotation by the element's size internally.
function orbitBy(controls: Controls, dx: number, dy: number) {
  simulateDrag(controls.domElement as HTMLElement, dx, dy, 0);
}

// Scroll zooms toward/away from the target — the only OrbitControls gesture
// that moves depth-wise, so this also covers "forward/back".
function dollyBy(controls: Controls, deltaY: number) {
  simulateWheel(controls.domElement as HTMLElement, deltaY);
}

// Right-drag pans — screen-space left/right/up/down only, not true forward
// movement (OrbitControls has no native "walk forward" gesture; zoom is the
// only depth control it supports).
function panBy(controls: Controls, dx: number, dy: number) {
  simulateDrag(controls.domElement as HTMLElement, dx, dy, 2);
}

// Fires once immediately, then repeats while held — a single click per
// degree of rotation is exactly the tedium this is meant to fix.
const HoldButton = ({ onTrigger, ariaLabel, children }: { onTrigger: () => void; ariaLabel: string; children: ReactNode }) => {
  const intervalRef = useRef<number | null>(null);

  const stop = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  const start = () => {
    stop();
    onTrigger();
    intervalRef.current = window.setInterval(onTrigger, 80);
  };

  useEffect(() => stop, []);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold select-none"
      style={{ background: "rgba(148,163,184,0.15)", color: "#e2e8f0", touchAction: "none" }}
    >
      {children}
    </button>
  );
};

const HeroSceneExperience = ({ modelUrl, panels }: { modelUrl?: string; panels: HeroRevealPanel[] }) => {
  const { scene, animations, progress, failed } = useSafeGLTF(modelUrl || MODELS.desktopPc);

  if (!scene) {
    return <ModelFallback label="Featured 3D model" loading={!failed} progress={progress} />;
  }

  return <HeroSceneInner scene={scene} animations={animations} panels={panels} />;
};

// Split out so useAutoFrame (which needs a non-null scene) can be an
// unconditional hook call — HeroSceneExperience itself returns early while
// the model is still loading, before any of these hooks would run.
const HeroSceneInner = ({ scene, animations, panels }: { scene: Group; animations: AnimationClip[]; panels: HeroRevealPanel[] }) => {
  const { center, distance } = useAutoFrame(scene);
  const [activePoint, setActivePoint] = useState(0);
  // Separate from activePoint — closing the panel (a click that isn't on a
  // marker) shouldn't move the camera or lose track of which point it's
  // currently on, so activePoint itself never goes back to "nothing".
  const [panelOpen, setPanelOpen] = useState(true);
  const controlsRef = useRef<ElementRef<typeof OrbitControls>>(null);
  const transitioningRef = useRef(false);

  // Screen-space marker positions, reported every frame by MarkerProjector
  // (inside the Canvas) and consumed by MarkerOverlay (outside it, plain
  // DOM) — see MarkerProjector's own comment for why this replaced drei's
  // <Html> entirely rather than working around it.
  const [markerScreens, setMarkerScreens] = useState<MarkerScreenPos[]>([]);

  // Tuning mode still wants a free-look start centered on the scene; a
  // fresh array literal here was the actual free-navigation bug in tuning
  // (drei's OrbitControls re-applies `target` whenever that array reference
  // changes, and TuningReadout's per-frame setLive() re-renders every frame)
  // — `center` is stable from useAutoFrame's own memo, so this only
  // recomputes when the scene itself changes. Production mode starts
  // pointed at CHECKPOINTS[0]'s real target instead of the scene center.
  const initialTarget = useMemo(
    (): [number, number, number] => (TUNING_MODE ? [center.x, center.y, center.z] : CHECKPOINTS[0].target),
    [center],
  );

  const [live, setLive] = useState<{ pos: [number, number, number]; target: [number, number, number] }>({
    pos: [0, 0, 0],
    target: [0, 0, 0],
  });
  // Tuning mode saves camera checkpoints only (no markerPos — that's picked
  // separately below, via MARKER_PICK_MODE), so this is its own narrower
  // shape rather than the full production Checkpoint type.
  const [checkpoints, setCheckpoints] = useState<Array<{ label: string; cameraPos: [number, number, number]; target: [number, number, number] }>>([]);
  const [copied, setCopied] = useState(false);

  const saveCheckpoint = () => {
    setCheckpoints((prev) => {
      const next = [...prev, { label: `Point ${prev.length + 1}`, cameraPos: live.pos, target: live.target }];
      console.log("[hero tuning] checkpoints", next);
      return next;
    });
  };

  const copyCheckpoints = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(checkpoints, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard permission denied — they're already logged to console above
    }
  };

  // Tuning mode has no picked checkpoint yet to start from, so it still
  // auto-frames a wide establishing shot from the model's own bounding box.
  // Production mode flies straight to CHECKPOINTS[0]'s exact hand-picked
  // camera position — no more formula, so the page loads already on the
  // real first shot instead of an approximation of it.
  const startPos = useMemo(() => {
    if (TUNING_MODE) {
      const offset = sphericalOffset(distance * 0.7, 55, 35);
      return new Vector3(center.x + offset.x, center.y + offset.y, center.z + offset.z);
    }
    return new Vector3(...CHECKPOINTS[0].cameraPos);
  }, [center, distance]);

  // Each checkpoint's exact hand-picked camera position + look-at target —
  // CameraRig lerps toward these on click, no per-point math involved.
  // Modulo guards against `panels` (CMS-editorial, variable length) ever
  // outnumbering the 6 hand-picked CHECKPOINTS.
  const activeTarget = useMemo(() => new Vector3(...CHECKPOINTS[activePoint % CHECKPOINTS.length].cameraPos), [activePoint]);
  const activeLookAt = useMemo(() => new Vector3(...CHECKPOINTS[activePoint % CHECKPOINTS.length].target), [activePoint]);

  const goToPoint = (i: number) => {
    setActivePoint(i);
    setPanelOpen(true);
    transitioningRef.current = true;
  };

  // MARKER_PICK_MODE state — last point clicked directly on the model
  // (world-space, from SceneContent's onClick/raycast), and the draft set
  // of per-point picks assigned to it via the "Set N" buttons below.
  const [pickedPoint, setPickedPoint] = useState<Vector3 | null>(null);
  const [markerDraft, setMarkerDraft] = useState<Record<number, [number, number, number]>>({});
  const [markerCopied, setMarkerCopied] = useState(false);

  const saveMarker = (i: number) => {
    if (!pickedPoint) return;
    setMarkerDraft((prev) => ({ ...prev, [i]: [pickedPoint.x, pickedPoint.y, pickedPoint.z] }));
  };

  const copyMarkerDraft = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(markerDraft, null, 2));
      setMarkerCopied(true);
      setTimeout(() => setMarkerCopied(false), 1500);
    } catch {
      // clipboard permission denied — logged to console below on every pick
    }
  };

  // One 3D position per panel, for MarkerProjector — a picked draft
  // (MARKER_PICK_MODE) previews immediately, otherwise the hardcoded value.
  const markerPositions = useMemo(
    (): [number, number, number][] => panels.map((_, i) => markerDraft[i] ?? CHECKPOINTS[i % CHECKPOINTS.length].markerPos),
    [panels, markerDraft],
  );

  return (
    <div
      className="relative w-full h-full"
      // A real click (not a drag-to-orbit — browsers only fire `click` when
      // pointerdown/up land in nearly the same spot) anywhere that isn't a
      // marker or the navigator closes the open panel. Those two stop
      // propagation before this ever sees the event.
      onClick={!TUNING_MODE ? () => setPanelOpen(false) : undefined}
    >
      {/* The red-to-black backdrop lives at the Hero.tsx <section> level now
          (full viewport width, outside this component's max-w-7xl/
          overflow-hidden ancestor) — this Canvas still needs alpha:true so
          its own clear color doesn't paint over it. */}
      <ModelErrorBoundary label="Featured 3D model">
        {/* frameloop="demand" + FrameRateCap below, not the implicit
            "always" loop — the scene does need continuous animation (the
            glass orb's live reflection, the floating islands it reflects),
            so frameloop="demand" alone would wrongly freeze it. But
            "always" renders at the display's full native refresh rate
            with no ceiling — 60fps on most phones, 120fps+ on newer ones —
            forever, for an animation whose motion doesn't need anywhere
            near that. That's sustained, non-trivial CPU/GPU work that
            never meaningfully idles, which is suspected to be why
            PageSpeed Insights' Lighthouse run crashes specifically inside
            its own checkForQuiet step: it's waiting for CPU activity to
            settle before proceeding, and a scene that's always actively
            rendering may never cross whatever threshold it needs to see.
            Capping to a fixed, modest rate keeps the animation visually
            unchanged while removing that sustained load — confirm against
            a fresh audit after this ships, this is a strong lead, not a
            guaranteed fix.
            Everything below remains from the earlier dead-weight pass:
            - No `shadows` — every material here is KHR_materials_unlit
              with baked-in lighting (see SceneContent below) and nothing
              in this file ever sets castShadow/receiveShadow.
            - No `preserveDrawingBuffer` — nothing in the codebase ever
              reads this canvas's buffer back.
            - `dpr={[1, 2]}` caps rendering at 2x device pixel ratio
              instead of the uncapped default. */}
        <Canvas
          frameloop="demand"
          dpr={[1, 2]}
          camera={{ fov: FOV_DEG, position: [startPos.x, startPos.y, startPos.z], near: distance / 100, far: distance * 100 }}
          gl={{ toneMapping: NoToneMapping, alpha: true }}
          style={{ position: "relative" }}
        >
          <FrameRateCap fps={30} />
          <ResponsiveFov baseFov={FOV_DEG} />
          <OrbitControls
            ref={controlsRef}
            makeDefault
            target={initialTarget}
            enableZoom
            enablePan={TUNING_MODE}
            minDistance={TUNING_MODE ? undefined : distance * 0.15}
            maxDistance={TUNING_MODE ? undefined : distance * 6}
            minPolarAngle={TUNING_MODE ? 0 : MathUtils.degToRad(2)}
            maxPolarAngle={TUNING_MODE ? Math.PI : MathUtils.degToRad(178)}
            onStart={() => {
              transitioningRef.current = false;
            }}
          />
          {TUNING_MODE && (
            <TuningReadout
              controlsRef={controlsRef}
              onUpdate={(pos, target) => setLive({ pos: [pos.x, pos.y, pos.z], target: [target.x, target.y, target.z] })}
            />
          )}
          {!TUNING_MODE && (
            <>
              <CameraRig targetPos={activeTarget} lookAt={activeLookAt} controlsRef={controlsRef} transitioningRef={transitioningRef} />
              <MarkerProjector positions={markerPositions} onUpdate={setMarkerScreens} />
            </>
          )}
          <SceneContent
            scene={scene}
            animations={animations}
            onPick={
              MARKER_PICK_MODE
                ? (point) => {
                    setPickedPoint(point);
                    console.log("[marker pick]", [point.x, point.y, point.z]);
                  }
                : undefined
            }
          />
        </Canvas>
      </ModelErrorBoundary>

      {TUNING_MODE ? (
        <>
          {/* Button-driven nav, via synthetic events (see orbitBy/dollyBy/
              panBy above) — direction/sign is a first guess since I can't
              test it myself; tell me if any of these feel inverted and it's
              a one-line flip. Rotate = left-drag (look around). Pan =
              right-drag (shift the view left/right/up/down on screen).
              Zoom = scroll (the only gesture that moves toward/away from
              the target — OrbitControls has no separate "walk forward"). */}
          <div className="absolute bottom-14 right-4 flex flex-col gap-3 p-3 rounded-xl" style={{ zIndex: 20, background: "rgba(5,8,22,0.75)" }}>
            <div className="grid grid-cols-3 gap-1" style={{ width: "7.5rem" }}>
              <span />
              <HoldButton ariaLabel="Rotate up" onTrigger={() => controlsRef.current && orbitBy(controlsRef.current, 0, -40)}>↑</HoldButton>
              <span />
              <HoldButton ariaLabel="Rotate left" onTrigger={() => controlsRef.current && orbitBy(controlsRef.current, -40, 0)}>←</HoldButton>
              <span className="flex items-center justify-center text-[10px]" style={{ color: "#64748b" }}>rotate</span>
              <HoldButton ariaLabel="Rotate right" onTrigger={() => controlsRef.current && orbitBy(controlsRef.current, 40, 0)}>→</HoldButton>
              <span />
              <HoldButton ariaLabel="Rotate down" onTrigger={() => controlsRef.current && orbitBy(controlsRef.current, 0, 40)}>↓</HoldButton>
              <span />
            </div>

            <div className="grid grid-cols-3 gap-1" style={{ width: "7.5rem" }}>
              <span />
              <HoldButton ariaLabel="Pan up" onTrigger={() => controlsRef.current && panBy(controlsRef.current, 0, 40)}>↑</HoldButton>
              <span />
              <HoldButton ariaLabel="Pan left" onTrigger={() => controlsRef.current && panBy(controlsRef.current, -40, 0)}>←</HoldButton>
              <span className="flex items-center justify-center text-[10px]" style={{ color: "#64748b" }}>pan</span>
              <HoldButton ariaLabel="Pan right" onTrigger={() => controlsRef.current && panBy(controlsRef.current, 40, 0)}>→</HoldButton>
              <span />
              <HoldButton ariaLabel="Pan down" onTrigger={() => controlsRef.current && panBy(controlsRef.current, 0, -40)}>↓</HoldButton>
              <span />
            </div>

            <div className="flex items-center justify-center gap-2">
              <HoldButton ariaLabel="Zoom out (move back)" onTrigger={() => controlsRef.current && dollyBy(controlsRef.current, 100)}>−</HoldButton>
              <span className="text-[10px]" style={{ color: "#64748b" }}>zoom</span>
              <HoldButton ariaLabel="Zoom in (move forward)" onTrigger={() => controlsRef.current && dollyBy(controlsRef.current, -100)}>+</HoldButton>
            </div>
          </div>

          <div
            className="absolute bottom-0 inset-x-0 flex flex-wrap items-center gap-3 px-4 py-2 text-xs font-mono"
            style={{ zIndex: 20, background: "rgba(5,8,22,0.85)", borderTop: "1px solid rgba(148,163,184,0.15)" }}
          >
            <span>cam: [{live.pos.map((n) => Math.round(n * 1000) / 1000).join(", ")}]</span>
            <span>target: [{live.target.map((n) => Math.round(n * 1000) / 1000).join(", ")}]</span>
            <button type="button" onClick={saveCheckpoint} className="px-3 py-1 rounded-lg font-semibold" style={{ background: "#7c3aed", color: "#fff" }}>
              Save ({checkpoints.length})
            </button>
            {checkpoints.length > 0 && (
              <button type="button" onClick={copyCheckpoints} className="px-3 py-1 rounded-lg" style={{ background: "rgba(13,148,136,0.25)", color: "#5eead4" }}>
                {copied ? "Copied" : "Copy all"}
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <MarkerOverlay panels={panels} screens={markerScreens} activePoint={activePoint} panelOpen={panelOpen} onSelect={goToPoint} />

          {/* Prev/next step navigator — shows the current point's label.
              Every size here is a multiple of the same --hero-ui-unit
              (globals.css) the markers, panel and scroll pill use, so all
              of it scales together in proportion instead of each element
              saturating at its own independently-tuned clamp(). */}
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center rounded-full"
            style={{
              bottom: "calc(var(--hero-ui-unit) * 6)",
              gap: "calc(var(--hero-ui-unit) * 0.6)",
              padding: "calc(var(--hero-ui-unit) * 0.5) calc(var(--hero-ui-unit) * 1.2)",
              background: "rgba(15,23,42,0.75)",
              border: "1px solid rgba(148,163,184,0.2)",
              zIndex: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => goToPoint((activePoint - 1 + panels.length) % panels.length)}
              aria-label="Previous point"
              className="cursor-pointer rounded-full flex items-center justify-center transition-colors duration-200 hover:text-cyan-400"
              style={{
                width: "calc(var(--hero-ui-unit) * 1.8)",
                height: "calc(var(--hero-ui-unit) * 1.8)",
                fontSize: "calc(var(--hero-ui-unit) * 1.1)",
                color: "#e2e8f0",
              }}
            >
              ‹
            </button>
            <span
              className="font-semibold tracking-wide text-center"
              style={{ fontSize: "calc(var(--hero-ui-unit) * 0.85)", minWidth: "calc(var(--hero-ui-unit) * 7)", color: "#f8fafc" }}
            >
              {CHECKPOINTS[activePoint % CHECKPOINTS.length].label}
            </span>
            <button
              type="button"
              onClick={() => goToPoint((activePoint + 1) % panels.length)}
              aria-label="Next point"
              className="cursor-pointer rounded-full flex items-center justify-center transition-colors duration-200 hover:text-cyan-400"
              style={{
                width: "calc(var(--hero-ui-unit) * 1.8)",
                height: "calc(var(--hero-ui-unit) * 1.8)",
                fontSize: "calc(var(--hero-ui-unit) * 1.1)",
                color: "#e2e8f0",
              }}
            >
              ›
            </button>
          </div>
        </>
      )}

      {MARKER_PICK_MODE && (
        <div
          className="absolute bottom-0 inset-x-0 flex flex-wrap items-center gap-2 px-4 py-2 text-xs font-mono"
          style={{ zIndex: 30, background: "rgba(5,8,22,0.9)", borderTop: "1px solid rgba(148,163,184,0.15)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <span style={{ color: "#94a3b8" }}>Click a spot on the model to pick a point, then assign it below.</span>
          <span>
            picked:{" "}
            {pickedPoint
              ? `[${pickedPoint.x.toFixed(3)}, ${pickedPoint.y.toFixed(3)}, ${pickedPoint.z.toFixed(3)}]`
              : "none yet"}
          </span>
          {CHECKPOINTS.map((cp, i) => (
            <button
              key={i}
              type="button"
              disabled={!pickedPoint}
              onClick={() => saveMarker(i)}
              className="px-2 py-1 rounded-lg font-semibold disabled:opacity-40"
              style={{ background: markerDraft[i] ? "#0d9488" : "#7c3aed", color: "#fff" }}
            >
              Set {i + 1} ({cp.label})
            </button>
          ))}
          <button
            type="button"
            onClick={copyMarkerDraft}
            className="px-3 py-1 rounded-lg"
            style={{ background: "rgba(13,148,136,0.25)", color: "#5eead4" }}
          >
            {markerCopied ? "Copied" : `Copy (${Object.keys(markerDraft).length}/${CHECKPOINTS.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroSceneExperience;
