import ReleaseNotes from '../../release-notes.js';
import * as ClickupService from '../services/clickup.js';

// const CLICKUP_ID_REGEX = /[\[](?:[0-9]+[A-Z]|[A-Z]+[0-9])[A-Z0-9]*[\]]/;

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

export async function buildReleaseNote() {
    if (!ReleaseNotes.whatNew && !ReleaseNotes.changelog && !ReleaseNotes.additionalNotes) {
        throw Error('You must add what\'s new, changelog, or additional note');
    }
    const whatsNewMessage = await buildMessage('What\'s new', ReleaseNotes.whatNew);
    const changelogMessage = await buildMessage('Changelog', ReleaseNotes.changelog);
    const notifyMessage = buildNotificationMessage();
    return `
${ReleaseNotes.defaultProjectName}    
\`${ReleaseNotes.productType}\`  
${ReleaseNotes.environment}    
${ReleaseNotes.version}
${whatsNewMessage}
${changelogMessage}  
${notifyMessage}
`;
}
