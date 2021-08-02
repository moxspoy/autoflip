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
import minimist from 'minimist';
import * as ClickupService from "./src/services/clickup";

const args = minimist(process.argv.slice(2));

(async() => {
    CLIUtils.openingMessage();
    const files = getIosArtifact();
    if (files && files.length) {
        try {
            await FirebaseService.upload(files, args?.staging);
            const data = await SlackService.getMessageIos();
            const text = `
Hallo!
New iOS application has been uploaded into Firebase App Distribution.
Check it out guys!
---------------
${data}
`
            await SlackService.sendWebHook(text, true);
            await ClickupService.updateTaskStatus();
            CLIUtils.showSuccessMessage();
        } catch (e) {
            console.log('huhu failed caused by ' + e.message);
        }
    }
})()
