import express, { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { checkAvaliability, loginUser, registerUser } from '../models/authModel';
import bcrypt from 'bcrypt';
import { authenticateJWT } from '../services/authMiddleware';
import { production, jwtSecret } from '../services/envsExports';

const router = express.Router();

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}

// authjwt here is needed to authenticate the verify route and use middleware to validate, hacky but works

router.get('/verify', authenticateJWT, (req: Request, res: Response) => {
  const jwtPayloadValid = req.user;

  if (!jwtPayloadValid) {
    res.status(400).json({ message: 'Token is not valid' })
  }

  res.cookie('localAuth', true, {
    httpOnly: false,                                // not needed, this will be used by client to check
    secure: production ? true : false,              // token validity only once a day
    sameSite: 'strict',
    maxAge: 60*60*24*1,
  })

  res.status(200).json({ message: 'Token is valid' });
});

router.get('/logout', authenticateJWT, (req: Request, res: Response) => {

  res.cookie('authToken', '', {
    httpOnly: true,
    secure: production ? true : false,
    sameSite: 'strict',
    maxAge: 0,
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

router.post('/register', async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  const alreadyLogin = req.cookies?.authToken;

  if (alreadyLogin) {
    return res.status(200).json({ message: 'Aleady logged in' });
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  // Save user to the database
  await registerUser(email, username, hashedPassword);

  res.status(201).json({ message: 'Registration successful' });
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password, staylogged } = req.body;

  const alreadyLogin = req.cookies?.authToken;

  if (!username || !password) {
    return res.status(403).json({ message: 'Invalid request' });
  }

  const user = await loginUser(username);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (alreadyLogin) {
    return res.status(200).json({ message: 'Aleady logged in', username, email: user.email });
  }

  //check pw match
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // sign jwt with username and user id
  const token = jwt.sign(
    { id: user.id, username: user.username },       // Payload
    jwtSecret as string,                            // Secret
    { expiresIn: staylogged ? '100h' : '5h' }       // Token expiry
  );

  // send httponly cookie with jwt to client

  res.cookie('authToken', token, {
    httpOnly: true,                                 // Prevent JavaScript access in client
    secure: production ? true : false,              // Ensure cookie is only sent over HTTPS (prod only)
    sameSite: 'strict',                             // Protect against CSRF attacks
    maxAge: staylogged ? 60*60*24*365 : undefined,  // 1 year expiry or session
  });

  res.json({ message: 'Logged in successfully', username, email: user.email });

});

router.post('/check-availability', async (req: Request, res: Response) => {
  const { email, username } = req.body;
  const existingUser = await checkAvaliability(email, username);

  if (existingUser.length > 0) {
    return res.status(400).json({ message: 'Email or username already exists' });
  }

  res.status(200).json({ message: 'Available' });
});

export default router;