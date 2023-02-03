import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  customerID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  bookID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  initialDate: {
    type: Date,
    required: true,
  },
  deliveryDate: {
    type: Date,
  },
});

const Order = mongoose.model('order', orderSchema);

export default Order;
