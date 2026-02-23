import { auth, db } from '$lib/firebase';
import {
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	type User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthState {
	user: User | null;
	loading: boolean;
	allowed: boolean | null;
}

export const authState: AuthState = $state({
	user: null,
	loading: true,
	allowed: null
});

export function initAuth() {
	onAuthStateChanged(auth, async (user) => {
		authState.user = user;

		if (user) {
			const ref = doc(db, 'allowedUsers', user.email!);
			const snap = await getDoc(ref);
			authState.allowed = snap.exists();
		} else {
			authState.allowed = null;
		}

		authState.loading = false;
	});
}

export async function login() {
	const provider = new GoogleAuthProvider();
	await signInWithPopup(auth, provider);
}

export async function logout() {
	await signOut(auth);
}
