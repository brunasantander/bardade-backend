import * as admin from "firebase-admin";
import { ProductType } from "../entities/ProductType";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(
    path.resolve(__dirname, process.env.CREDENTIALS_PATH || "")
  ),
  databaseURL: process.env.DATABASE_URL,
});
const db = admin.database();

export const addProductToDatabase = async (product: {
  name: string;
  price: number;
  type: ProductType;
}) => {
  const ref = db.ref("Products");
  const newProductRef = ref.push();

  await newProductRef.set({
    name: product.name,
    price: product.price,
    type: product.type,
    created_at: admin.database.ServerValue.TIMESTAMP,
  });

  console.log("Product added to Firebase Realtime Database");
};

export const getProducts = async () => {
  const productsRef = db.ref("Products");
  
  try {
    const snapshot = await productsRef.get();

    if (snapshot.exists()) {
      const productsObject = snapshot.val();
      const productsArray = Object.keys(productsObject).map((key) => ({
        id: key,
        ...productsObject[key],
      }));
      return productsArray;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Erro ao buscar produtos: ", error);
    throw error;
  }
};

export const getProductsByName = async (param: { name: string }) => {
  const products = db.ref("Products");
  const query = products.orderByChild("name").equalTo(param.name);
  const product = await query.get();

  return product;
};
