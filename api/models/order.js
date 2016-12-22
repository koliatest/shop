import mongoose, { Schema } from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

const OrderSchema = new Schema({
    userId: { type: String, required: true },
    products: [{
      productId: Schema.Types.ObjectId,
      name: String,
      price: Number,
      images: [String],
      quantity: Number
    }],
    date: {
      created: Date,
      paid: Date,
      delivered: Date
    },
    status: { type: String, enum: [
      'IN_CART',
      'PAID',
      'DELIVERING',
      'DELIVERED',
      'CANCELED'
    ],
    required: true
  },
  total: { type: Number },
  phoneNumber: Number,
  shippingAddress: String,
  cardId: String
});

OrderSchema.plugin(findOrCreate);

OrderSchema.methods.findTotal = function total() {
  return this.products
    .map(function(item) {
      return item.price * item.quantity;
    })
    .reduce(function(prev, curr) {
      return prev + curr;
    });
};

export default mongoose.model('Order', OrderSchema);
