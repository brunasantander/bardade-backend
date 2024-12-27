import * as admin from "firebase-admin";

const db = admin.database();

export const addTableToDatabase = async (product: {
  number: number;
  client: string;
  total: number;
}) => {
  const ref = db.ref("Tables");
  const newTableRef = ref.push();

  await newTableRef.set({
    number: product.number,
    client: product.client,
    total: product.total,
    created_at: admin.database.ServerValue.TIMESTAMP,
  });

  console.log("Table added to Firebase Realtime Database");
};

export const updateTotal = async (update: {total: number; tableId: string}) => {
  const tablesRef = db.ref("Tables");
  const itemRef = tablesRef.child(update.tableId);

  await itemRef.update({
    total: update.total,
  });

  console.log("Total updated successfully");
};