import * as admin from "firebase-admin";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(
    path.resolve(__dirname, process.env.CREDENTIALS_PATH || "")
  ),
  databaseURL: process.env.DATABASE_URL,
});

