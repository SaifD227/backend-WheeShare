import express from 'express';
import { signup, signin } from '../controllers/auth.controller';

const router = express.Router();

// Handle preflight requests
router.options('/signup', (req, res) => {
  res.status(200).end();
});

router.options('/signin', (req, res) => {
  res.status(200).end();
});

router.post('/signup', signup);
router.post('/signin', signin);

export default router;
