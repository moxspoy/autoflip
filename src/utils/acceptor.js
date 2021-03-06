import minimist from 'minimist';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import * as CLIUtils from './cli-utils.js';
import { BuildUtils, SentryUtils } from './index.js';

dotenv.config();

const packages = minimist(process.argv.slice(2));
const flipMobileDirectory = process.env.FLIP_MOBILE_DIR;
const androidProjectDirectory = `${flipMobileDirectory}android`;
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
    CLIUtils.executeCommand(`cd ${androidProjectDirectory} && ENVFILE=.env.production ./gradlew clean`);
    break;
case 'android_regression':
    BuildUtils.buildAndroidStagingDebugReleaseAndNotifySlack();
    break;
case 'staging_debug_slack':
    BuildUtils.buildAndroidStagingDebugSlack();
    break;
case 'android_staging_release_slack':
    BuildUtils.buildAndroidStagingReleaseSlack();
    break;
case 'android_sanity':
    BuildUtils.buildAndroidProductionReleaseDebugSlack();
    break;
case 'ios_regression':
    BuildUtils.buildIosStagingReleaseFirebase();
    break;
case 'ios_sanity':
    BuildUtils.buildIosProductionReleaseFirebase();
    break;
case 'ios_clean':
    BuildUtils.cleanIos();
    break;
case 'sentry_android':
    SentryUtils.uploadSourceMapsAndroidToSentry();
    break;
case 'sentry_ios':
    SentryUtils.uploadSourceMapsIosToSentry();
    break;
case 'android_oppo':
    BuildUtils.buildAndroidProductionReleaseOppoSlack();
    break;
default:
    console.error('Please specify action');
}
