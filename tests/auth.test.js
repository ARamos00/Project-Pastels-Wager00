const { app, adminAuth, firebase } = require('./firebaseTestUtils');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } = require('firebase/auth');

describe('Firebase Authentication', () => {
    const testEmail = 'testuser@example.com';
    const testPassword = 'Test@1234';
    const auth = getAuth(app);

    afterAll(async () => {
        await adminAuth.deleteUser((await auth.currentUser).uid);
    });

    test('should create a new user', async () => {
        const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        expect(userCredential.user.email).toBe(testEmail);
    });

    test('should sign in the user', async () => {
        await signInWithEmailAndPassword(auth, testEmail, testPassword);
        expect(auth.currentUser.email).toBe(testEmail);
    });

    test('should sign out the user', async () => {
        await signOut(auth);
        expect(auth.currentUser).toBeNull();
    });
});
