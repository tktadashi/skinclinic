import fs from 'fs';
import path from 'path';

const search = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      search(filePath);
    } else if (filePath.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.matchAll(/.{0,20}fetch[^a-zA-Z0-9].{0,10}=/g);
      for (const match of matches) {
          console.log(`Found complex fetch assignment in ${filePath}:`, content.substring(Math.max(0, match.index - 20), Math.min(content.length, match.index + 20)));
      }
    }
  }
};

search('./dist/assets');
