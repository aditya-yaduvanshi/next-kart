import * as firebaseAdmin from 'firebase-admin';

if (!firebaseAdmin.apps.length) {
	firebaseAdmin.initializeApp({
		credential: firebaseAdmin.credential.cert({
			projectId: `${process.env.PROJECT_ID}`,
			clientEmail: `${process.env.CLIENT_EMAIL}`,
			privateKey: `${process.env.PRIVATE_KEY}`.replace(/\\n/g, '\n'),
		}),
	});
}

const bucket = firebaseAdmin.storage(),
	db = firebaseAdmin.firestore(),
	auth = firebaseAdmin.auth();

export {bucket, db, auth};
