import sharp from 'sharp';
import path from 'path';

async function makeTransparentLogo(inputPath, outputPath) {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  
  const width = info.width;
  const height = info.height;
  const channels = info.channels;
  
  const rgbaBuffer = Buffer.alloc(width * height * 4);
  
  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    
    let alpha = 255;
    
    // Smooth threshold for pure white background
    if (r > 235 && g > 235 && b > 235) {
      const whiteness = (r + g + b) / 3;
      if (whiteness >= 248) {
        alpha = 0;
      } else {
        alpha = Math.round((248 - whiteness) / 13 * 255);
      }
    }
    
    rgbaBuffer[i * 4] = r;
    rgbaBuffer[i * 4 + 1] = g;
    rgbaBuffer[i * 4 + 2] = b;
    rgbaBuffer[i * 4 + 3] = alpha;
  }
  
  await sharp(rgbaBuffer, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .trim()
  .png({ quality: 100, compressionLevel: 9 })
  .toFile(outputPath);

  console.log(`Saved transparent logo to ${outputPath}`);
}

const opt1 = "C:/Users/hp/.gemini/antigravity-ide/brain/e2b7c332-cce8-4373-88e9-36f5b691d988/codeorbit_logo_redesign_1_1789918931025.jpg";
const opt2 = "C:/Users/hp/.gemini/antigravity-ide/brain/e2b7c332-cce8-4373-88e9-36f5b691d988/codeorbit_logo_redesign_2_1789918951210.jpg";
const opt3 = "C:/Users/hp/.gemini/antigravity-ide/brain/e2b7c332-cce8-4373-88e9-36f5b691d988/codeorbit_logo_redesign_3_1789918971237.jpg";

await makeTransparentLogo(opt2, path.resolve('public/logo.png'));
await makeTransparentLogo(opt2, path.resolve('public/codeorbit-logo.png'));
await makeTransparentLogo(opt2, path.resolve('src/assets/logo.png'));
await makeTransparentLogo(opt1, path.resolve('public/logo-opt1.png'));
await makeTransparentLogo(opt2, path.resolve('public/logo-opt2.png'));
await makeTransparentLogo(opt3, path.resolve('public/logo-opt3.png'));

console.log('All transparent variants processed!');
