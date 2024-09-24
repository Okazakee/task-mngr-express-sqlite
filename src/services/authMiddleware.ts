import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
  export interface Request {
    user?: string | JwtPayload;
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  try {
    const secretKey = process.env.JWT_SECRET!;

    const decoded = jwt.verify(token, secretKey); // Verify token

    req.user = decoded;  // Attach decoded user info to the request object

    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};