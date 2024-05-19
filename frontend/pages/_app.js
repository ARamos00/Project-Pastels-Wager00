import '../styles/globals.css';
import { AuthProvider } from '../context/authContext';
import { app } from '../services/firebase';

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;








