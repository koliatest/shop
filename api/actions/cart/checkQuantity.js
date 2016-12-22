import Order from '../../models/order';
import Product from '../../models/product';
import _ from 'underscore';

import mongoose from 'mongoose';

export default function checkQuantity(req) {
  return new Promise((resolve, reject) => {
    Order.findOne({ userId: req.user._id.toString(), status: 'IN_CART' })
      .then(order => {
        let outOfStock = [];

        let promises = order.products.map(item => {
          return new Promise((res, rej) => {
            Product.findById(item.productId)
              .then(inStock => {
                if (inStock.inStock < item.quantity) {
                  outOfStock.push(_.pick(inStock, '_id', 'name', 'inStock'));
                }
              })
              .then(() => res());
          });
        });

        return Promise.all(promises)
          .then(() => {
            if (outOfStock.length) {
              reject({outOfStock});
            } else {
              resolve(null);
            }
          });
      });
  });
}
