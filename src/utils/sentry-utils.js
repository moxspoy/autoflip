import dotenv from 'dotenv';
import { executeCommand } from './cli-utils.js';

dotenv.config();

const flipMobileDirectory = process.env.FLIP_MOBILE_DIR;
const {
    ANDROID_VERSION_CODE, ANDROID_VERSION_NAME, IOS_VERSION_NAME, IOS_VERSION_CODE,
} = process.env;

export const uploadSourceMapsAndroidToSentry = () => {
    console.log('uploading into sentry (android)...');
    const command = `cd ${flipMobileDirectory} && node_modules/@sentry/cli/bin/sentry-cli releases --org flipid --project flip-mobile files "id.flip@${ANDROID_VERSION_NAME}@${ANDROID_VERSION_CODE}+codepush:1" upload-sourcemaps --dist ${ANDROID_VERSION_CODE}.1 --strip-prefix . --bundle android/app/build/generated/assets/react/production/release/index.android.bundle --bundle-sourcemap android/app/build/generated/sourcemaps/react/production/release/index.android.bundle.map`;
    executeCommand(command);
};

export const uploadSourceMapsIosToSentry = () => {
    console.log('uploading into sentry (ios)...');
    const buildBundleCommand = `cd ${flipMobileDirectory} && react-native bundle --dev false --platform ios --entry-file index.ios.js --bundle-output main.jsbundle --sourcemap-output main.jsbundle.map`;
    const uploadCommand = `cd ${flipMobileDirectory} && node_modules/@sentry/cli/bin/sentry-cli releases --org flipid --project flip-mobile files "id.flip.release@${IOS_VERSION_NAME}@${IOS_VERSION_CODE}+codepush:1" upload-sourcemaps --dist ${IOS_VERSION_NAME}.1 --strip-prefix . --bundle main.jsbundle --bundle-sourcemap main.jsbundle.map`;
    executeCommand(buildBundleCommand && uploadCommand);
};
