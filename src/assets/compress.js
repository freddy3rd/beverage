import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// In ES modules, __dirname is not defined, so we recreate it:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = "./images/";
const outputDir = "./images/compressed";

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

const files = fs.readdirSync(directory);

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    sharp(path.join(directory, file))
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${path.parse(file).name}.webp`))
      .then(() => console.log(`✅ Compressed: ${file}`))
      .catch((err) => console.error(`❌ Error processing ${file}:`, err));
  }
}
