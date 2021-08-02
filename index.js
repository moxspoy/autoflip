/*
* GOALS: one click, auto build and delivery
* WORKFLOW
* build according to variant
* deliver into slack/firebase
*/
import {getAndroidArtifact} from "./src/utils/file-utils.js";
import * as SlackService from "./src/services/slack.js";
import * as CLIUtils from "./src/utils/cli-utils.js";
import * as ClickupService from "./src/services/clickup.js";

(async() => {
    CLIUtils.openingMessage();
    const files = getAndroidArtifact();
    if (files && files.length) {
        await SlackService.sendMessageAndUpload(files);
        await ClickupService.updateTaskStatus();
        CLIUtils.showSuccessMessage();
    }
})()
