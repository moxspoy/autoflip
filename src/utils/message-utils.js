import ReleaseNotes from '../../release-notes.js';
import * as ClickupService from '../services/clickup.js';

export async function buildReleaseNote() {
    const whatsNewMessage = await buildMessage("What's new", ReleaseNotes.whatNew);
    const changelogMessage = await buildMessage("Changelog", ReleaseNotes.changelog);
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

export async function buildMessage(title, label) {
    let message = '\n';
    if (typeof label === 'string') {
        if (label.startsWith('http')) {
            message = await buildSingleTask(label);
        }
        message = label;
    }

    for (const item of label) {
        message = message + " :white_small_square: " + await buildSingleTask(item) + '\n';
    }

    if (!message) {
        return '';
    }
    return `
*${title}*
${message}

`;
}

const buildSingleTask = async (url) => {
    const id = getTaskIdFromUrl(url);
    const taskName =  await ClickupService.getTaskName(id);
    return buildHyperlink(url, taskName);
}

const getTaskIdFromUrl = (url) => {
    const splitted = url.split("/");
    return splitted[splitted.length - 1];
}

const buildHyperlink = (url, message) => `<${url}|${message}>`;

const buildNotificationMessage = () => {
    if (!ReleaseNotes.notifyTo) {
        return '';
    }
    let message = '\n';
    for (const user of ReleaseNotes.notifyTo) {
        message = message + ' ' + user;
    }
    return message;
}
