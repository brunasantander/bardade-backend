import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

const credentialsBase64 = process.env.CREDENTIALS_PATH;

if (credentialsBase64) {

  try {
    const credentials = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
    const credentialsJson = JSON.parse(credentials);

    const firebaseConfig = {
      credential: admin.credential.cert(credentialsJson),
      databaseURL: process.env.DATABASE_URL,
    };

    admin.initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Failed to parse service account JSON file:', error);
  }
} else {
  console.error('CREDENTIALS_PATH environment variable is not set.');
}