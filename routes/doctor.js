const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const UPLOADS_CSV = path.join(__dirname, '..', 'uploads.csv');

// Helper: Append upload to CSV
function appendUpload(upload) {
    const line = [
        upload.patientId,
        upload.doctorId,
        upload.reportType,
        upload.reportContent.replace(/[\r\n,]/g, ' '),
        upload.timestamp
    ].join(',');
    const exists = fs.existsSync(UPLOADS_CSV);
    fs.appendFileSync(UPLOADS_CSV, (exists && fs.statSync(UPLOADS_CSV).size ? '\n' : '') + line);
}

// Helper: Read uploads.csv and parse
function readUploads() {
    if (!fs.existsSync(UPLOADS_CSV)) return [];
    const data = fs.readFileSync(UPLOADS_CSV, 'utf8').trim();
    if (!data) return [];
    return data.split('\n').map(line => {
        const [patientId, doctorId, reportType, reportContent, timestamp] = line.split(',');
        return { patientId, doctorId, reportType, reportContent, timestamp };
    });
}

// Upload report
router.post('/upload', (req, res) => {
    const { patientId, doctorId, reportType, reportContent } = req.body;
    if (!patientId || !doctorId || !reportType || !reportContent) {
        return res.status(400).json({ message: 'All fields required.' });
    }
    const upload = {
        patientId,
        doctorId,
        reportType,
        reportContent,
        timestamp: new Date().toISOString()
    };
    appendUpload(upload);
    res.json({ message: 'Report uploaded.' });
});

// View reports for a patient
router.get('/reports/:patientId', (req, res) => {
    const { patientId } = req.params;
    const uploads = readUploads().filter(u => u.patientId === patientId);
    res.json(uploads);
});

module.exports = router;
