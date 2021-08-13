import dotenv from 'dotenv';
import { executeCommand, executeSpawnCommand } from './cli-utils.js';
import { isWindows } from './file-utils.js';

dotenv.config();

const flipMobileDirectory = process.env.FLIP_MOBILE_DIR;
const androidProjectDirectory = `${flipMobileDirectory}android`;
const iosProjectDirectory = `${flipMobileDirectory}ios`;
const autoFlipDirectory = process.cwd();
const isWindowsOS = isWindows();
const stagingEnv = ' ENVFILE=.env.staging ';
const productionEnv = ' ENVFILE=.env.production ';
const getEnvironmentStaging = () => (isWindowsOS ? ` SET ${stagingEnv} && ` : stagingEnv);
const getEnvironmentProduction = () => (isWindowsOS ? ` SET ${productionEnv} && ` : productionEnv);

export const buildAndroidStagingReleaseSlack = () => {
    const command = `cd ${flipMobileDirectory} && yarn && yarn clean_android_production && cd ${androidProjectDirectory} && ENVFILE=.env.staging ./gradlew assembleStagingRelease && node ${autoFlipDirectory}/index.js --staging true`;
    executeCommand(command);
};

export const buildAndroidStagingDebugReleaseAndNotifySlack = () => {
    const command = `cd ${flipMobileDirectory} && yarn && yarn clean_android_production && cd ${androidProjectDirectory} && ${getEnvironmentStaging()} ./gradlew assembleStagingDebug && ${getEnvironmentStaging()} ./gradlew assembleStagingRelease && node ${autoFlipDirectory}/index.js --staging true`;
    executeCommand(command);
};

export const buildAndroidStagingDebugSlack = () => {
    const command = `cd ${flipMobileDirectory} && yarn && yarn clean_android_production && cd ${androidProjectDirectory} && ${getEnvironmentStaging()} ./gradlew assembleStagingDebug && node ${autoFlipDirectory}/index.js --staging true`;
    executeCommand(command);
};

export const buildAndroidProductionReleaseDebugSlack = () => {
    const command = `cd ${flipMobileDirectory} && yarn && yarn clean_android_production && cd ${androidProjectDirectory} && ${getEnvironmentProduction()} ./gradlew assembleProductionDebug && ${getEnvironmentProduction()} ./gradlew assembleProductionRelease && node ${autoFlipDirectory}/index.js`;
    executeCommand(command);
};

export const buildAndroidProductionReleaseOppoSlack = () => {
    const copyManifestCommand = `cp ./patch/AndroidManifest.xml ${androidProjectDirectory}/app/src/main/AndroidManifest.xml`;
    const copyCrashLoggingCommand = `cp ./patch/CrashLoggingUtils.js ${flipMobileDirectory}src/utils/CrashLoggingUtils.js`;
    executeCommand(copyManifestCommand);
    executeCommand(copyCrashLoggingCommand);
    const buildCommand = `cd ${flipMobileDirectory} && yarn && yarn clean_android_production && cd ${androidProjectDirectory} && ${getEnvironmentProduction()} ./gradlew assembleProductionRelease && node ${autoFlipDirectory}/index.js`;
    executeCommand(buildCommand);
};

export const cleanIos = () => {
    const command = 'xcodebuild -workspace FlipApp.xcworkspace -scheme FlipApp -sdk iphoneos -configuration Release clean';
    executeSpawnCommand(command);
};

export const buildIosRelease = (archiveCommand, isStaging) => {
    const yarnCommand = `cd ${flipMobileDirectory} && yarn install && cd ${autoFlipDirectory}`;
    const patchCommand = `cp ./patch/RCTUIImageViewAnimated.m ${flipMobileDirectory}node_modules/react-native/Libraries/Image/RCTUIImageViewAnimated.m`;
    const exportIPACommand = `xcodebuild -exportArchive -archivePath ./flip.xcarchive -exportOptionsPlist ${autoFlipDirectory}/patch/ExportOptions.plist -exportPath $PWD/build`;
    let command = `${yarnCommand} && ${patchCommand} && cd ${iosProjectDirectory} && pod install && ${archiveCommand} && ${exportIPACommand} && node ${autoFlipDirectory}/index-ios.js`;
    if (isStaging) {
        command += ' --staging true';
    }
    console.log(command);
    executeSpawnCommand(command);
};

export const buildIosProductionReleaseFirebase = () => {
    const archiveCommand = 'xcodebuild -workspace FlipApp.xcworkspace -scheme FlipApp -sdk iphoneos -configuration Release archive -archivePath flip.xcarchive';
    buildIosRelease(archiveCommand);
};

export const buildIosStagingReleaseFirebase = () => {
    const archiveCommand = 'xcodebuild -workspace FlipApp.xcworkspace -scheme "FlipApp - Staging" -sdk iphoneos -configuration Release archive -archivePath flip.xcarchive';
    buildIosRelease(archiveCommand, true);
};
