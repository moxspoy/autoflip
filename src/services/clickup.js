import dotenv from 'dotenv';
import ClickupSdk from 'clickup-sdk';

// Read a token from the environment variables
dotenv.config();
const { CLICKUP } = process.env;
const client = ClickupSdk(CLICKUP);

export const getTaskName = async (id) => {
    try {
        const response = await client.getTask(id);
        return response?.data?.name;
    } catch (e) {
        console.log('Failed gans, because ' + e.message);
    }
};
