"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    console.error(err.stack);
    process.exit(1);
});
dotenv_1.default.config({ path: './config.env' });
const app_1 = __importDefault(require("./app"));
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose_1.default
    .connect(DB)
    .then(() => {
    console.log('DB connection successful!');
})
    .catch((err) => {
    console.error('DB connection error:', err);
});
const port = process.env.PORT || 3000;
const server = app_1.default.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
