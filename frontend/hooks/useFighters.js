import { useState, useEffect } from 'react';
import api from '../utils/api';

const useFighters = () => {
    const [fighters, setFighters] = useState([]);
    const [stats, setStats] = useState({ ages: [], weights: [] });

    useEffect(() => {
        const fetchFighters = async () => {
            try {
                const response = await api.get('/api/fightData');
                setFighters(response.data);
                const ages = response.data.map(fighter => fighter.age);
                const weights = response.data.map(fighter => fighter.weight_lbs);
                setStats({ ages, weights });
            } catch (error) {
                console.error("Error fetching fighters: ", error);
            }
        };

        fetchFighters();
    }, []);

    const fetchFighterById = async (id) => {
        try {
            const response = await api.get(`/api/fightData/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching fighter by ID: ", error);
        }
    };

    return { fighters, setFighters, stats, fetchFighterById };
};

export default useFighters;
