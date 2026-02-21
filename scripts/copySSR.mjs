import { execSync } from 'child_process';
import { platform } from 'os';
import fs from 'fs';
import path from 'path';

const isWin = platform() === 'win32';

const destDir = path.resolve('functions', 'build');

try {
    fs.mkdirSync(destDir, { recursive: true });

    if (isWin) {
        console.log('Detected Windows, using `xcopy` command ...');
        execSync('xcopy /E /I /Y build\\server functions\\build\\server', { stdio: 'inherit' });
    } else {
        console.log('Detected Unix-like OS, using `cp` command ...');
        execSync('cp -r build/server functions/build/', { stdio: 'inherit' });
    }

    console.log('SSR build copied successfully');
} catch (err) {
    console.error('Error copying SSR build:', err.message);
    process.exit(1);
}
