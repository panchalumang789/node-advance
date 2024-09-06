import { USER } from '../schema/user';
import { ORDER } from '../schema/orders';
import { PAYMENT } from '../schema/payments';
import { PRODUCT } from '../schema/products';
import { ORDERITEM } from '../schema/orderItems';

declare module 'knex/types/tables' {
  interface Tables {
    users: USER;
    orders: ORDER;
    orderItems: ORDERITEM;
    payments: PAYMENT;
    products: PRODUCT;
    users_composite: Knex.CompositeTableType<User>;
  }
}
