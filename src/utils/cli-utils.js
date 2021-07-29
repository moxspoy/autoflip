import {exec, execSync, spawn} from "child_process";
import minimist from 'minimist';
import dotenv from "dotenv";

dotenv.config();

const packages = minimist(process.argv.slice(2));
const flipMobileDirectory = process.env.FLIP_MOBILE_DIR;
const androidProjectDirectory = flipMobileDirectory + 'android';
const autoFlipDirectory = process.cwd();

export const showSuccessMessage = () => {
    console.log(`
Alhamdulillah gans, prosesnya selesai dari mulai build sampai upload :))
    `);
}

export const openingMessage = () => {
    console.log(`
    
     ___      __    __  .___________.  ______    _______  __       __  .______   
    /   \\    |  |  |  | |           | /  __  \\  |   ____||  |     |  | |   _  \\  
   /  ^  \\   |  |  |  | \`---|  |----\`|  |  |  | |  |__   |  |     |  | |  |_)  | 
  /  /_\\  \\  |  |  |  |     |  |     |  |  |  | |   __|  |  |     |  | |   ___/  
 /  _____  \\ |  \`--'  |     |  |     |  \`--'  | |  |     |  \`----.|  | |  |      
/__/     \\__\\ \\______/      |__|      \\______/  |__|     |_______||__| | _|      
                                                                                 

Start executing...          
                                                                                 
    `);
}

export const executeCommand = (command) => {
    if (command) {
        const executor = exec(command);
        executor.stdout.on("data", function(res) {
            console.log(res);
        });
    }
}

export const executeSyncCommand = (command) => {
    if (command) {
        execSync(command);
    }
}

export const executeSpawnCommand = (command, callback) => {
    if (command) {
        const executor = spawn(command, {
            shell: true,
        });
        executor.stdout.on("data", function(res) {
            console.log(res.toString());
        });
        executor.on("exit", function() {
            console.log("autoflip_log", "complete spawn " + command);
        });
        executor.stderr.on('data', (data) => {
            console.error(`child stderr:\n${data}`);
        });
    }
}

export const move = (command) => {
    if (command) {
        const executor = exec(command);
        executor.stdout.on("data", function(res) {
            console.log(res);
        });
    }
}
