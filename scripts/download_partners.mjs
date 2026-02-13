import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urls = [
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28095121/GOKULAM-GRAND-1.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28095124/IHM-1.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28095125/PHA-1.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28095128/VIDHYARTHI-HUB-1.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28121838/mepsc-png-original-removebg-preview.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/22095418/a3b7f428-d737-4587-a5d8-34821de94e10.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/22095218/3f99e0b7-c9c4-4e9b-b545-03d6b4cfc7af.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/22095221/5efb1061-dfe0-45f0-8a3e-b68e722146d1.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/22095224/868d69f8-2dd3-4f24-bb62-31bea337d584.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/22095227/c6a193a6-b23d-4d0a-82a9-ebaaf4f4642a.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28060216/AMITY-UNIVERSITY.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28060223/Crisp-Logo.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28060226/DEV-BHOOMI.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28060233/Galgotias-Logo.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28060239/IHE-FB.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28060242/IHE-IIHE.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28060250/LE-MERIDIN.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28060254/LPU.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28060304/RAMAIAH.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28060308/STARTUP-INDIA.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28060311/T.JOHN_.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28095116/AIHHM-1.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28095117/B.C-1.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28095119/EXPROINN-1.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28122020/startup-india-hub-logo-vector-removebg-preview.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28121659/gem_logo-removebg-preview.png",
    "https://d3sr5eljrwa1wo.cloudfront.net/wp-content/uploads/2026/01/28121745/iso_logo-removebg-preview.png"
];

const downloadDir = path.join(process.cwd(), 'public', 'partners');

if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
};

let completed = 0;
const total = urls.length;

urls.forEach((url, index) => {
    // Use sequential naming immediately to match the component code
    // The order of URLs in this array matches the original script, BUT
    // the renaming script assigned names alphabetically based on filename.
    // Wait, the renaming script sorted by `fs.readdir` order which is usually alphabetical (but not guaranteed on all OSes).
    // To match `tech-partners.tsx`, I should re-download them with their original names effectively,
    // then rename them AGAIN to match the `partner-N` convention, OR
    // just download them DIRECTLY as `partner-N.png`.

    // The safest bet is:
    // 1. Download original filenames.
    // 2. Run a deterministic rename.

    const filename = path.basename(url.split('?')[0]);
    const filepath = path.join(downloadDir, filename);

    const file = fs.createWriteStream(filepath);

    https.get(url, options, (response) => {
        if (response.statusCode !== 200) {
            console.error(`FAILED: ${url} returned status ${response.statusCode}`);
            file.close();
            fs.unlink(filepath, () => { });
            return;
        }

        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${filename}`);
            completed++;
            if (completed === total) {
                console.log('All downloads completed.');
            }
        });
    }).on('error', (err) => {
        fs.unlink(filepath, () => { });
        console.error(`Error downloading ${url}: ${err.message}`);
    });
});
