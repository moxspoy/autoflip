import fs from 'fs';
import ReleaseNotes from '../../release-notes.js';
import * as ClickupService from '../services/clickup.js';
import { DEFAULT_PROJECT_NAME, PRODUCT_TYPE } from '../constants/index.js';

// const CLICKUP_ID_REGEX = /[\[](?:[0-9]+[A-Z]|[A-Z]+[0-9])[A-Z0-9]*[\]]/;
const {
    FLIP_MOBILE_DIR,
} = process.env;
export const buildHyperlink = (url, message) => `<${url}|${message}>`;

export const buildSingleTask = async (url) => {
    const id = ClickupService.getTaskIdFromUrl(url);
    const taskName = await ClickupService.getTaskName(id);
    return buildHyperlink(url, taskName);
};

export async function buildMessage(title, label) {
    if (!label) {
        return '';
    }

    let message = '';
    if (typeof label === 'string') {
        if (label.startsWith('http')) {
            message = await buildSingleTask(label);
        }
        message = label;
    }

    const listSymbol = label.length > 1 ? ':white_small_square:' : '';

    for (const item of label) {
        if (item.startsWith('http')) {
            message = `${message} ${listSymbol} ${await buildSingleTask(item)}\n`;
        } else {
            message = `${message} ${listSymbol} ${item}\n`;
        }
    }

    if (!message) {
        return '';
    }
    return `
*${title}*
${message}`;
}

export const buildNotificationMessage = () => {
    if (!ReleaseNotes?.notifyTo) {
        return '';
    }
    let message = 'cc ';
    for (const user of ReleaseNotes.notifyTo) {
        message = `${message} ${user}`;
    }
    return message;
};

const findValueFromFlipMobileEnvironmentVariable = (keyword, isStaging) => {
    const envFile = isStaging ? 'staging' : 'production';
    const path = `${FLIP_MOBILE_DIR}.env.${envFile}`;
    const data = fs.readFileSync(path);
    const strData = data.toString();
    const lines = strData.split('\n');
    let result = '';
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.indexOf(keyword) !== -1) {
            result = line.split(keyword)[1].replace('=', '');
        }
    }
    return result;
};

export const getDefaultProjectName = () => DEFAULT_PROJECT_NAME;

export const getProductType = (isAndroid) => (isAndroid ? PRODUCT_TYPE.ANDROID : PRODUCT_TYPE.IOS);

export const getVersion = (isStaging) => findValueFromFlipMobileEnvironmentVariable('VERSION_NAME', isStaging);

export const getEnvironment = (isStaging) => findValueFromFlipMobileEnvironmentVariable('BASE_URL', isStaging);

export async function buildReleaseNote(isStaging, isAndroid) {
    if (!ReleaseNotes.whatNew && !ReleaseNotes.changelog && !ReleaseNotes.additionalNotes) {
        throw Error('You must add what\'s new, changelog, or additional note');
    }
    const whatsNewMessage = await buildMessage('What\'s new', ReleaseNotes.whatNew);
    const changelogMessage = await buildMessage('Changelog', ReleaseNotes.changelog);
    const additionalNoteMessage = await buildMessage('Additional Note', ReleaseNotes.additionalNotes);
    const notifyMessage = buildNotificationMessage();
    return `
${getDefaultProjectName()}    
\`${getProductType(isAndroid)}\`  
Environment: ${getEnvironment(isStaging)}    
Version: ${getVersion(isStaging)}
${whatsNewMessage}
${changelogMessage}  
${additionalNoteMessage}  
${notifyMessage}
`;
}
