"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookController_1 = require("./../controllers/bookController");
const router = (0, express_1.Router)();
router
    .route('/')
    .get(bookController_1.bookController.getAllBooks)
    .post(bookController_1.bookController.createBook);
router
    .route('/:id')
    .get(bookController_1.bookController.getBook)
    .patch(bookController_1.bookController.updateBook)
    .delete(bookController_1.bookController.deleteBook);
router.patch('/cover-image/:id', bookController_1.bookController.uploadCoverPhoto, bookController_1.bookController.resizeCoverPhoto, bookController_1.bookController.updateCoverPhoto);
exports.default = router;
