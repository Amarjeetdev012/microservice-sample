import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDatabase } from '../db/db.js';
import Book from './Book.js';
import logger from 'morgan';

// Connect database
connectDatabase(process.env.MONGO_URI);
const app = express();
app.use(logger('dev'));
const port = 3000;
app.use(express.json());

app.post('/book', (req, res) => {
  const data = req.body;
  Book.create(data)
    .then(() => {
      res.status(201).send('New Book added successfully!');
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error!');
    });
});

app.get('/books', (req, res) => {
  Book.find()
    .then((books) => {
      if (books.length !== 0) {
        res.status(200).send(books);
      } else {
        res.status(404).send('Books not found');
      }
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error!');
    });
});
app.get('/book/:id', (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (book) {
        res.json(book);
      } else {
        res.status(404).send('Books not found');
      }
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error!');
    });
});
app.delete('/book/:id', (req, res) => {
  Book.findOneAndRemove(req.params.id)
    .then((book) => {
      if (book) {
        res.json('Book deleted Successfully!');
      } else {
        res.status(404).send('Book Not found!');
      }
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error!');
    });
});
app.listen(port, () => {
  console.log(`server is Running on port ${port} - This is Book service`);
});
