import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const result = [];

export function findFileFromDirectory(startPath, filter) {
    console.log(`Trying to find ${startPath} file(s) from ${filter}...`);
    if (!fs.existsSync(startPath)) {
        throw new Error(`No directory ${startPath}`);
    }

    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        const filename = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            findFileFromDirectory(filename, filter);
        } else if (filename.indexOf(filter) >= 0) {
            result.push(filename);
        }
    }
    return result;
}

export function getAndroidArtifact() {
    const absolute = `${process.env.FLIP_MOBILE_DIR}android/app/build/outputs/`;
    const extension = '.apk';
    const apks = findFileFromDirectory(absolute, extension);
    if (!apks) {
        throw new Error('File not found, make sure that you have built the project');
    }
    console.log(`Hooray! We got ${apks.length} files`);
    return apks;
}

export function getIosArtifact() {
    const absolute = `./build/`;
    const extension = '.ipa';
    const ipa = findFileFromDirectory(absolute, extension);
    if (!ipa?.length) {
        throw new Error('File not found, make sure that you have built the project');
    }
    console.log('Hooray! We got the files');
    return ipa[0];
}

export function isWindows() {
    return process.platform === 'win32';
}
