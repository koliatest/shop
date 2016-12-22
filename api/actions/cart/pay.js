import Order from '../../models/order';
import request from 'request';
import config from '../../../src/config';
import mongoose from 'mongoose';

export default function pay(req) {
  return new Promise((resolve, reject) => {
    const { shippingAddress, phoneNumber } = req.body;
    Order.findOne({ userId: req.user._id.toString(), status: 'IN_CART' })
      .then(orderCart => {
        request({
          url: config.bankAPIHost + '/paymentOfBuying',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': config.bankAPIKey
          },
          json: { cardId: req.body.cardId,
                  amount: req.body.amount }
        }, (err, response, body) => {
          if (body === 'payment success') {
            Order.create({ userId: req.user._id.toString(), status: 'PAID' })
              .then(orderPaid => {
                var arrPaid = orderPaid.products;
                var arrCart = orderCart.products;
                orderPaid.shippingAddress = shippingAddress;
                orderPaid.phoneNumber = phoneNumber;
                arrCart.forEach((itemCart) => {
                  const productIdObj = mongoose.Types.ObjectId(itemCart.productId);
                  arrPaid.push({ productId: productIdObj,
                                 name: itemCart.name,
                                 price: itemCart.price,
                                 images: itemCart.images,
                                 quantity: itemCart.quantity });
                });
                orderPaid.total = orderCart.findTotal();
                orderPaid.date.paid = new Date();
                orderPaid.cardId = req.body.cardId;
                orderPaid.save();
                orderCart.products = [];
                orderCart.save();
              });
              resolve({ message: 'OK' });
          } else {
            reject({ message: 'BAD' });
          }
        });
      })
      .catch(err => reject(err));
  });
}
