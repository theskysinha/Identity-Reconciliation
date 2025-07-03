import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { resolveContact } from '../utils/contact.helper';

const prisma = new PrismaClient();

export const identifyContact = async (req: Request, res: Response): Promise<void> => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    res.status(400).json({ error: 'Either email or phoneNumber is required' });
    return;
  }

  try {
    const contact = await resolveContact(email, phoneNumber);
    res.status(200).json({ contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};