import admin from "firebase-admin";
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export function uploadToFirebase(file: Buffer, userId: string) {
  // Implement upload logic
}
