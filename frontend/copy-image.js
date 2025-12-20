import fs from 'fs';
import path from 'path';

const source = String.raw`C:\Users\jksha\.gemini\antigravity\brain\546d1cfd-eb42-4657-a3bd-9d42513ff275\og_image_1766228638459.png`;
const dest = path.join(process.cwd(), 'public', 'og-image.png');

console.log(`Copying from ${source} to ${dest}`);

try {
    fs.copyFileSync(source, dest);
    console.log('Success!');
} catch (err) {
    console.error('Error:', err);
}
