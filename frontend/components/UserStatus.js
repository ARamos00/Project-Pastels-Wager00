// frontend/components/UserStatus.js
import React from 'react';
import { useAuth } from '../context/authContext';

const UserStatus = () => {
    const { currentUser, logout } = useAuth();

    return (
        <div>
            <p>Welcome, {currentUser.email}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default UserStatus;


