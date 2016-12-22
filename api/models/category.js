import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
  parentId: { type: String },
  name: { type: String },
  properties: [{
    name: String,
    type: String
  }]
});

export default mongoose.model('Category', CategorySchema);
