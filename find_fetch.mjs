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
      if (content.includes('fetch=')) {
        console.log(`Found fetch= in ${filePath}`);
        // look at context 20 chars around
        const idx = content.indexOf('fetch=');
        console.log(content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 40)));
      }
      if (content.includes('fetch =')) {
        console.log(`Found fetch = in ${filePath}`);
        const idx = content.indexOf('fetch =');
        console.log(content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 40)));
      }
      if (content.includes('self.fetch=')) {
        console.log(`self.fetch= in ${filePath}`);
        const idx = content.indexOf('self.fetch=');
        console.log(content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 40)));
      }
      if (content.includes('window.fetch=')) {
        console.log(`window.fetch= in ${filePath}`);
        const idx = content.indexOf('window.fetch=');
        console.log(content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 40)));
      }
    }
  }
};

search('./dist/assets');
