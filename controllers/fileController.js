const { saveFile, getFilesByUserId } = require('../models/fileModel');

exports.uploadFile = async (req, res) => {
    let fileContent = req.body.content;

    try {
        // Parse JSON if it's a string
        let parsedContent;
        if (typeof fileContent === 'string') {
            try {
                parsedContent = JSON.parse(fileContent);
            } catch (err) {
                return res.status(400).json({ error: "Invalid JSON format: " + err.message });
            }
        } else if (typeof fileContent === 'object') {
            parsedContent = fileContent;
        } else {
            return res.status(400).json({ error: "Invalid data type. Expected JSON string or object." });
        }

        // Sanitize sensitive data
        parsedContent.forEach(item => {
            if (item.Match) {
                item.Match = item.Match.replace(/\n/g, '\\n');  // Escape newlines
                // Additional sanitization logic if needed
            }
        });

        // Save the file content and associate with the user
        const file = await saveFile(req.user.id, parsedContent);
        res.json({ message: 'File uploaded successfully', file });

    } catch (err) {
        console.error("Error saving file:", err);
        res.status(500).json({ error: 'Error saving file: ' + err.message });
    }
};

exports.getFiles = async (req, res) => {
    const userId = req.user.id;

    try {
        const files = await getFilesByUserId(userId);
        console.log("Files retrieved from DB:", files);  // Log the retrieved files for debugging
        res.json({ files });
    } catch (err) {
        console.error("Error fetching files:", err.message, err.stack);  // Print error message and stack trace
        res.status(500).json({ error: `Error fetching files: ${err.message}` });
    }
};

