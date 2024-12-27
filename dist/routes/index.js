"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_1 = __importDefault(require("./products"));
const order_1 = __importDefault(require("./order"));
const router = express_1.default.Router();
router.use('/products', products_1.default);
router.use('/orders', order_1.default);
exports.default = router;
