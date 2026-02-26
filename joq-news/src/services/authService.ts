/**
 * Authentication service — wraps Firebase Auth operations.
 * Supports email/password, Google, and Facebook sign-in.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';

import { auth } from '../constants/firebase';
import { useAuthStore, type AuthUser } from '../store/authStore';

WebBrowser.maybeCompleteAuthSession();

function mapFirebaseUser(fbUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerData?: Array<{ providerId?: string }>;
}): AuthUser {
  const providerId = fbUser.providerData?.[0]?.providerId ?? '';
  let provider: AuthUser['provider'] = 'email';
  if (providerId.includes('google')) provider = 'google';
  else if (providerId.includes('facebook')) provider = 'facebook';

  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL,
    provider,
  };
}

/** Sign up with email + password */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string,
): Promise<AuthUser> {
  const { setUser, setLoading } = useAuthStore.getState();
  setLoading(true);
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const user = mapFirebaseUser(cred.user);
    setUser(user);
    return user;
  } finally {
    setLoading(false);
  }
}

/** Sign in with email + password */
export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthUser> {
  const { setUser, setLoading } = useAuthStore.getState();
  setLoading(true);
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const user = mapFirebaseUser(cred.user);
    setUser(user);
    return user;
  } finally {
    setLoading(false);
  }
}

/** Sign in with Google ID token (from expo-auth-session) */
export async function signInWithGoogle(idToken: string): Promise<AuthUser> {
  const { setUser, setLoading } = useAuthStore.getState();
  setLoading(true);
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const cred = await signInWithCredential(auth, credential);
    const user = mapFirebaseUser(cred.user);
    setUser(user);
    return user;
  } finally {
    setLoading(false);
  }
}

/** Sign in with Facebook access token (from expo-auth-session) */
export async function signInWithFacebook(
  accessToken: string,
): Promise<AuthUser> {
  const { setUser, setLoading } = useAuthStore.getState();
  setLoading(true);
  try {
    const credential = FacebookAuthProvider.credential(accessToken);
    const cred = await signInWithCredential(auth, credential);
    const user = mapFirebaseUser(cred.user);
    setUser(user);
    return user;
  } finally {
    setLoading(false);
  }
}

/** Send password reset email */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/** Sign out */
export async function logOut(): Promise<void> {
  const { logout } = useAuthStore.getState();
  await signOut(auth);
  logout();
}
