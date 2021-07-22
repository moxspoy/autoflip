import {Platform} from 'react-native';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import {AppUtils} from '@utils';

const codepushDist = 1;
const versionName = AppUtils.isAndroid() ? Config.ANDROID_VERSION_NAME : Config.IOS_VERSION_NAME;
const versionCode = AppUtils.isAndroid() ? Config.ANDROID_VERSION_CODE : Config.IOS_VERSION_CODE;
const isProductionEnv = !DeviceInfo.getBundleId().includes('staging');

const dsn = Config.SENTRY_DSN;
const debug = false; //only turn it to true if you need debugging sentry
const release = `${DeviceInfo.getBundleId()}@${versionName}@${versionCode}+codepush:${codepushDist}`;
const dist = `${versionCode}.${codepushDist}`;
const environment = `${Platform.OS}-Oppo-${isProductionEnv ? 'production' : 'staging'}`;
const debugSampleRate = 0;
const releaseSampleRate = 0.4;
const sampleRate = __DEV__ ? debugSampleRate : releaseSampleRate;
const tracesSampleRate = 0.2;
const maxBreadcrumbs = 150; // Extend from the default 100 breadcrumbs.

export function init() {
    Sentry.init({
        dsn,
        debug,
        release,
        dist,
        environment,
        sampleRate,
        tracesSampleRate,
        maxBreadcrumbs,
    });
}

export function setUserIdentity(user) {
    Sentry.setUser(user);
}

export function clearUserIdentity() {
    Sentry.setUser(null);
}

export function recordBreadcrumb(key, message, level = Sentry.Severity.Info) {
    Sentry.addBreadcrumb({
        category: key,
        message,
        level,
    });
}

export function recordError(key, error, tag = 'error-key', level = Sentry.Severity.Error) {
    Sentry.captureException(error, scope => {
        scope.setTag(tag, key);
        scope.setLevel(level);
        return scope;
    });
}

export function recordThirdPartyError(featureName, error) {
    recordError(featureName, parseToErrorObject(error), 'third-party', Sentry.Severity.Warning);
}

export function recordErrorFetchAPI(url, error) {
    recordError(url, parseToErrorObject(error), 'fetch-api');
}

function parseToErrorObject(error) {
    if (error instanceof Error) {
        return error;
    }

    return new Error(JSON.stringify(error));
}
