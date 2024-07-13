import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updatePassword,
} from 'firebase/auth';
import { auth } from './firebase';

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithWithEmailAndPassword = async (
  auth,
  email,
  password
) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  // result.user
  return result;
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = email => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = password => {
  return updatePassword(auth.currentUser, password);
};
