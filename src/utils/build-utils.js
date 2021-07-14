import {executeCommand} from "./cli-utils.js";
import dotenv from "dotenv";

dotenv.config();

const flipMobileDirectory = process.env.FLIP_MOBILE_DIR;
const androidProjectDirectory = flipMobileDirectory + 'android';
const iosProjectDirectory = flipMobileDirectory + 'ios';
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

export const buildIosProductionStagingFirebase = () => {
    const archiveCommand = `xcodebuild -workspace FlipApp.xcworkspace -scheme "FlipApp - Staging" -sdk iphoneos -configuration Release archive -archivePath flip.xcarchive`
    const exportIPACommand = `xcodebuild -exportArchive -archivePath ./flip.xcarchive -exportOptionsPlist ./exportOptions.plist -exportPath $PWD/build`
    const command =
        `cd ${iosProjectDirectory} && ${archiveCommand} && ${exportIPACommand} && node ${autoFlipDirectory}/index-ios.js`;
    executeCommand(command);
}

