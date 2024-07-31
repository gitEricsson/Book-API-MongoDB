"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookController = void 0;
const appError_1 = require("./../utils/appError");
let Books = [];
class bookController {
}
exports.bookController = bookController;
bookController.getAllBooks = (req, res, next) => {
    const doc = Books;
    if (doc.length < 1) {
        return next(new appError_1.AppError('No Book found!', 400));
    }
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: { data: doc }
    });
};
bookController.getBook = (req, res, next) => {
    const book = Books.find(book => +book.id === +req.params.book_id);
    if (!book) {
        return next(new appError_1.AppError('No Book found!', 400));
    }
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        results: book.length,
        data: { data: book }
    });
};
bookController.createBook = (req, res, next) => {
    const id = Date.now();
    const book = Object.assign({ id: id }, req.body);
    if (req.body.publishedYear > new Date().getFullYear())
        return next(new appError_1.AppError(`The Year ${req.body.publishedYear} is not a valid year`, 400));
    Books.push(book);
    res.status(201).json({
        status: 'success',
        data: {
            data: book
        }
    });
};
bookController.updateBook = (req, res, next) => {
    let book = Books.find(book => +book.id === +req.params.book_id);
    if (!book) {
        return next(new appError_1.AppError('No Book found with that ID', 404));
    }
    // Year Validation
    if (req.body.publishedYear &&
        req.body.publishedYear > new Date().getFullYear())
        return next(new appError_1.AppError(`The Year ${req.body.publishedYear} is not a valid year`, 400));
    // Delete from array
    Books.forEach((book, i) => {
        if (+req.params.book_id === book.id) {
            Books.splice(i, 1);
        }
    });
    Object.keys(req.body).forEach((key) => {
        console.log(book);
        book[key] = req.body[key];
    });
    Books.push(book);
    res.status(200).json({
        status: 'success',
        data: {
            data: book
        }
    });
};
bookController.deleteBook = (req, res, next) => {
    Books = Books.filter((book) => {
        return +book.id !== +req.params.book_id;
    });
    res.status(204).json({
        status: 'success',
        data: null
    });
};
