import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  categoryId: String,
  name: String,
  price: Number,
  images: [String],
  company: String,
  inStock: Number,
  description: String,
  properties: [{
    name: String,
    value: String
  }]
});

export default mongoose.model('Product', ProductSchema);
