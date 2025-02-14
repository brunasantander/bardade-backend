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
exports.getProductsByName = exports.getProducts = exports.addProductToDatabase = void 0;
const admin = __importStar(require("firebase-admin"));
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
admin.initializeApp({
    credential: admin.credential.cert(path.resolve(__dirname, process.env.CREDENTIALS_PATH || "")),
    databaseURL: process.env.DATABASE_URL,
});
const db = admin.database();
const addProductToDatabase = (product) => __awaiter(void 0, void 0, void 0, function* () {
    const ref = db.ref("Products");
    const newProductRef = ref.push();
    yield newProductRef.set({
        name: product.name,
        price: product.price,
        type: product.type,
        created_at: admin.database.ServerValue.TIMESTAMP,
    });
    console.log("Product added to Firebase Realtime Database");
});
exports.addProductToDatabase = addProductToDatabase;
const getProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const productsRef = db.ref("Products");
    try {
        const snapshot = yield productsRef.get();
        if (snapshot.exists()) {
            const productsObject = snapshot.val();
            const productsArray = Object.keys(productsObject).map((key) => (Object.assign({ id: key }, productsObject[key])));
            return productsArray;
        }
        else {
            return [];
        }
    }
    catch (error) {
        console.error("Erro ao buscar produtos: ", error);
        throw error;
    }
});
exports.getProducts = getProducts;
const getProductsByName = (param) => __awaiter(void 0, void 0, void 0, function* () {
    const products = db.ref("Products");
    const query = products.orderByChild("name").equalTo(param.name);
    const product = yield query.get();
    return product;
});
exports.getProductsByName = getProductsByName;
