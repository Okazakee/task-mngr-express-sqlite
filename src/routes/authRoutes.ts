import express, { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { checkAvaliability, loginUser, registerUser } from '../models/authModel';
import bcrypt from 'bcrypt';
import { authenticateJWT } from '../services/authMiddleware';
import { jwtSecret } from '../app';

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
    res.status(400).json({ message: 'Jwt is not valid' })
  }

  res.status(200).json({ message: 'Token is valid' });
});

router.post('/register', async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  // Save user to the database
  await registerUser(email, username, hashedPassword);

  res.status(201).json({ message: 'Registration successful' });
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password, staylogged } = req.body;

  const alreadyLogin = req.cookies?.authToken;

  if (alreadyLogin) {
    return res.status(200).json({ message: 'Aleady logged in' });
  }

  if (!username || !password) {
    return res.status(403).json({ message: 'Invalid request' });
  }

  const user = await loginUser(username);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  //check pw match
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  //return jwt to the user
  const token = jwt.sign(
    { id: '01', username: 'user' },             // Payload
    jwtSecret as string,                        // Secret
    { expiresIn: '100h' }                       // Token expiry
  );

  res.cookie('authToken', token, {
    httpOnly: true,      // Prevent JavaScript access
    secure: false,        // Ensure cookie is only sent over HTTPS
    sameSite: 'strict',     // Protect against CSRF attacks (change to 'none' if cross-origin is needed)
    maxAge: staylogged ? 60*60*24*365 : undefined, // 1 year expiry or session
  });

  res.json({ message: 'Logged in successfully' });

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