import { useAuth } from '../context/authContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Auth from '../components/Auth';
import Betting from '../components/Betting';
import UserStatus from '../components/UserStatus';
import FighterInput from '../components/FighterInput';
import FighterDetails from '../components/FighterDetails';
import useFighters from '../hooks/useFighters';
import Plot from 'react-plotly.js';

const Game = () => {
    const { currentUser } = useAuth();
    const router = useRouter();
    const { fighters, setFighters, stats, fetchFighterById } = useFighters();
    const [selectedFighter1, setSelectedFighter1] = useState('');
    const [selectedFighter2, setSelectedFighter2] = useState('');
    const [fighter1Details, setFighter1Details] = useState(null);
    const [fighter2Details, setFighter2Details] = useState(null);

    const [newFighter, setNewFighter] = useState({
        name: '',
        age: '',
        height_cms: '',
        weight_lbs: '',
        stance: '',
        wins: '',
        losses: '',
    });

    useEffect(() => {
        if (!currentUser) {
            router.push('/splash');
        }
    }, [currentUser, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFighter((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleAddFighter = async () => {
        try {
            const response = await api.post('/fighters', newFighter);
            setFighters([...fighters, response.data]);
        } catch (error) {
            console.error("Error adding fighter: ", error);
        }
    };

    const handleSelectFighter = async (fighterNumber, fighterId) => {
        if (fighterNumber === 1) {
            setSelectedFighter1(fighterId);
            const fighter = await fetchFighterById(fighterId);
            setFighter1Details(fighter);
        } else {
            setSelectedFighter2(fighterId);
            const fighter = await fetchFighterById(fighterId);
            setFighter2Details(fighter);
        }
    };

    const getSelectedFighter = (fighterId) => fighters.find(fighter => fighter._id === fighterId);

    if (!currentUser) {
        return null;
    }

    return (
        <div className="container mx-auto p-4">
            <UserStatus />
            <h1 className="text-2xl mb-4">Game Dashboard</h1>

            <section className="mb-8">
                <h2 className="text-xl mb-2">Authentication</h2>
                <Auth />
            </section>

            <section className="mb-8">
                <h2 className="text-xl mb-2">Add Fighter</h2>
                {Object.keys(newFighter).map(key => (
                    <FighterInput
                        key={key}
                        name={key}
                        value={newFighter[key]}
                        onChange={handleInputChange}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    />
                ))}
                <button onClick={handleAddFighter} className="p-2 bg-blue-500 text-white rounded">Add Fighter</button>
            </section>

            <section className="mb-8">
                <h2 className="text-xl mb-2">Betting Interface</h2>
                <div>
                    <label htmlFor="fighter1">Search Fighter 1:</label>
                    <input
                        type="text"
                        id="fighter1"
                        placeholder="Search for Fighter 1"
                        onChange={(e) => handleSelectFighter(1, e.target.value)}
                        className="mb-2 p-2 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="fighter2">Search Fighter 2:</label>
                    <input
                        type="text"
                        id="fighter2"
                        placeholder="Search for Fighter 2"
                        onChange={(e) => handleSelectFighter(2, e.target.value)}
                        className="mb-2 p-2 border rounded"
                    />
                </div>
                <div>
                    <h3>Fighter 1 Details:</h3>
                    {fighter1Details && <FighterDetails fighter={fighter1Details} />}
                </div>
                <div>
                    <h3>Fighter 2 Details:</h3>
                    {fighter2Details && <FighterDetails fighter={fighter2Details} />}
                </div>
                <Betting />
            </section>

            <section className="mb-8">
                <h2 className="text-xl mb-2">Fighter Statistics</h2>
                {stats.ages.length > 0 && stats.weights.length > 0 ? (
                    <div id="graph-container">
                        <Plot
                            data={[
                                {
                                    x: stats.ages,
                                    type: 'histogram',
                                    marker: { color: 'blue' },
                                },
                            ]}
                            layout={{ title: 'Age Distribution' }}
                        />
                        <Plot
                            data={[
                                {
                                    x: stats.weights,
                                    type: 'histogram',
                                    marker: { color: 'red' },
                                },
                            ]}
                            layout={{ title: 'Weight Distribution' }}
                        />
                    </div>
                ) : (
                    <p>Loading graphs...</p>
                )}
            </section>

            <section className="mb-8">
                <h2 className="text-xl mb-2">Fighter List</h2>
                <ul>
                    {fighters.map(fighter => (
                        <li key={fighter._id}>{fighter.name}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Game;
