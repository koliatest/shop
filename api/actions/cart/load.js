import Order from '../../models/order';
import Product from '../../models/product';

export default function load(req) {
  return new Promise((resolve, reject) => {
    if (req.user) {
      Order.findOne({ userId: req.user._id.toString(), status: 'IN_CART' })
        .then(order => {
          if (!order || !order.products.length) {
            resolve(null);
          } else {
            let promises = order.products.map(itemCart => {
              return new Promise((res, rej) => {
                Product.findById(itemCart.productId)
                  .then(item => {
                    itemCart.name = item.name;
                    itemCart.price = item.price;
                    itemCart.images = item.images;
                  })
                  .then(() => res())
                  .catch(err => reject(err));
              });
            });

            return Promise.all(promises)
              .then(() => {
                resolve({ order: order, total: order.findTotal() });
              })
              .catch(err => reject(err));
          }
        })
        .catch(err => reject(err));
    } else {
      resolve(null);
    }
  });
}
