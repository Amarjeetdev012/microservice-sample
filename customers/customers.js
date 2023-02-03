import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { connectDatabase } from '../db/db.js';
import logger from 'morgan';

// Connect
connectDatabase(process.env.MONGO_URI);
import Customer from './Customer.js';

const app = express();
app.use(logger('dev'));

const port = 5000;
app.use(express.json());

// create customer
app.post('/customer', async (req, res) => {
  const data = req.body;
  const { name, age, address } = body;
  if (!name || !age || !address) {
    return res.status(400).send({
      status: false,
      message: 'please provide required fields name age address',
    });
  }
  await Customer.create(data)
    .then((data) => {
      res.status(201).send({
        status: true,
        message: 'New Customer created successfully!',
        data: data,
      });
    })
    .catch((err) => {
      return res.status(500).send({ status: false, msg: err.message });
    });
});

// get customers
app.get('/customers', (req, res) => {
  Customer.find()
    .then((customers) => {
      if (customers) {
        res.status(200).send({
          status: true,
          message: 'customer find sucessfully',
          data: customers,
        });
      } else {
        res.status(404).send({ status: false, message: 'customers not found' });
      }
    })
    .catch((err) => {
      return res.status(500).send({ status: false, msg: err.message });
    });
});

// get custome by id
app.get('/customer/:id', (req, res) => {
  Customer.findById(req.params.id)
    .then((customer) => {
      if (customer) {
        res.status(200).send({
          status: true,
          message: 'customer find succesfully',
          data: customer,
        });
      } else {
        res.status(404).send({ status: false, message: 'customer not found' });
      }
    })
    .catch((err) => {
      return res.status(500).send({ status: false, msg: err.message });
    });
});

// delete by id
app.delete('/customer/:id', (req, res) => {
  Customer.findByIdAndRemove(req.params.id)
    .then((customer) => {
      if (customer) {
        res
          .status(204)
          .send({ status: true, message: 'customer deleted Successfully!' });
      } else {
        res.status(404).send({ status: false, message: 'Customer Not Found!' });
      }
    })
    .catch((err) => {
      return res.status(500).send({ status: false, msg: err.message });
    });
});

// listening port
app.listen(port, () => {
  console.log(`server is Running on port ${port}- This is Customer service`);
});
