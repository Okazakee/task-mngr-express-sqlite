import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { jwtSecret } from './envsExports';

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {

  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret as string) as JwtPayload;
    req.user = decoded;

    const validJWT = req.user &&
      typeof req.user.id === 'number' &&
      req.user.id > 0 &&
      typeof req.user.username === 'string' &&
      req.user.username.length > 0;

    if (!validJWT) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};