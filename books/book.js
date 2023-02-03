import mongoose from 'mongoose';
const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  numberPages: {
    type: Number,
  },
  publisher: {
    type: String,
  },
});

const Book = mongoose.model('book', bookSchema);

export default Book;
