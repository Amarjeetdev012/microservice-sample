import mongoose from 'mongoose';
import axios, { isCancel } from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDatabase } from '../db/db.js';
// Connect
connectDatabase(process.env.MONGO_URI);
import Order from './Order.js';
import logger from 'morgan';

const app = express();
const port = 6000;
app.use(express.json());
app.use(logger('dev'));

// create order
app.post('/order', async (req, res) => {
  const data = req.body;
  const { customerID, bookID, initialDate } = data;
  if (!customerID || bookID || initialDate) {
    return res.status(400).send({
      status: false,
      message:
        'something missing please check you have put all details customerID,bookID,initialDate',
    });
  }
  if (
    !mongoose.Types.ObjectId(customerID) ||
    !mongoose.Types.ObjectId(bookID)
  ) {
    return res.status(400).send({
      status: false,
      message: 'please provide valid customerID or bookID',
    });
  }
  await Order.create(data)
    .then(() => {
      return res.status(201).send({
        status: true,
        message: 'New order added successfully!',
        data: data,
      });
    })
    .catch((err) => {
      return res.status(500).send({ status: false, msg: err.message });
    });
});

// get orders
app.get('/orders', (req, res) => {
  Order.find()
    .then((orders) => {
      if (orders) {
        res.status(200).send({
          status: true,
          message: 'orders find succesfully',
          data: orders,
        });
      } else {
        res.status(404).send({ status: false, message: 'Orders not found' });
      }
    })
    .catch((err) => {
      return res.status(500).send({ status: false, msg: err.message });
    });
});

// get order by id
app.get('/order/:id', (req, res) => {
  Order.findById(req.params.id)
    .then((order) => {
      if (order) {
        axios
          .get(`http://localhost:5000/customer/${order.customerID}`)
          .then((response) => {
            let orderObject = {
              CustomerName: response.data.name,
              BookTitle: '',
            };
            axios
              .get(`http://localhost:4000/book/${order.bookID}`)
              .then((response) => {
                orderObject.BookTitle = response.data.title;
                res
                  .status(200)
                  .send({
                    status: true,
                    message: 'order get sucesfully by id',
                    data: orderObject,
                  });
              });
          });
      } else {
        res.status(404).send({status:false,message:'Orders not found'});
      }
    })
    .catch((err) => {
      return res.status(500).send({ status: false, msg: err.message });
    });
});

// listening port
app.listen(port, () => {
  console.log(`server is Running on port ${port} - This is Order service`);
});
