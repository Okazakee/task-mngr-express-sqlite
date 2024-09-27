import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtSecret } from './envsExports';

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies?.authToken; // jwt taken from cookies

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, jwtSecret as string) as JwtPayload; // Verify token

    req.user = decoded;  // Attach decoded user info to the request object

    // check jwt has user id and username

    const validJWT = req.user &&
    typeof req.user.id === 'number' &&
    req.user.id > 0 &&
    typeof req.user.username === 'string' &&
    req.user.username.length > 0;

    if (!validJWT) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    next();  // Proceed to the next middleware or route handler
};