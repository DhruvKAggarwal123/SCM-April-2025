const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static HTML files
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api', require('./routes/auth'));
app.use('/api/doctor', require('./routes/doctor'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
