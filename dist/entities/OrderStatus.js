"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["pending"] = 0] = "pending";
    OrderStatus[OrderStatus["done"] = 1] = "done";
    OrderStatus[OrderStatus["paid"] = 2] = "paid";
    OrderStatus[OrderStatus["closed"] = 3] = "closed";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
