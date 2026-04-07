const express = require('express');
const cors = require('cors');
const algorithms = require('./algorithms'); 
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/status', (req, res) => {
    res.json({ message: "Algorithm Visualizer API is running!" });
});

// Unified execution endpoint
app.post('/api/execute', (req, res) => {
    const { algorithm, array, target } = req.body;

    if (!array || !Array.isArray(array)) {
        return res.status(400).json({ error: "Please provide a valid array." });
    }

    if (!algorithms[algorithm]) {
        return res.status(400).json({ error: "Algorithm not supported." });
    }

    try {
        const steps = algorithms[algorithm](array, target);
        res.json(steps);
    } catch (error) {
        res.status(500).json({ error: "Failed to execute algorithm." });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});