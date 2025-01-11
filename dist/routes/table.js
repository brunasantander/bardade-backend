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
const table_1 = require("../database/table");
const router = (0, express_1.Router)();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { products, tableNumber, total, tableName } = req.body;
        yield (0, table_1.addCartToDatabase)({ products: products, tableNumber: tableNumber, total: total, client: tableName });
        res.json({ message: 'Table added to firebase successfully!' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add table to database' });
    }
}));
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { total, id } = req.body;
        yield (0, table_1.updateTotal)({ total: total, tableId: id });
        res.json({ message: 'Total updated successfully!' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update' });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tables = yield (0, table_1.getTable)();
        res.status(200).json(tables);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update' });
    }
}));
router.get('/:tableId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tableId } = req.params;
        const info = yield (0, table_1.getTableInfo)(tableId);
        res.status(200).json(info);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get info' });
    }
}));
router.delete('/:tableId/:method', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tableId, method } = req.params;
        const info = yield (0, table_1.deleteTable)(tableId, method);
        res.status(200).json(info);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete table' });
    }
}));
exports.default = router;
