import * as admin from "firebase-admin";
import { ProductType } from "../entities/ProductType";

const db = admin.database();

export const addPayment = async (payment: {
  tableId: string;
  price: number;
  method: string;
}) => {
  const ref = db.ref("Payments");
  const newPaymentsRef = ref.push();

  await newPaymentsRef.set({
    tableId: payment.tableId,
    price: payment.price,
    method: payment.method,
    created_at: admin.database.ServerValue.TIMESTAMP,
  });

  console.log("Payment added to Firebase Realtime Database");
};

export const getPayments = async () => {
  const paymentsRef = db.ref("Payments");
  
  try {
    const snapshot = await paymentsRef.get();

    if (snapshot.exists()) {
      const paymentsObject = snapshot.val();
      const productsArray = Object.keys(paymentsObject).map((key) => ({
        id: key,
        ...paymentsObject[key],
      }));
      return productsArray;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Erro ao buscar pagamentos: ", error);
    throw error;
  }
};
