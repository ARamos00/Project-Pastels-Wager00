// frontend/components/FighterDetails.js
const FighterDetails = ({ fighter }) => {
    if (!fighter) return <p>No fighter selected</p>;

    return (
        <div>
            <p>{fighter.name}</p>
            <p>Age: {fighter.age}</p>
            <p>Height: {fighter.height}</p>
            <p>Weight: {fighter.weight}</p>
            <p>Wins: {fighter.stats.wins}</p>
            <p>Losses: {fighter.stats.losses}</p>
            <p>Draws: {fighter.stats.draws}</p>
        </div>
    );
};

export default FighterDetails;



