import Order from '../../models/order';
import Product from '../../models/product';

import mongoose from 'mongoose';

export default function updateQuantity(req) {
  return new Promise((resolve, reject) => {
    Order.findOne({ userId: req.user._id.toString(), status: "IN_CART" })
        .then(order => {
            var item = order.products.find(function(elem) {
                return elem.productId.toString() === req.body.productId;
            });
            item.quantity = req.body.quantity;
            return order.save();
        })
        // .then(order => Order.populate(order, { path: 'products.productId', select: 'name price' }))
        .then(
            order => resolve({ order: order, total: order.findTotal() }),
            err => reject(err)
        );
  });
}
