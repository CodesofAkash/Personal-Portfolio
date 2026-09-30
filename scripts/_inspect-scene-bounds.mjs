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
  if (parent) return worldMatrix(parent).multiply(m);
  return m;
}

const worldBox = new Box3();
const el = [0, 0, 0];
const v = new Vector3();

for (const node of doc.getRoot().listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  const wm = worldMatrix(node);
  for (const prim of mesh.listPrimitives()) {
    const matName = prim.getMaterial()?.getName() ?? "(none)";
    const posAttr = prim.getAttribute("POSITION");
    const localBox = new Box3();
    for (let i = 0; i < posAttr.getCount(); i++) {
      posAttr.getElement(i, el);
      v.set(el[0], el[1], el[2]);
      localBox.expandByPoint(v);
      worldBox.expandByPoint(v.clone().applyMatrix4(wm));
    }
    const worldLocalBox = localBox.clone().applyMatrix4(wm);
    console.log(
      `node=${node.getName()} mat=${matName} worldMin=[${worldLocalBox.min.toArray().map((n) => n.toFixed(3))}] worldMax=[${worldLocalBox.max.toArray().map((n) => n.toFixed(3))}]`,
    );
  }
}

console.log("\n--- WHOLE SCENE world bounding box ---");
console.log("min:", worldBox.min.toArray());
console.log("max:", worldBox.max.toArray());
console.log("size:", worldBox.getSize(new Vector3()).toArray());
console.log("center:", worldBox.getCenter(new Vector3()).toArray());
