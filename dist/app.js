"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// const compression = require('compression');
const appError_1 = require("./utils/appError");
const errorController_1 = __importDefault(require("./controllers/errorController"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const app = (0, express_1.default)();
// Global MiddleWares
// Security HTTP Headers
app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Body Parser
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
app.use((0, cookie_parser_1.default)());
// Data sanitization against XSS
app.use((0, xss_clean_1.default)());
// compress responses
// app.use(compression());
// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
// Routes
app.use('/api/books', bookRoutes_1.default);
app.all('*', (req, res, next) => {
    next(new appError_1.AppError(`Can't find ${req.originalUrl} on this Server!`, 404));
});
app.use(errorController_1.default);
exports.default = app;
