// frontend/components/FighterInput.js
const FighterInput = ({ name, value, onChange, placeholder }) => (
    <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mb-2 p-2 border rounded"
    />
);

export default FighterInput;



