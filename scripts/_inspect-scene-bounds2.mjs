import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";
import { Box3, Matrix4, Quaternion, Vector3 } from "three";

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "meshopt.decoder": MeshoptDecoder,
});
const path = process.argv[2];
const doc = await io.read(path);

const worldBox = new Box3();
const el = [0, 0, 0];
const v = new Vector3();
const results = [];

function localMatrix(node) {
  const t = node.getTranslation();
  const r = node.getRotation();
  const s = node.getScale();
  return new Matrix4().compose(new Vector3(t[0], t[1], t[2]), new Quaternion(r[0], r[1], r[2], r[3]), new Vector3(s[0], s[1], s[2]));
}

function visit(node, parentMatrix, depth) {
  const wm = parentMatrix.clone().multiply(localMatrix(node));
  console.log("  ".repeat(depth) + `node=${node.getName()} T=${node.getTranslation().map((n) => n.toFixed(2))} S=${node.getScale().map((n) => n.toFixed(3))}`);

  const mesh = node.getMesh();
  if (mesh) {
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
      const wb = localBox.clone().applyMatrix4(wm);
      results.push({ node: node.getName(), mat: matName, min: wb.min.toArray(), max: wb.max.toArray() });
    }
  }

  for (const child of node.listChildren()) {
    visit(child, wm, depth + 1);
  }
}

for (const scene of doc.getRoot().listScenes()) {
  console.log("SCENE:", scene.getName());
  for (const node of scene.listChildren()) {
    visit(node, new Matrix4(), 1);
  }
}

console.log("\n--- per-mesh world bounding boxes ---");
for (const r of results) {
  console.log(`node=${r.node} mat=${r.mat} worldMin=[${r.min.map((n) => n.toFixed(3))}] worldMax=[${r.max.map((n) => n.toFixed(3))}]`);
}

console.log("\n--- WHOLE SCENE world bounding box ---");
console.log("min:", worldBox.min.toArray());
console.log("max:", worldBox.max.toArray());
console.log("size:", worldBox.getSize(new Vector3()).toArray());
console.log("center:", worldBox.getCenter(new Vector3()).toArray());
