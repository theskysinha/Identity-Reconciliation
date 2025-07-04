import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const resolveContact = async (email?: string, phone?: string) => {
  let contacts = await prisma.contact.findMany({
    where: {
      OR: [
        email ? { email } : undefined,
        phone ? { phoneNumber: phone } : undefined
      ].filter(Boolean) as any
    },
    orderBy: { createdAt: 'asc' }
  });

  if (contacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber: phone,
        linkPrecedence: "primary"
      }
    });

    return {
      primaryContatctId: newContact.id,
      emails: email ? [email] : [],
      phoneNumbers: phone ? [phone] : [],
      secondaryContactIds: []
    };
  }

  // Resolve all related contacts
  const relatedIds = new Set<number>();
  for (const contact of contacts) {
    relatedIds.add(contact.linkedId ?? contact.id);
  }

  // If there are multiple primary contacts, merge them by linking to oldest
  if (relatedIds.size > 1) {
    const sorted = [...relatedIds].sort(); // oldest id first
    const primaryIdToKeep = sorted[0];

    await prisma.contact.updateMany({
      where: {
        id: { in: sorted.slice(1) },
        linkPrecedence: "primary"
      },
      data: {
        linkPrecedence: "secondary",
        linkedId: primaryIdToKeep
      }
    });
  }

  const primaryId = Math.min(...Array.from(relatedIds));
  const allContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: { in: Array.from(relatedIds) } },
        { linkedId: { in: Array.from(relatedIds) } }
      ]
    }
  });

  // Check if it's a new combination (email+phone)
  const emailExists = email ? allContacts.some(c => c.email === email) : true;
  const phoneExists = phone ? allContacts.some(c => c.phoneNumber === phone) : true;
  const existingCombo = emailExists && phoneExists;
  if (!existingCombo && (email || phone)) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber: phone,
        linkedId: primaryId,
        linkPrecedence: "secondary"
      }
    });
  }

  const updatedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primaryId },
        { linkedId: primaryId }
      ]
    },
    orderBy: { createdAt: 'asc' }
  });

  const primary = updatedContacts.find(c => c.id === primaryId);
  const emails = Array.from(new Set(updatedContacts.map(c => c.email).filter(Boolean)));
  const phones = Array.from(new Set(updatedContacts.map(c => c.phoneNumber).filter(Boolean)));
  const secondaryIds = updatedContacts
    .filter(c => c.linkPrecedence === 'secondary')
    .map(c => c.id);

  // Move primary's email/phone to front
  if (primary?.email && emails.includes(primary.email)) {
    emails.splice(emails.indexOf(primary.email), 1);
    emails.unshift(primary.email);
  }
  if (primary?.phoneNumber && phones.includes(primary.phoneNumber)) {
    phones.splice(phones.indexOf(primary.phoneNumber), 1);
    phones.unshift(primary.phoneNumber);
  }

  return {
    primaryContatctId: primaryId,
    emails,
    phoneNumbers: phones,
    secondaryContactIds: secondaryIds
  };
};
