import minimist from 'minimist';
import {execSync} from "child_process";
import dotenv from "dotenv";
dotenv.config();

const packages = minimist(process.argv.slice(2));
const flipMobileDirectory = process.env.FLIP_MOBILE_DIR;
const autoFlipDirectory = process.cwd();

switch (packages.action) {
    case 'move_to_flip_project':
        execSync(`cd ${flipMobileDirectory}`);
        break;
    case 'move_to_work_directory':
        execSync(`cd ${autoFlipDirectory}`);
        break;
    case 'move_to_android_project':
        execSync(`cd ${flipMobileDirectory}android`);
        break;
    default:
        console.error("Please specify action");
}
