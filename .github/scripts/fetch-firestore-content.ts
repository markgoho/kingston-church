import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'node:path';

const indexPath = path.resolve(import.meta.dirname, '../../hugo/content/_index.md');

// Initialize Firebase Admin with service account from environment
const serviceAccount = JSON.parse(process.env['FIREBASE_SERVICE_ACCOUNT']!);
initializeApp({ credential: cert(serviceAccount) });
const database = getFirestore();

const snapshot = await database.collection('content').doc('homepage').get();

if (snapshot.exists) {
  const data = snapshot.data()!;
  const original = await Bun.file(indexPath).text();

  // Parse the existing file into front matter and body
  const frontMatterMatch = original.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontMatterMatch) {
    throw new Error('Could not parse front matter from _index.md');
  }

  const body = frontMatterMatch[2];

  // Build updated front matter
  const sundayBibleStudy = data.sundayBibleStudy || 'TBD';
  const sundayWorship = data.sundayWorship || 'TBD';
  const wednesdayBibleStudy = data.wednesdayBibleStudy || 'TBD';

  const newFrontMatter = `---
title: Kingston Church
description: Church of Christ in Kingston NY
sunday:
  bibleStudy: ${sundayBibleStudy}
  worship: ${sundayWorship}
wednesday:
  bibleStudy: ${wednesdayBibleStudy}

---`;

  // Replace the Current Events section if we have new content
  let newBody = body;
  if (data.currentEvents) {
    // Match from "### Current Events" to the next "###" heading or end of file
    const currentEventsRegex = /### Current Events\n[\s\S]*?(?=\n### |$)/;
    const newCurrentEvents = `### Current Events\n\n${data.currentEvents}`;
    newBody = body!.replace(currentEventsRegex, newCurrentEvents);
  }

  const updatedContent = `${newFrontMatter}\n${newBody}`;
  await Bun.write(indexPath, updatedContent);
  console.log('Successfully updated _index.md from Firestore content.');
} else {
  console.log('No homepage content found in Firestore, skipping update.');
}
