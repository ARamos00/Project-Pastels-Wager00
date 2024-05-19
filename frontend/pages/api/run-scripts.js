import { exec } from 'child_process';
import path from 'path';

export default function handler(req, res) {
    console.log("API route /api/run-script called"); // Debugging log

    if (req.method === 'GET') {
        // Resolve the absolute path to the script
        const scriptPath = path.resolve(process.cwd(), 'scripts/generate_graphs.py');
        console.log(`Executing script at: ${scriptPath}`); // Debugging log

        // Execute the Python script
        exec(`python ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${error.message}`);
                return res.status(500).json({ error: 'Failed to run script', details: error.message });
            }
            if (stderr) {
                console.error(`Script error: ${stderr}`);
                return res.status(500).json({ error: 'Script error', details: stderr });
            }
            console.log(`Script output: ${stdout}`);
            return res.status(200).json({ message: 'Script executed successfully', output: stdout });
        });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} not allowed`);
    }
}






