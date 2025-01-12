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
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Iniciando execução do arquivo database.ts');
const admin = __importStar(require("firebase-admin"));
const dotenv = __importStar(require("dotenv"));
// Adiciona um log para verificar se o dotenv está sendo carregado
console.log('Carregando variáveis de ambiente...');
dotenv.config();
const credentialsBase64 = process.env.CREDENTIALS_PATH;
console.log('CREDENTIALS_PATH:', credentialsBase64); // Log da variável de ambiente
if (credentialsBase64) {
    try {
        console.log('Base64 string:', credentialsBase64); // Log da string base64
        const credentials = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
        console.log('Decoded credentials:', credentials); // Log das credenciais decodificadas
        const credentialsJson = JSON.parse(credentials);
        const firebaseConfig = {
            credential: admin.credential.cert(credentialsJson),
            databaseURL: process.env.DATABASE_URL,
        };
        admin.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
    }
    catch (error) {
        console.error('Failed to parse service account JSON file:', error);
    }
}
else {
    console.error('CREDENTIALS_PATH environment variable is not set.');
}
