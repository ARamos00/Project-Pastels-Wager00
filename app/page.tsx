// "use client";
//
// import { useEffect } from 'react';
// import { useRouter } from 'next/router';
// import { useAuth } from '../frontend/context/authContext.js';
//
// const HomePage = () => {
//     const { currentUser } = useAuth();
//     const router = useRouter();
//
//     useEffect(() => {
//         if (!currentUser) {
//             router.push('/splash');
//         } else {
//             router.push('/game');
//         }
//     }, [currentUser, router]);
//
//     return null;
// };
//
// export default HomePage;




