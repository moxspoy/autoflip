import dotenv from 'dotenv';
import ClickupSdk from 'clickup-sdk';
import ReleaseNotes from '../../release-notes.js';

// Read a token from the environment variables
dotenv.config();
const { CLICKUP } = process.env;
const client = ClickupSdk(CLICKUP);

export const getTaskIdFromUrl = (url) => {
    const splitted = url.split('/');
    return splitted[splitted.length - 1];
};

export const getTaskId = (url) => {
    if (!url || typeof url !== 'string') {
        return '';
    }
    if (url.startsWith('http')) {
        return getTaskIdFromUrl(url);
    }
    return '';
};

export const getTaskName = async (id) => {
    try {
        const response = await client.getTask(id);
        return response?.data?.name;
    } catch (e) {
        console.log(`Failed gans, because ${e.message}`);
    }
};

export const updateTaskToReadyToTest = async (id) => {
    const status = 'READY TO TEST';
    try {
        console.log('Autoflip', `update task id ${id} to ${status}`);
        const response = await client.updateTaskStatus(id, status);
        if (response?.status === 200) {
            console.log('Autoflip', `Task id ${id} has updated`);
        }
    } catch (e) {
        console.log(`Failed gans, because ${e.message}`);
    }
};

export const updateTaskListToReadyToTest = async (tasks) => {
    if (tasks?.length) {
        for (const task of tasks) {
            const id = getTaskId(task);
            if (id) {
                await updateTaskToReadyToTest(id);
            }
        }
    }
};

export const updateTaskStatus = async () => {
    await updateTaskListToReadyToTest(ReleaseNotes?.whatNew);
    await updateTaskListToReadyToTest(ReleaseNotes?.changelog);
};
