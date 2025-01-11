import * as admin from "firebase-admin";
import { ProductType } from "../entities/ProductType";
import { addOrdersItemToDatabase, addOrdersToDatabase } from "./order";
import { OrderStatus } from "../entities/OrderStatus";
import { Product } from "../entities/Product";
import { addPayment } from "./payment";

const db = admin.database();

export const addCartToDatabase = async (table: {
  products: Product[];
  tableNumber: number;
  total: number;
  client: string;
}) => {
  const ref = db.ref("Tables");
  const tables = await getTable();

  if (tables.length > 0) {
    const tableArray = tables.filter(
      (snapshot) => snapshot.number == table.tableNumber
    );
    if (tableArray.length > 0) {
      const tableItem = tableArray.at(0);

      if (tableArray.length > 0 && tableItem != undefined) {
        // atualiza total
        let newTotal = tableItem.total + table.total;
        await updateTotal({ total: newTotal, tableId: tableItem.id });
    
        table.products.forEach(async (product) => {
          await createOrder({
            productId: product.id,
            tableId: tableItem.id,
            amount: product.amount,
            price: product.price,
          });
        });
      }
    }
    else {
      await addTableToDatabase({ products: table.products, tableNumber: table.tableNumber, total: table.total, client: table.client })
    }
  } else {
    await addTableToDatabase({ products: table.products, tableNumber: table.tableNumber, total: table.total, client: table.client })
  }
};

export const updateTotal = async (update: {
  total: number;
  tableId: string;
}) => {
  const tablesRef = db.ref("Tables");
  const itemRef = tablesRef.child(update.tableId);

  await itemRef.update({
    total: update.total,
  });

  console.log("Total updated successfully");
};

export const addTableToDatabase = async (table: {
  products: Product[];
  tableNumber: number;
  total: number;
  client: string;
}) => {
  const ref = db.ref("Tables");
  const tableRef = ref.push();

  await tableRef.set({
    number: table.tableNumber,
    client: table.client,
    total: table.total,
    created_at: admin.database.ServerValue.TIMESTAMP,
  });

  const snapshot = await ref.orderByKey().limitToLast(1).once("value");
  if (snapshot.exists()) {
    const items: any[] = [];
    snapshot.forEach((childSnapshot) => {
      const item = {
        id: childSnapshot.key,
        ...childSnapshot.val(),
      };
      items.push(item);
    });
    const newTable = items[0];
    table.products.forEach(async (product) => {
      await createOrder({
        productId: product.id,
        tableId: newTable.id,
        amount: product.amount,
        price: product.price,
      });
    });
  } else {
    console.log("No items found in the table.");
  }
}

export const getTable = async () => {
  const tablesRef = db.ref("Tables");
  try {
    const snapshot = await tablesRef.get();

    if (snapshot.exists()) {
      const tablesObject = snapshot.val();
      const tablesArray = Object.keys(tablesObject).map((key) => ({
        id: key,
        ...tablesObject[key],
      }));
      return tablesArray;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Erro ao buscar mesas: ", error);
    throw error;
  }
};

export const createOrder = async (order: {
  productId: number;
  tableId: number;
  amount: number;
  price: number;
}) => {
  const orderRef = db.ref("Orders");
  // Cria Pedido
  await addOrdersToDatabase({
    status: "pending",
    table_id: order.tableId,
  });
  const orderSnapshot = await orderRef
    .orderByKey()
    .limitToLast(1)
    .once("value");
  if (orderSnapshot.exists()) {
    const items: any[] = [];
    orderSnapshot.forEach((childSnapshot) => {
      const item = {
        id: childSnapshot.key,
        ...childSnapshot.val(),
      };
      items.push(item);
    });
    const newOrder = items[0];
    // Cria Itens do Pedido
    await addOrdersItemToDatabase({
      product_id: order.productId,
      order_id: newOrder.id,
      amount: order.amount,
      price: order.price,
    });
  }
};

export const getTableInfo = async (tableId: string) => {
  const tablesRef = db.ref("Tables");
  const itemRef = tablesRef.child(tableId);

  const OrdersRef = db.ref("Orders");
  const orderItemRef = await OrdersRef.get()

  if (orderItemRef.exists()) {
    const tablesObject = orderItemRef.val();
    const tablesArray = Object.keys(tablesObject).map((key) => ({
      id: key,
      ...tablesObject[key],
    }));
    if (tablesArray.length > 0) {
      const orderItems = tablesArray.filter((item) => item.table_id == tableId);
      const OrdersItemsRef = db.ref("OrderItems");
      const snapshot = await OrdersItemsRef.get();
      if (snapshot.exists()) {
        const orderItemsObject = snapshot.val();
        const orderItemsArray = Object.keys(orderItemsObject).map((key) => ({
          id: key,
         ...orderItemsObject[key],
        }));
        var items: { productId: any; amount: any; price: any; }[] = [];
        orderItems.forEach((order) => {
          orderItemsArray.forEach((item) => {
            if (item.order_id == order.id) {
              items.push({
                productId: item.product_id,
                amount: item.amount,
                price: item.price,
              });
            }
          });
        });
        const ProductsRef = db.ref("Products");
        const productsItemRef = await ProductsRef.get()

        if(productsItemRef.exists()) {
          const productsObject = productsItemRef.val();
          const productsArray = Object.keys(productsObject).map((key) => ({
            id: key,
           ...productsObject[key],
          }));
          var products: { id: any, productName: any; amount: any; price: any; }[] = [];
          items.forEach((item) => {
            productsArray.forEach((product) => {
              if (product.id == item.productId) {
                products.push({
                  id: product.id,
                  productName: product.name,
                  amount: item.amount,
                  price: item.price,
                });
              }
            });
          });
          return products;
        }
      }
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const deleteTable = async (tableId: string, method: string) => {
  const tablesRef = db.ref("Tables");
  const itemRef = tablesRef.child(tableId);
  const tables = await getTable();
  const table = tables.find((t) => t.id == tableId);

  const OrdersRef = db.ref("Orders");
  const orderItemRef = await OrdersRef.get()

  if (orderItemRef.exists()) {
    const tablesObject = orderItemRef.val();
    const tablesArray = Object.keys(tablesObject).map((key) => ({
      id: key,
     ...tablesObject[key],
    }));
    if (tablesArray.length > 0) {
      const itens = tablesArray.filter((item) => item.table_id == tableId);
      if (itens.length > 0) {
        await addPayment({tableId: tableId, price: table.total, method: method});
        itens.forEach(async (item) => {
          const aux = OrdersRef.child(item.id);
          aux.update({
            status: "done"
          });
        });
      }
    }
  }
  await itemRef.remove();
};