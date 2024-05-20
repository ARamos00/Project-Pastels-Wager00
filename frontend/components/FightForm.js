// frontend/components/FightForm.js
import { useState } from 'react';

const FightForm = ({ addFight }) => {
    const [newFight, setNewFight] = useState({
        R_fighter: '',
        B_fighter: '',
        Referee: '',
        date: '',
        location: '',
        Winner: '',
        title_bout: false,
        weight_class: '',
        no_of_rounds: 3,
        red_stats: {},
        blue_stats: {},
        rounds: []
    });

    const handleFightInputChange = (e) => {
        const { name, value } = e.target;
        setNewFight((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleAddFight = () => {
        addFight(newFight);
    };

    return (
        <div>
            <h2 className="text-xl mb-2">Add Fight</h2>
            {Object.keys(newFight).map(key =>
                key === 'red_stats' || key === 'blue_stats' || key === 'rounds' ? null : (
                    <input
                        key={key}
                        name={key}
                        value={newFight[key]}
                        onChange={handleFightInputChange}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        className="mb-2 p-2 border rounded"
                    />
                )
            )}
            <button onClick={handleAddFight} className="p-2 bg-blue-500 text-white rounded">Add Fight</button>
        </div>
    );
};

export default FightForm;
