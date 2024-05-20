"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';

const SplashPage = () => {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (currentUser) {
            router.push('/game');
        }
    }, [currentUser, router]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Welcome to Pastel's Wager</h1>
            <button onClick={() => router.push('/signin')} className="p-2 bg-blue-500 text-white rounded">
                Sign In
            </button>
            <button onClick={() => router.push('/signup')} className="p-2 bg-green-500 text-white rounded ml-2">
                Sign Up
            </button>
        </div>
    );
};

export default SplashPage;








