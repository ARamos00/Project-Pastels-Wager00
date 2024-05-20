// frontend/components/FighterForm.js
import { useState } from 'react';
import FighterInput from './FighterInput';

const FighterForm = ({ addFighter }) => {
    const [newFighter, setNewFighter] = useState({
        name: '',
        age: '',
        height: '',
        weight: '',
        hometown: '',
        stats: {
            wins: '',
            losses: '',
            draws: '',
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('stats.')) {
            const statName = name.split('.')[1];
            setNewFighter((prevState) => ({
                ...prevState,
                stats: {
                    ...prevState.stats,
                    [statName]: value,
                },
            }));
        } else {
            setNewFighter((prevState) => ({ ...prevState, [name]: value }));
        }
    };

    const handleAddFighter = () => {
        addFighter(newFighter);
    };

    return (
        <div>
            <h2 className="text-xl mb-2">Add Fighter</h2>
            {Object.keys(newFighter).map(key =>
                key === 'stats' ? Object.keys(newFighter.stats).map(stat => (
                    <FighterInput
                        key={stat}
                        name={`stats.${stat}`}
                        value={newFighter.stats[stat]}
                        onChange={handleInputChange}
                        placeholder={stat.charAt(0).toUpperCase() + stat.slice(1)}
                    />
                )) : (
                    <FighterInput
                        key={key}
                        name={key}
                        value={newFighter[key]}
                        onChange={handleInputChange}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    />
                )
            )}
            <button onClick={handleAddFighter} className="p-2 bg-blue-500 text-white rounded">Add Fighter</button>
        </div>
    );
};

export default FighterForm;
