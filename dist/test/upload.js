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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importDefault(require("chai"));
const chai_http_1 = __importDefault(require("chai-http"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const path_1 = __importDefault(require("path"));
chai_1.default.use(chai_http_1.default);
const { expect } = chai_1.default;
let mongoServer;
// mocha and chai unit and Integration test
describe('Books API', () => {
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const dbUri = yield mongoServer.getUri();
        const dbName = 'books';
        mongoose_1.default
            .connect(dbUri, { dbName, autoCreate: true })
            .then(() => {
            console.log('DB connection successful!');
        })
            .catch((err) => {
            console.error('DB connection error:', err);
        });
    }));
    after(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.dropDatabase();
        yield mongoose_1.default.disconnect();
        yield mongoose_1.default.connection.close();
        yield mongoServer.stop();
    }));
    it('It should successfully upload an image', () => __awaiter(void 0, void 0, void 0, function* () {
        const initialRes = yield chai_1.default
            .request(app_1.default)
            .post('/api/books')
            .send({
            title: 'Things Fall Apart',
            author: 'Chinua Achibe',
            publishedYear: 1958,
            ISBN: '978-0385474542'
        });
        const bookId = initialRes.body.data.data.id;
        console.log(bookId);
        const res = yield chai_1.default
            .request(app_1.default)
            .post(`/api/books/cover-image/${bookId}`)
            .set('content-type', 'multipart/form-data')
            .attach('photo', path_1.default.resolve(__dirname, 'imageTest.jpg'));
        // .attach(
        //   'photo',
        //   fs.readFileSync(`${__dirname}/imageTest.jpg`),
        //   'test/imageTest.jpg'
        // );
        expect(res.statusCode).to.equal(200);
        expect(res.body.status).to.equal('success');
    }));
});
