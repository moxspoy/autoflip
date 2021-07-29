import {execSync} from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import {buildReleaseNote} from '../utils/message-utils.js';
import {getIosArtifact} from '../utils/file-utils.js';

dotenv.config();

export const upload = async (file, isStaging) => {
    const token = process.env.FIREBASE_TOKEN;
    const appId = isStaging
        ? process.env.FIREBASE_APP_ID_IOS_STAGING_RELEASE
        : process.env.FIREBASE_APP_ID_IOS_PRODUCTION_RELEASE;
    const releaseNote = await buildReleaseNote();
    const filename = 'release-notes.txt';
    fs.writeFileSync(filename, releaseNote);
    const releaseNotesFile = path.join(process.cwd(), releaseNote);
    const groups = 'B2B QA, Flip QA';
    console.log('Autoflip', `uplading ${file} into firebase`);
    execSync(`firebase --token ${token} appdistribution:distribute ${getIosArtifact()} --app ${appId}  --release-notes-file ${releaseNotesFile} --groups ${groups}`);
    fs.unlinkSync(filename);
};
