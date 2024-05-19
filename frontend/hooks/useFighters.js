import { useState, useEffect } from 'react';
import axios from 'axios';

const useFighters = () => {
    const [fighters, setFighters] = useState([]);
    const [error, setError] = useState(null);

    const fetchFighters = async () => {
        try {
            const response = await axios.get('http://localhost:8001/api/fighters');
            setFighters(response.data.fighters);
        } catch (error) {
            console.error('Error fetching fighters:', error);
            setError(error);
        }
    };

    useEffect(() => {
        fetchFighters();
    }, []);

    return { fighters, error, fetchFighters };
};

export default useFighters;







