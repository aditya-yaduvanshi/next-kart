import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
	apiKey: `${process.env.apiKey}`,
	authDomain: `${process.env.authDomain}`,
	projectId: `${process.env.projectId}`,
	storageBucket: `${process.env.storageBucket}`,
	messagingSenderId: `${process.env.messagingSenderId}`,
	appId: `${process.env.appId}`,
	measurementId: `${process.env.measurementId}`,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig),
	bucket = getStorage(app),
	db = getFirestore(app),
	auth = getAuth(app);

export {app, bucket, db, auth};
