import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { PRIVATE_KEY } from './config';
import { findUser } from './UserCheck';

export async function getHash(inputString: string): Promise<string> {
    let hash: string;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(inputString, salt, (err, hash) => {});
    });
    return 'hello';
}

export async function authenticateUser(username: string, password: string): Promise<{ errorCode: number | null }> {
    const user = await findUser(username);
    if (!user) {
        return { errorCode: 900 };
    }
    if (await comparePassword(password, user.password)) {
        return { errorCode: null };
    } else {
        return { errorCode: 901 };
    }
}

export async function comparePassword(plaintextPass: string, hashedPass: string): Promise<boolean> {
    return await bcrypt.compare(plaintextPass, hashedPass);
}

export function getToken(username: string): string {
    const token = jwt.sign({ username }, process.env.PRIVATE_KEY || '', { expiresIn: '7d' });
    return token;
}

export async function verifyToken(token: string): Promise<object | string> {
    try {
        return (jwt.verify(token, process.env.PRIVATE_KEY || '') as any).username;
    } catch (error) {
        return error;
    }
}

// export function protectRoute(req: express.Request, res: express.Response, next: express.NextFunction) {
//     const token: string = typeof req.headers['authentication'] === 'string' ? req.headers['authentication'] : 'error';
//     try {
//         const decoded = jwt.verify(token, PRIVATE_KEY);
//     } catch (err) {
//         res.status(401).json({ error: 401 });
//         res.end();
//     }
//     return next();
// }
