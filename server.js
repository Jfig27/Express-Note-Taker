const express = require('express')
const path = require('path')
const fs = require('fs');
const { nanoid } = require('nanoid')
const util = require("util");
const writeFile = util.promisify(fs.writeFile);


// express app
const app = express()
const PORT = process.env.PORT || 3001;

// data
const notesData = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')) //middleware



// api routes
app.get('/api/notes', (req, res) => {
    // console.log(notesData);
    res.json(notesData)


})

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = nanoid();
    notesData.push(newNote);
    res.json(newNote);
    writeFile('db.json', JSON.stringify(notesData));
});

app.delete(`/api/notes/:id`, (req, res) => {
    const chosen = req.params.id;
    for (note of notesData) {
        if (chosen === note.id) {
            notesData.splice(note, 1);
            writeFile('db.json', JSON.stringify(notesData));
            res.json(notesData);
        };
    };
});

//html routes
app.get('/notes',(req, res)=>{
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('*',(req, res)=>{
    res.sendFile(path.join(__dirname, './public/index.html'))
})
//port
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));