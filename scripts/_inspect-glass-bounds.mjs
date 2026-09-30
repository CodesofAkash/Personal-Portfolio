import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";
import { Box3, Matrix4, Quaternion, Vector3 } from "three";

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "meshopt.decoder": MeshoptDecoder,
});
const path = process.argv[2];
const doc = await io.read(path);

function worldMatrix(node) {
  const m = new Matrix4();
  const t = node.getTranslation();
  const r = node.getRotation();
  const s = node.getScale();
  m.compose(new Vector3(t[0], t[1], t[2]), new Quaternion(r[0], r[1], r[2], r[3]), new Vector3(s[0], s[1], s[2]));
  const parent = node.getParentNode ? node.getParentNode() : null;
  if (parent) {
    return worldMatrix(parent).multiply(m);
  }
  return m;
}

for (const node of doc.getRoot().listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  for (const prim of mesh.listPrimitives()) {
    const mat = prim.getMaterial();
    if (!mat || mat.getName() !== "sky_sketchfab") continue;

    const posAttr = prim.getAttribute("POSITION");
    const box = new Box3();
    const v = new Vector3();
    const el = [0, 0, 0];
    const verts = [];
    for (let i = 0; i < posAttr.getCount(); i++) {
      posAttr.getElement(i, el);
      v.set(el[0], el[1], el[2]);
      box.expandByPoint(v);
      verts.push(v.clone());
    }
    const localCenter = box.getCenter(new Vector3());
    // True radius (max distance from centroid to any vertex) — the actual
    // sphere geometry's vertices lie ON a sphere, so this is exact, unlike
    // Box3.getBoundingSphere() which uses the box's half-diagonal and
    // overestimates by up to sqrt(3)x for anything that isn't a cube of points.
    let localRadius = 0;
    for (const p of verts) localRadius = Math.max(localRadius, p.distanceTo(localCenter));

    const wm = worldMatrix(node);
    const worldCenter = localCenter.clone().applyMatrix4(wm);
    const scale = new Vector3();
    wm.decompose(new Vector3(), new Quaternion(), scale);
    const worldRadius = localRadius * Math.max(scale.x, scale.y, scale.z);

    console.log("node:", node.getName(), "mesh:", mesh.getName());
    console.log("local box min/max:", box.min.toArray(), box.max.toArray());
    console.log("world center:", worldCenter.toArray());
    console.log("world radius (exact, from vertices):", worldRadius);

    console.log("\n--- distance from each CHECKPOINT markerPos to glass center ---");
    const checkpoints = [
      ["Sanctuary", [-0.1502853483778331, 1.6693932859557161, 4.793827839170297]],
      ["Machinery", [1.2246701793970216, -3.5779482165868344, 7.503610100989376]],
      ["Lightning protector", [-4.615326828377105, 10.750520358236725, -0.4461622929015273]],
      ["Dark side", [-5.94207881665506, 12.199037827564801, 5.398727006212699]],
      ["Dangerous climb", [4.820571304488823, -2.590434021585611, -0.5019263876768614]],
      ["Steampunk", [1.8141110150654023, -0.43081130844006593, -3.177102562402288]],
    ];
    for (const [label, pos] of checkpoints) {
      const d = worldCenter.distanceTo(new Vector3(...pos));
      console.log(`${label}: distance=${d.toFixed(3)}, radius=${worldRadius.toFixed(3)}, ${d < worldRadius ? "INSIDE the glass" : "outside"}`);
    }
  }
}
