import Order from '../../models/order';
import Product from '../../models/product';
import mongoose from 'mongoose';

export default function addProduct(req) {
  return new Promise((resolve, reject) => {
    const { productId, quantity } = req.body;
    const productIdObj = mongoose.Types.ObjectId(productId);

    Order.findOne({ userId: req.user._id.toString(), status: "IN_CART" })
        .then(order => {
          if (!order) {
            Order.create({ userId: req.user._id.toString(), status: "IN_CART" })
              .then(order => {
                var arr = order.products;
                var item = arr.find(function(elem) {
                    return elem.productId.toString() === productId;
                });
                if (item) {
                    item.inStock += quantity;
                    order.save();
                    resolve({ order: order, total: order.findTotal() });
                } else {
                    Product.findOne({ _id: productIdObj })
                      .then(product => {
                        arr.push({ productId: productIdObj,
                                   name: product.name,
                                   price: product.price,
                                   images: product.images,
                                   quantity });
                      })
                      .then(product => {
                        order.date.created = Date.now();
                        order.save();
                        resolve({ order: order, total: order.findTotal() })
                      });
                }
              });
          } else {
            var arr = order.products;
            var item = arr.find(function(elem) {
                return elem.productId.toString() === productId;
            });
            if (item) {
                item.inStock += quantity;
                order.save();
                resolve({ order: order, total: order.findTotal() });
            } else {
              Product.findOne({ _id: productIdObj })
                .then(product => {
                  arr.push({ productId: productIdObj,
                             name: product.name,
                             price: product.price,
                             images: product.images,
                             quantity });
                })
                .then(product => {
                  order.date.created = Date.now();
                  order.save();
                  resolve({ order: order, total: order.findTotal() })
                });
            }
          }
        })
  });
}
