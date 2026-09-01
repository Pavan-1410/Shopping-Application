import { cert, getApps, initializeApp } from "firebase-admin/app";
import serviceAccount from "../serviceAccountKey.json" with { type: "json" };

const firebaseAdmin =
  getApps().length === 0
    ? initializeApp({
        credential: cert({  // cert() creates Firebase Admin credentials from your service account JSON
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
        }),
      })
    : getApps()[0];

export default firebaseAdmin;