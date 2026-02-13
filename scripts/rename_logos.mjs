import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(process.cwd(), 'public', 'partners');

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    let count = 1;

    files.forEach((file) => {
        // Skip files that are already renamed to prevent double renaming if run multiple times
        if (file.startsWith('partner-') && !file.includes('original')) {
            // actually, we might want to rename them if we are re-running. 
            // unique renaming is safer.
        }

        const ext = path.extname(file);
        const newName = `partner-${count}${ext}`;
        const oldPath = path.join(directoryPath, file);
        const newPath = path.join(directoryPath, newName);

        // Rename logic
        if (oldPath !== newPath) {
            fs.renameSync(oldPath, newPath);
        }
        count++;
    });

    console.log('Renaming complete.');
});
