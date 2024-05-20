// frontend/components/Auth.js
import React, { useState } from 'react';
import { useAuth } from '../context/authContext';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleLogin = async () => {
        try {
            await login(email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRegister = async () => {
        try {
            await register(email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Auth;

