import firebaseConfig from '../../configs/firebaseConfig';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  Auth,
} from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

export const signInWithGoogle = async (): Promise<any> => {
  try {
    const userCred = await signInWithPopup(auth, new GoogleAuthProvider());
    const user = userCred.user;
    console.log('Google Sign-in Successful.');
    return user;
  } catch (error) {
    console.error('Google Sign-in Error:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await auth.signOut();
    console.log('Sign-out successful.');
  } catch (error) {
    console.error('Sign-out error:', error);
    throw error;
  }
};
