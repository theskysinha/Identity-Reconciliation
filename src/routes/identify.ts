import express from 'express';
import { identifyContact } from '../controllers/identify.controller';

const router = express.Router();
router.post('/', identifyContact);

export default router;
