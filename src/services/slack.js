import {WebClient} from "@slack/web-api";
import fs from "fs";
import {IncomingWebhook} from "@slack/webhook";
import dotenv from "dotenv";

// Read a token from the environment variables
dotenv.config();
const {SLACK_TOKEN, WEBHOOK, CHANNEL, AUTOFLIP_DIR, WEBHOOK_REGRESSION_CHANNEL} = process.env;
const token = SLACK_TOKEN;

const webhookUrl = WEBHOOK;

// Initialize
const web = new WebClient(token);
let webhook = new IncomingWebhook(webhookUrl);
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

        const releaseNotesFile = AUTOFLIP_DIR + 'release-notes.txt';
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
    const sharedPublicURLRes = await web.files.sharedPublicURL({
        file: response.file.id,
    });

    const parsedPermalink = sharedPublicURLRes.file.permalink_public.split('-');
    const pubSecret = parsedPermalink[parsedPermalink.length - 1];

    return sharedPublicURLRes.file.url_private + `?pub_secret=${pubSecret}`
}

export const sendWebHook = async (text, isIos) => {
    if (isIos) {
        const regressionWebhook = WEBHOOK_REGRESSION_CHANNEL;
        webhook = new IncomingWebhook(regressionWebhook);
    }
    await webhook.send({
        text,
        link_names: true,
    });
};
