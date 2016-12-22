import Order from '../../models/order';
import Product from '../../models/product';

import mongoose from 'mongoose';

export default function deleteProduct(req) {
  return new Promise((resolve, reject) => {
    Order.findOne({ userId: req.user._id.toString(), status: 'IN_CART' })
        .then(order => {
            var arr = order.products;
            var index = arr.findIndex(function(elem) {
                return elem.productId.toString() === req.body.productId;
            });
            arr.splice(index, 1);
            return order.save();
        })
        .then(order => {
            if (order.products.length) {
              /* var arr = order.products;
              Product.findById(mongoose.Types.ObjectId(req.body.productId))
                .then(product => {
                  arr.push({ productId: mongoose.Types.ObjectId(req.body.productId),
                             name: product.name,
                             price: product.price,
                             quantity: product.quantity });
                });
              return order.save(); */
              resolve({ order: order, total: order.findTotal() });
            } else {
              resolve(null);
            }
        })
        /* .then(
            order => resolve({ order: order, total: order.findTotal() }),
            err => reject(err)
        ); */
      .catch(err => reject(err));
  });
}
