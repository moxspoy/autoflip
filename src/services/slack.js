import {WebClient} from "@slack/web-api";
import fs from "fs";
import {IncomingWebhook} from "@slack/webhook";
import dotenv from "dotenv";

// Read a token from the environment variables
dotenv.config();
const {SLACK_TOKEN, WEBHOOK, CHANNEL, AUTOFLIP_DIR} = process.env;
const token = SLACK_TOKEN;

const webhookUrl = WEBHOOK;

// Initialize
const web = new WebClient(token);
const webhook = new IncomingWebhook(webhookUrl);
const channel = CHANNEL;
export const sendMessage = async (text) => {
    try {
        const res = await web.chat.postMessage({ channel, text});
        console.log('Message sent: ', res.ts);
    } catch (e) {
        console.log("Failed because " + e.message);
    }
}

export const sendMessageAndUpload = async (attachments) => {
    try {
        const urls = [];
        const releaseNotesFile = 'release-notes.txt';
        for (let i = 0; i < attachments.length; i++) {
            const url = await uploadSingleFile(attachments[i]);
            urls.push(url);
        }

        const data = fs.readFileSync(releaseNotesFile, 'utf8').toString();
        const linkableArtifactsMessage = getArtifactMessage(attachments, urls);
        const message = `
${data}
    
${linkableArtifactsMessage}

        `;
        await sendMessage(message);
        await sendWebHook(message);
    } catch (e) {
        console.log("Failed gans, because " + e.message);
    }
}

const getArtifactMessage = (attachments, urls) => {
    let prefix = '- <';
    const separator = '|';
    let suffix = '>';
    let result = '';
    attachments.forEach((file, index) => {
        result =  result + "\n" + prefix + urls[index] + separator + file.split('/').pop() + suffix;
    })
    return `
Download here:    
    ${result}
    `;
}

export const uploadSingleFile = async (file) => {
    const response = await web.files.upload({
        channel,
        file: fs.readFileSync(file),
        filename: file,
    });
    return response.file.permalink;
}

export const sendWebHook = async (text) => {
    await webhook.send({
        text,
        link_names: true,
    });
};
