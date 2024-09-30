import express, { Request, Response } from 'express';
import multer from 'multer';
import { authenticateJWT } from '../services/authMiddleware';
import { uploadPropic } from '../models/usersModel';

const storage = multer.memoryStorage(); // Store the file in memory as a buffer
const upload = multer({ storage });

const router = express.Router();

router.post('/upload-propic', authenticateJWT, upload.single('propic'), async (req: Request, res: Response) => {
  const { userId } = req.body;
  const profilePicBuffer = req.file?.buffer; // The image file is available in `req.file.buffer`

  if (!profilePicBuffer) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Store the image (BLOB) in the database
    await uploadPropic(profilePicBuffer, userId);

    res.status(200).json({ message: 'Profile picture uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading profile picture' });
  }
});

// change username

// change email

// change pw

export default router;