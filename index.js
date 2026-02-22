const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Load your database into memory (very fast for 1000 - 100k records)
const data = JSON.parse(fs.readFileSync('./database.json', 'utf8'));

app.get('/api/search', (req, res) => {
    const mobileQuery = req.query.mobile;

    if (!mobileQuery) {
        return res.status(400).json({ success: false, message: "Mobile number is required" });
    }

    // Filter data for matching mobile numbers
    const results = data.filter(item => String(item.mobile) === String(mobileQuery));

    // Return the exact format you requested
    res.json({
        "success": true,
        "API BY": "@yash_code_ai",
        "owner": "@flix_num_to_info",
        "query_mobile": mobileQuery,
        "result": results
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
