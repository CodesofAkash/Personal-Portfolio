import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { MeshoptDecoder } from "meshoptimizer";

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "meshopt.decoder": MeshoptDecoder,
});
const path = process.argv[2];
const doc = await io.read(path);

for (const mat of doc.getRoot().listMaterials()) {
  console.log(JSON.stringify({
    name: mat.getName(),
    baseColorFactor: mat.getBaseColorFactor(),
    emissiveFactor: mat.getEmissiveFactor(),
    metallic: mat.getMetallicFactor(),
    roughness: mat.getRoughnessFactor(),
    alphaMode: mat.getAlphaMode(),
    unlit: !!mat.getExtension("KHR_materials_unlit"),
  }));
}

console.log("---MESHES + MATERIAL NAMES---");
for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    console.log(mesh.getName(), "->", prim.getMaterial()?.getName());
  }
}

console.log("---MESH VERTEX COLORS---");
for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const colorAttr = prim.getAttribute("COLOR_0");
    if (colorAttr) {
      const arr = colorAttr.getArray();
      console.log(mesh.getName(), "COLOR_0 sample:", Array.from(arr.slice(0, 8)));
    }
  }
}
