// THIS WILL BE A MIDDLEWARE WITH ACCESS TO REQ AND RES OBJECTS
// USE JWT TOKENS FOR THIS AND MAINTAIN A SESSION
// RETURNS TRUE IF THE USER IS VALID ELSE IT RETURNS FALSE
import express from 'express';
export function AuthenticateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log('auth middleware called');
    // res.status(400).json({ error: 'invalid creds' });
    return next();
}
