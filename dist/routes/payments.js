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
const payment_1 = require("../database/payment");
const router = (0, express_1.Router)();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { price, method, tableId } = req.body;
        yield (0, payment_1.addPayment)({ tableId: tableId, price: price, method: method });
        res.json({ message: 'Payment added to firebase successfully!' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add payment to database' });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield (0, payment_1.getPayments)();
        res.status(200).json(payments);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar pagamentos." });
    }
}));
exports.default = router;
