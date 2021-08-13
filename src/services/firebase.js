import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { buildReleaseNote } from '../utils/message-utils.js';
import { getIosArtifact } from '../utils/file-utils.js';
import ReleaseNotes from '../../release-notes.js';

dotenv.config();

export const upload = async (file, isStaging) => {
    const token = process.env.FIREBASE_TOKEN;
    const appId = isStaging
        ? process.env.FIREBASE_APP_ID_IOS_STAGING_RELEASE
        : process.env.FIREBASE_APP_ID_IOS_PRODUCTION_RELEASE;
    const releaseNote = await buildReleaseNote();
    const filename = 'release-notes.txt';
    fs.writeFileSync(filename, releaseNote);
    const releaseNotesFile = path.join(process.cwd(), filename);
    const groups = ReleaseNotes.firebaseTester.join(',');
    console.log('Autoflip', `uploading ${file} into firebase...`);
    const command = `firebase --token ${token} appdistribution:distribute ${getIosArtifact()} --app ${appId}  --release-notes-file ${releaseNotesFile} --groups "${groups}"`;
    execSync(command);
    fs.unlinkSync(filename);
};
