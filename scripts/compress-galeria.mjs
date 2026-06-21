// Comprime todas as fotos em public/fotos-do-casal/galeria/.
// Mira ~1 MB por foto, max 2400px no maior lado, JPEG progressive q85.
// PNGs são convertidos pra JPEG (extensão atualizada). Roda 1x e pode
// ser apagado; não faz parte do app.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const dir = "public/fotos-do-casal/galeria";
const files = fs.readdirSync(dir).filter((f) =>
  /\.(jpe?g|png)$/i.test(f),
);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const fp = path.join(dir, file);
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const outPath = path.join(dir, base + ".jpg");
  const originalSize = fs.statSync(fp).size;
  totalBefore += originalSize;

  const buffer = await sharp(fp)
    .rotate() // respeita EXIF orientation
    .resize(2400, 2400, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true, mozjpeg: true })
    .toBuffer();

  // Escreve em .tmp e renomeia — evita conflito com OneDrive sync
  // segurando o file handle do original.
  const tmpPath = outPath + ".tmp";
  fs.writeFileSync(tmpPath, buffer);
  if (ext === ".png") {
    fs.unlinkSync(fp);
    fs.renameSync(tmpPath, outPath);
  } else {
    fs.unlinkSync(fp);
    fs.renameSync(tmpPath, outPath);
  }

  const newSize = fs.statSync(outPath).size;
  totalAfter += newSize;
  const delta = (((newSize - originalSize) / originalSize) * 100).toFixed(0);
  console.log(
    `${file.padEnd(60)} ${(originalSize / 1024).toFixed(0).padStart(5)} KB -> ${(newSize / 1024).toFixed(0).padStart(5)} KB  (${delta}%)`,
  );
}

console.log("---");
console.log(
  `TOTAL: ${(totalBefore / 1024 / 1024).toFixed(1)} MB -> ${(totalAfter / 1024 / 1024).toFixed(1)} MB`,
);
