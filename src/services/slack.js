import {WebClient} from '@slack/web-api';
import fs from 'fs';
import {IncomingWebhook} from '@slack/webhook';
import dotenv from 'dotenv';
import {buildReleaseNote} from '../utils/message-utils.js';

// Read a token from the environment variables
dotenv.config();
const {
    SLACK_TOKEN, WEBHOOK, CHANNEL, WEBHOOK_REGRESSION_CHANNEL,
} = process.env;
const token = SLACK_TOKEN;

const webhookUrl = WEBHOOK;

// Initialize
const web = new WebClient(token);
let webhook = new IncomingWebhook(webhookUrl);
const channel = CHANNEL;

export const sendMessage = async (text) => {
    try {
        const res = await web.chat.postMessage({ channel, text });
        console.log('Message sent: ', res.ts);
    } catch (e) {
        console.log(`Failed because ${e.message}`);
    }
};

export const sendWebHook = async (text, isIos) => {
    if (isIos) {
        webhook = new IncomingWebhook(WEBHOOK_REGRESSION_CHANNEL);
    }
    await webhook.send({
        text,
        link_names: true,
    });
};

export const uploadSingleFile = async (file) => {
    const response = await web.files.upload({
        channel,
        file: fs.readFileSync(file),
        filename: file,

    });
    const sharedPublicURLRes = await web.files.sharedPublicURL({
        file: response.file.id,
    });

    const parsedPermalink = sharedPublicURLRes.file.permalink_public.split('-');
    const pubSecret = parsedPermalink[parsedPermalink.length - 1];

    return `${sharedPublicURLRes.file.url_private}?pub_secret=${pubSecret}`;
};

const getArtifactMessage = (attachments, urls) => {
    const prefix = '- <';
    const separator = '|';
    const suffix = '>';
    let result = '';
    attachments.forEach((file, index) => {
        result = `${result}\n${prefix}${urls[index]}${separator}${file.split('/').pop()}${suffix}`;
    });
    return `
Download here:    
    ${result}
    `;
};

export const sendMessageAndUpload = async (attachments) => {
    try {
        const urls = [];

        for (let i = 0; i < attachments.length; i++) {
            const url = await uploadSingleFile(attachments[i]);
            urls.push(url);
        }

        const data = await buildReleaseNote();
        const linkableArtifactsMessage = getArtifactMessage(attachments, urls);
        const message = `
${data}
    
${linkableArtifactsMessage}

        `;
        await sendWebHook(message);
    } catch (e) {
        console.log(`Failed gans, because ${e.message}`);
    }
};

export const getMessageIos = async () => buildReleaseNote();
