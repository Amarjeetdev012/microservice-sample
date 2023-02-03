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
const port = 4000;
app.use(express.json());

// create a book
app.post('/book', (req, res) => {
  const data = req.body;
  const { title, author } = data;
  if (!title) {
    return res
      .status(400)
      .send({ status: false, message: 'title is required' });
  }
  if (!author) {
    return res
      .status(400)
      .send({ status: false, message: 'author is required' });
  }
  Book.create(data)
    .then(() => {
      res.status(201).send({
        status: true,
        message: 'New Book added successfully!',
        data: data,
      });
    })
    .catch((err) => {
      return res.status(500).send({ status: false, msg: err.message });
    });
});

// get books
app.get('/books', (req, res) => {
  Book.find()
    .then((books) => {
      if (books.length !== 0) {
        res.status(200).send({
          status: true,
          message: 'New Book added successfully!',
          data: books,
        });
      } else {
        res.status(404).send({ status: false, message: 'Books not found' });
      }
    })
    .catch((err) => {
      return res.status(500).send({ status: false, msg: err.message });
    });
});

// get book by id
app.get('/book/:id', (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (book) {
        res
          .status(200)
          .send({ status: true, message: 'data find sucessfully', data: book });
      } else {
        res.status(404).send({ status: false, message: 'Books not found' });
      }
    })
    .catch((err) => {
      return res.status(500).send({ status: false, msg: err.message });
    });
});

// delete book by id
app.delete('/book/:id', (req, res) => {
  Book.findOneAndRemove(req.params.id)
    .then((book) => {
      if (book) {
        res
          .status(200)
          .send({ status: true, message: 'Book deleted Successfully!' });
      } else {
        res.status(404).send({ status: false, message: 'Book Not found!' });
      }
    })
    .catch((err) => {
      return res.status(500).send({ status: false, msg: err.message });
    });
});

// listening port
app.listen(port, () => {
  console.log(`server is Running on port ${port} - This is Book service`);
});
