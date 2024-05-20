import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthFactory = {
    createAuthMethod: (method) => {
        const auth = getAuth();
        switch (method) {
            case 'google':
                const provider = new GoogleAuthProvider();
                return {
                    signIn: () => signInWithPopup(auth, provider),
                };
            case 'email':
                return {
                    createUserWithEmailAndPassword: (email, password) => createUserWithEmailAndPassword(auth, email, password),
                    signInWithEmailAndPassword: (email, password) => signInWithEmailAndPassword(auth, email, password),
                };
            default:
                throw new Error(`Unsupported auth method: ${method}`);
        }
    },
};

export default AuthFactory;


