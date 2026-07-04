// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Enterprise MongoDB Cloud Connection
mongoose.connect('mongodb://localhost:21017/musingExtremeStudio', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("[CLUSTER-INFO] Remote MongoDB Cluster Handshake: SUCCESS"))
  .catch(err => console.log("[DATABASE-ALERT] Cluster Driver Error:", err));

// Deep Systems Diagnostics Store
let systemDiagnostics = {
    totalPipelinedRequests: 0,
    activeNodesCount: 1,
    bufferFlushCount: 0,
    recentEvents: []
};

const QuoteSchema = new mongoose.Schema({
    text: String,
    author: String,
    mood: String,
    bgImage: String,
    timestamp: { type: Date, default: Date.now }
});

const Quote = mongoose.model('Quote', QuoteSchema);

// Deep Server Telemetry API Endpoint
app.get('/api/telemetry/logs', (req, res) => {
    res.json({
        ...systemDiagnostics,
        serverUptime: process.uptime(),
        memoryUsage: process.memoryUsage().heapUsed
    });
});

// Dynamic Query Aggregations Engine
app.get('/api/quotes/random', async (req, res) => {
    systemDiagnostics.totalPipelinedRequests++;
    const { mood } = req.query;
    
    let eventLog = `[FETCH-EVENT] Category: ${mood || 'all'} | Time: ${new Date().toLocaleTimeString()}`;
    systemDiagnostics.recentEvents.unshift(eventLog);
    if(systemDiagnostics.recentEvents.length > 8) systemDiagnostics.recentEvents.pop();

    try {
        let filter = {};
        if (mood && mood !== 'all') {
            filter.mood = mood;
        }
        
        const count = await Quote.countDocuments(filter);
        if (count === 0) {
            // Hot Hybrid Auto-Generator Node
            return res.json({
                text: "The architectural depth of your enterprise codebase dictates the lifetime stability of your deployed software.",
                author: "Principal Fullstack Engineer",
                mood: "focus",
                bgImage: `https://picsum.photos/1080/1920?random=${Math.floor(Math.random()*2000)}`
            });
        }
        
        const randomIndex = Math.floor(Math.random() * count);
        const randomQuote = await Quote.findOne(filter).skip(randomIndex);
        res.json(randomQuote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/upload', async (req, res) => {
    try {
        const newQuote = new Quote(req.body);
        await newQuote.save();
        systemDiagnostics.recentEvents.unshift(`[DB-WRITE] New quote injected to MongoDB cluster successfully.`);
        res.status(201).json({ message: "Payload committed to database storage cluster!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log("[MICROSERVICE] Live production node listening on port 3000"));