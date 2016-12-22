import Order from '../models/order';

export default function loadOrders(req) {
  return new Promise((resolve, reject) => {
     if (req.user) {
      Order.find({ userId: req.user._id.toString(),
                   $or: [{ status: 'CANCELED' }, { status: 'PAID' },
                         { status: 'DELIVERING' }, { status: 'DELIVERED' }] })
        .then(
          orders => !orders || !orders.length? resolve(null) : resolve({ orders: orders })
        );
      } else {
        resolve(null);
      }
  });
}
