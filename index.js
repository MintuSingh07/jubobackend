const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const mongoURL = process.env.MONGODB;

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3001;

const Schema = mongoose.Schema;
const questionSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
});
const QuestionModel = mongoose.model('questionModel', questionSchema, 'questions');

mongoose
    .connect(mongoURL)
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log('Can\'t connect to DB', err);
    });

app.get('/question', async (req, res) => {
    try {
        const data = await QuestionModel.find({});
        res.json(data);
    } catch (err) {
        console.error('Error retrieving data: ', err);
        res.status(500).json({ error: 'An error occurred while retrieving data' });
    }
});

app.post('/upload', async (req, res) => {
    const uploadData = req.body;
    const result = await QuestionModel.create(uploadData);
    res.json(result);
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
