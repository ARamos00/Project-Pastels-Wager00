// frontend/hooks/useFights.js
import { useState, useEffect } from 'react';
import api from '../utils/api';

const useFights = () => {
    const [fights, setFights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFights = async () => {
            try {
                const response = await api.getFights();
                setFights(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFights();
    }, []);

    const addFight = async (newFight) => {
        try {
            const response = await api.createFight(newFight);
            setFights([...fights, response.data]);
        } catch (err) {
            setError(err);
        }
    };

    return { fights, addFight, loading, error };
};

export default useFights;








