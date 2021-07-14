/*
* GOALS: one click, auto build and delivery
* WORKFLOW
* build according to variant
* deliver into slack/firebase
*/
import {getIosArtifact} from "./src/utils/file-utils.js";
import * as SlackService from "./src/services/slack.js";
import * as FirebaseService from "./src/services/firebase.js";
import * as CLIUtils from "./src/utils/cli-utils.js";

(async() => {
    CLIUtils.openingMessage();
    const files = getIosArtifact();
    if (files && files.length) {
        try {
            await FirebaseService.upload(files, true);
            const text = `
Hallo! new iOS application (1.27.0-rc01) has been uploaded into Firebase App Distribution.
Check it out guys!        
        `
            await SlackService.sendWebHook(text, true);
            CLIUtils.showSuccessMessage();
        } catch (e) {
            console.log('huhu failed caused by ' + e.message);
        }
    }
})()
