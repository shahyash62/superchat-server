import dotenv from 'dotenv';
import path from 'path';

export function configureEnvVars() {
    switch (process.env.NODE_ENV) {
        case 'production':
            dotenv.config();
            break;
        default:
            dotenv.config({ path: path.normalize(`${__dirname}\\..\\..\\.env.dev`) });
    }
}
