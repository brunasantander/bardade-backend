"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTable = exports.getTableInfo = exports.createOrder = exports.getTable = exports.addTableToDatabase = exports.updateTotal = exports.addCartToDatabase = void 0;
const admin = __importStar(require("firebase-admin"));
const order_1 = require("./order");
const payment_1 = require("./payment");
const db = admin.database();
const addCartToDatabase = (table) => __awaiter(void 0, void 0, void 0, function* () {
    const ref = db.ref("Tables");
    const tables = yield (0, exports.getTable)();
    if (tables.length > 0) {
        const tableArray = tables.filter((snapshot) => snapshot.number == table.tableNumber);
        if (tableArray.length > 0) {
            const tableItem = tableArray.at(0);
            if (tableArray.length > 0 && tableItem != undefined) {
                // atualiza total
                let newTotal = tableItem.total + table.total;
                yield (0, exports.updateTotal)({ total: newTotal, tableId: tableItem.id });
                table.products.forEach((product) => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, exports.createOrder)({
                        productId: product.id,
                        tableId: tableItem.id,
                        amount: product.amount,
                        price: product.price,
                    });
                }));
            }
        }
        else {
            yield (0, exports.addTableToDatabase)({ products: table.products, tableNumber: table.tableNumber, total: table.total, client: table.client });
        }
    }
    else {
        yield (0, exports.addTableToDatabase)({ products: table.products, tableNumber: table.tableNumber, total: table.total, client: table.client });
    }
});
exports.addCartToDatabase = addCartToDatabase;
const updateTotal = (update) => __awaiter(void 0, void 0, void 0, function* () {
    const tablesRef = db.ref("Tables");
    const itemRef = tablesRef.child(update.tableId);
    yield itemRef.update({
        total: update.total,
    });
    console.log("Total updated successfully");
});
exports.updateTotal = updateTotal;
const addTableToDatabase = (table) => __awaiter(void 0, void 0, void 0, function* () {
    const ref = db.ref("Tables");
    const tableRef = ref.push();
    yield tableRef.set({
        number: table.tableNumber,
        client: table.client,
        total: table.total,
        created_at: admin.database.ServerValue.TIMESTAMP,
    });
    const snapshot = yield ref.orderByKey().limitToLast(1).once("value");
    if (snapshot.exists()) {
        const items = [];
        snapshot.forEach((childSnapshot) => {
            const item = Object.assign({ id: childSnapshot.key }, childSnapshot.val());
            items.push(item);
        });
        const newTable = items[0];
        table.products.forEach((product) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, exports.createOrder)({
                productId: product.id,
                tableId: newTable.id,
                amount: product.amount,
                price: product.price,
            });
        }));
    }
    else {
        console.log("No items found in the table.");
    }
});
exports.addTableToDatabase = addTableToDatabase;
const getTable = () => __awaiter(void 0, void 0, void 0, function* () {
    const tablesRef = db.ref("Tables");
    try {
        const snapshot = yield tablesRef.get();
        if (snapshot.exists()) {
            const tablesObject = snapshot.val();
            const tablesArray = Object.keys(tablesObject).map((key) => (Object.assign({ id: key }, tablesObject[key])));
            return tablesArray;
        }
        else {
            return [];
        }
    }
    catch (error) {
        console.error("Erro ao buscar mesas: ", error);
        throw error;
    }
});
exports.getTable = getTable;
const createOrder = (order) => __awaiter(void 0, void 0, void 0, function* () {
    const orderRef = db.ref("Orders");
    // Cria Pedido
    yield (0, order_1.addOrdersToDatabase)({
        status: "pending",
        table_id: order.tableId,
    });
    const orderSnapshot = yield orderRef
        .orderByKey()
        .limitToLast(1)
        .once("value");
    if (orderSnapshot.exists()) {
        const items = [];
        orderSnapshot.forEach((childSnapshot) => {
            const item = Object.assign({ id: childSnapshot.key }, childSnapshot.val());
            items.push(item);
        });
        const newOrder = items[0];
        // Cria Itens do Pedido
        yield (0, order_1.addOrdersItemToDatabase)({
            product_id: order.productId,
            order_id: newOrder.id,
            amount: order.amount,
            price: order.price,
        });
    }
});
exports.createOrder = createOrder;
const getTableInfo = (tableId) => __awaiter(void 0, void 0, void 0, function* () {
    const tablesRef = db.ref("Tables");
    const itemRef = tablesRef.child(tableId);
    const OrdersRef = db.ref("Orders");
    const orderItemRef = yield OrdersRef.get();
    if (orderItemRef.exists()) {
        const tablesObject = orderItemRef.val();
        const tablesArray = Object.keys(tablesObject).map((key) => (Object.assign({ id: key }, tablesObject[key])));
        if (tablesArray.length > 0) {
            const orderItems = tablesArray.filter((item) => item.table_id == tableId);
            const OrdersItemsRef = db.ref("OrderItems");
            const snapshot = yield OrdersItemsRef.get();
            if (snapshot.exists()) {
                const orderItemsObject = snapshot.val();
                const orderItemsArray = Object.keys(orderItemsObject).map((key) => (Object.assign({ id: key }, orderItemsObject[key])));
                var items = [];
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
                const productsItemRef = yield ProductsRef.get();
                if (productsItemRef.exists()) {
                    const productsObject = productsItemRef.val();
                    const productsArray = Object.keys(productsObject).map((key) => (Object.assign({ id: key }, productsObject[key])));
                    var products = [];
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
        }
        else {
            return [];
        }
    }
    else {
        return [];
    }
});
exports.getTableInfo = getTableInfo;
const deleteTable = (tableId, method) => __awaiter(void 0, void 0, void 0, function* () {
    const tablesRef = db.ref("Tables");
    const itemRef = tablesRef.child(tableId);
    const tables = yield (0, exports.getTable)();
    const table = tables.find((t) => t.id == tableId);
    const OrdersRef = db.ref("Orders");
    const orderItemRef = yield OrdersRef.get();
    if (orderItemRef.exists()) {
        const tablesObject = orderItemRef.val();
        const tablesArray = Object.keys(tablesObject).map((key) => (Object.assign({ id: key }, tablesObject[key])));
        if (tablesArray.length > 0) {
            const itens = tablesArray.filter((item) => item.table_id == tableId);
            if (itens.length > 0) {
                yield (0, payment_1.addPayment)({ tableId: tableId, price: table.total, method: method });
                itens.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                    const aux = OrdersRef.child(item.id);
                    aux.update({
                        status: "done"
                    });
                }));
            }
        }
    }
    yield itemRef.remove();
});
exports.deleteTable = deleteTable;
