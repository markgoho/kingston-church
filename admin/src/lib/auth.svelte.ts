import { auth, database } from '$lib/firebase';
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
	// eslint-disable-next-line unicorn/no-null -- Firebase Auth convention
	user: null,
	loading: true,
	// eslint-disable-next-line unicorn/no-null -- not yet checked
	allowed: null
});

export function initAuth() {
	onAuthStateChanged(auth, async (user) => {
		authState.user = user;

		if (user) {
			const reference = doc(database, 'allowedUsers', user.email!);
			const snap = await getDoc(reference);
			authState.allowed = snap.exists();
		} else {
			// eslint-disable-next-line unicorn/no-null -- reset to unchecked state
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
