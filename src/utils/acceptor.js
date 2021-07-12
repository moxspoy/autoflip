import minimist from 'minimist';
import {execSync} from "child_process";
import * as CLIUtils from "./cli-utils.js";
import dotenv from "dotenv";
import {BuildUtils} from "./index.js";

dotenv.config();

const packages = minimist(process.argv.slice(2));
const flipMobileDirectory = process.env.FLIP_MOBILE_DIR;
const androidProjectDirectory = flipMobileDirectory + 'android';
const autoFlipDirectory = process.cwd();

switch (packages.action) {
    case 'move_to_flip_project':
        execSync(`cd ${flipMobileDirectory}`);
        break;
    case 'move_to_work_directory':
        execSync(`cd ${autoFlipDirectory}`);
        break;
    case 'move_to_android_project':
        console.log('move', `${flipMobileDirectory}android`);
        execSync(`cd ${flipMobileDirectory}android`);
        break;
    case 'clean_android_production':
        const command = `cd ${androidProjectDirectory} && ENVFILE=.env.production ./gradlew clean`;
        CLIUtils.executeCommand(command);
        break;
    case 'staging_release_and_debug_slack':
        BuildUtils.buildAndroidStagingDebugReleaseAndNotifySlack();
        break;
    case 'staging_debug_slack':
        BuildUtils.buildAndroidStagingDebugSlack();
        break;
    case 'production_release_and_debug_slack':
        BuildUtils.buildAndroidProductionReleaseDebugSlack();
        break;
    default:
        console.error("Please specify action");
}
