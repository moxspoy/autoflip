import {execSync} from 'child_process'
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const upload = (file, isStaging) => {
    const token = process.env.FIREBASE_TOKEN;
    const appId = isStaging
        ? process.env.FIREBASE_APP_ID_IOS_STAGING_RELEASE
        : process.env.FIREBASE_APP_ID_IOS_PRODUCTION_RELEASE;
    const releaseNotesFile = path.join(process.cwd(), 'release-notes.txt');
    const groups = "B2B QA, Flip QA";
    console.log("Autoflip", `uplading ${file} into firebase`);
    execSync(`firebase --token ${token} appdistribution:distribute --app ${appId}  --release-notes-file ${releaseNotesFile} --groups ${groups}`)
}
