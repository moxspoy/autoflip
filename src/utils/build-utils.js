import {executeCommand} from "./cli-utils.js";
import dotenv from "dotenv";

dotenv.config();

const flipMobileDirectory = process.env.FLIP_MOBILE_DIR;
const androidProjectDirectory = flipMobileDirectory + 'android';
const autoFlipDirectory = process.cwd();

export const buildAndroidStagingRelease = () => {
    const command =
        `cd ${androidProjectDirectory} && ENVFILE=.env.staging ./gradlew assembleStagingRelease && node ${autoFlipDirectory}/index.js`;
    executeCommand(command);
}

export const buildAndroidStagingDebug = () => {
    const command =
        `cd ${androidProjectDirectory} && ENVFILE=.env.staging ./gradlew assembleStagingDebug`;
    executeCommand(command);
}

export const buildAndroidStagingDebugAndNotifySlack = () => {
    const command =
        `cd ${androidProjectDirectory} && ENVFILE=.env.staging ./gradlew assembleStagingDebug && node ${autoFlipDirectory}/index.js`;
    executeCommand(command);
}

export const buildAndroidStagingDebugReleaseAndNotifySlack = () => {
    const command =
        `cd ${androidProjectDirectory} && ENVFILE=.env.staging ./gradlew assembleStagingDebug && ENVFILE=.env.staging ./gradlew assembleStagingRelease && node ${autoFlipDirectory}/index.js`;
    executeCommand(command);
}

export const buildAndroidStagingDebugSlack = () => {
    const command =
        `cd ${androidProjectDirectory} && ENVFILE=.env.staging ./gradlew assembleStagingDebug && node ${autoFlipDirectory}/index.js`;
    executeCommand(command);
}

export const buildAndroidProductionReleaseDebugSlack = () => {
    const command =
        `cd ${androidProjectDirectory} && ENVFILE=.env.production ./gradlew assembleProductionDebug && ENVFILE=.env.production ./gradlew assembleProductionRelease && node ${autoFlipDirectory}/index.js`;
    executeCommand(command);
}
