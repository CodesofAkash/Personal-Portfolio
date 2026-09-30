import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const [inPath, outPath] = process.argv.slice(2);
const doc = await io.read(inPath);

let fixed = 0;
for (const mat of doc.getRoot().listMaterials()) {
  const base = mat.getBaseColorFactor();
  const emissiveTex = mat.getEmissiveTexture();
  const isBlack = base[0] === 0 && base[1] === 0 && base[2] === 0;
  if (isBlack && emissiveTex) {
    mat.setBaseColorTexture(emissiveTex);
    const info = mat.getBaseColorTextureInfo();
    const emissiveInfo = mat.getEmissiveTextureInfo();
    if (info && emissiveInfo) {
      info.setTexCoord(emissiveInfo.getTexCoord());
    }
    mat.setBaseColorFactor([1, 1, 1, base[3]]);
    fixed++;
  }
  // The sky material (and possibly others meant to be seen from inside,
  // e.g. a dome) is single-sided — if the camera ends up outside its
  // radius, the inward-facing geometry backface-culls to invisible rather
  // than rendering wrong-colored. Double-siding costs nothing meaningful
  // at this scene's scale and removes the failure mode entirely.
  mat.setDoubleSided(true);
}

console.log(`Fixed ${fixed} material(s): moved emissiveTexture -> baseColorTexture, baseColorFactor -> white.`);
await io.write(outPath, doc);
console.log("Wrote", outPath);
