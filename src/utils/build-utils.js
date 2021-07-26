import {executeCommand} from "./cli-utils.js";
import {isWindows} from "./file-utils.js";
import dotenv from "dotenv";

dotenv.config();

const flipMobileDirectory = process.env.FLIP_MOBILE_DIR;
const androidProjectDirectory = flipMobileDirectory + 'android';
const iosProjectDirectory = flipMobileDirectory + 'ios';
const autoFlipDirectory = process.cwd();
const isWindowsOS = isWindows();
const stagingEnv = ` ENVFILE=.env.staging `;
const productionEnv = ` ENVFILE=.env.production `;
const getEnvironmentStaging = () => isWindowsOS ? ` SET ${stagingEnv} && ` : stagingEnv;
const getEnvironmentProduction = () => isWindowsOS ? ` SET ${productionEnv} && ` : productionEnv;

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
        `cd ${androidProjectDirectory} && ${getEnvironmentStaging()} ./gradlew assembleStagingDebug && node ${autoFlipDirectory}/index.js`;
    executeCommand(command);
}

export const buildAndroidStagingDebugReleaseAndNotifySlack = () => {
    const command =
        `cd ${androidProjectDirectory} && ${getEnvironmentStaging()} ./gradlew assembleStagingDebug && ${getEnvironmentStaging()} ./gradlew assembleStagingRelease && node ${autoFlipDirectory}/index.js`;
    executeCommand(command);
}

export const buildAndroidStagingDebugSlack = () => {
    const command =
        `cd ${androidProjectDirectory} && ${getEnvironmentStaging()} ./gradlew assembleStagingDebug && node ${autoFlipDirectory}/index.js`;
    executeCommand(command);
}

export const buildAndroidProductionReleaseDebugSlack = () => {
    const command =
        `cd ${androidProjectDirectory} && ${getEnvironmentProduction()} ./gradlew assembleProductionDebug && ${getEnvironmentProduction()} ./gradlew assembleProductionRelease && node ${autoFlipDirectory}/index.js`;
    executeCommand(command);
}

export const buildAndroidProductionReleaseOppoSlack = () => {
    const copyManifestCommand = `cp ./patch/AndroidManifest.xml ${androidProjectDirectory}/app/src/main/AndroidManifest.xml`;
    const copyCrashLoggingCommand = `cp ./patch/CrashLoggingUtils.js ${flipMobileDirectory}src/utils/CrashLoggingUtils.js`;
    executeCommand(copyManifestCommand);
    executeCommand(copyCrashLoggingCommand);
    const buildCommand =
        `cd ${flipMobileDirectory} && yarn && yarn clean_android_production && cd ${androidProjectDirectory} && ${getEnvironmentProduction()} ./gradlew assembleProductionRelease && node ${autoFlipDirectory}/index.js`;
    executeCommand(buildCommand);
}

export const buildIosProductionStagingFirebase = () => {
    const archiveCommand = `xcodebuild -workspace FlipApp.xcworkspace -scheme "FlipApp - Staging" -sdk iphoneos -configuration Release archive -archivePath flip.xcarchive`
    const exportIPACommand = `xcodebuild -exportArchive -archivePath ./flip.xcarchive -exportOptionsPlist ./exportOptions.plist -exportPath $PWD/build`
    const command =
        `cd ${iosProjectDirectory} && ${archiveCommand} && ${exportIPACommand} && node ${autoFlipDirectory}/index-ios.js`;
    executeCommand(command);
}

