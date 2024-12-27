import * as admin from "firebase-admin";
import { OrderStatus } from "../entities/OrderStatus";

const db = admin.database();

export const addOrdersToDatabase = async (order: {
  status: OrderStatus;
  table_id: number;
}) => {
  const ref = db.ref("Orders");
  const newOrderRef = ref.push();

  await newOrderRef.set({
    status: order.status,
    table_id: order.table_id,
    created_at: admin.database.ServerValue.TIMESTAMP,
  });

  console.log("Order added to Firebase Realtime Database");
};

export const addOrdersItemToDatabase = async (item: {
  product_id: number;
  order_id: number;
  amount: number;
  price: number;
}) => {
  const ref = db.ref("OrderItems");
  const newOrdersItemRef = ref.push();

  await newOrdersItemRef.set({
    product_id: item.product_id,
    order_id: item.order_id,
    amount: item.amount,
    price: item.price,
    created_at: admin.database.ServerValue.TIMESTAMP,
  });

  console.log("OrderItem added to Firebase Realtime Database");
};

export const updateStatus = async (item: {status: string; id: string;}) => {
  const ordersRef = db.ref("Orders");
  const itemRef = ordersRef.child(item.id);

  await itemRef.update({
    status: item.status,
  });

  console.log("Order status updated successfully!");
}
