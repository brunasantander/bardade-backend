"use strict";
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
const express_1 = require("express");
const order_1 = require("../database/order");
const router = (0, express_1.Router)();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, tableId } = req.body;
        yield (0, order_1.addOrdersToDatabase)({ status: status, table_id: tableId });
        res.json({ message: 'Order added to firebase successfully!' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add order to database' });
    }
}));
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, id } = req.body;
        yield (0, order_1.updateStatus)({ status: status, id: id });
        res.json({ message: 'Order status updated successfully!' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update' });
    }
}));
router.post('/itens', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, orderId, amount, price } = req.body;
        yield (0, order_1.addOrdersItemToDatabase)({ product_id: productId, order_id: orderId, amount: amount, price: price });
        res.json({ message: 'Order added to firebase successfully!' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add order to database' });
    }
}));
exports.default = router;
