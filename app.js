const express = require('express')
const path = require("path");
const fs = require('fs');

const app = express()
const port = process.env.PORT || 8080
app.use(express.static("public"));

let fileContent = fs.readFileSync("./db/db.json", "utf-8");
fileContent ? fileContent = JSON.parse(fileContent) : fileContent = [];

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Route to show notes main page
app.get('/notes', (req, res) => {
    return res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// API end points
app.get('/api/notes', (req, res) => {
    return res.send(fileContent);
})

app.post('/api/notes', (req, res) => {
    var id = fileContent[fileContent["length"] - 1].id === undefined ? 1 : fileContent[fileContent["length"] - 1].id + 1;

    fileContent.push({
        "id": id,
        ...req.body
    });
    fs.writeFileSync("./db/db.json", JSON.stringify(fileContent), "utf-8");
    res.json(true);
})

app.delete("/api/notes/:id", (req, res) => {
    const delId = fileContent.find(note => note.id === parseInt(req.params.id));

    if (!delId) return res.status(404).send("The note you are deleting is not available");
    const index = fileContent.indexOf(delId);

    fileContent.splice(index, 1);
    fs.writeFileSync("./db/db.json", JSON.stringify(fileContent), "utf-8");
    return res.json(true);
});
app.listen(port, () => console.log(`NotesTaker App listening on port ${port}!`))