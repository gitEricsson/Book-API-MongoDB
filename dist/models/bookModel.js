"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true
    },
    slug: String,
    author: {
        type: String,
        required: [true, 'Book author is required'],
        trim: true
    },
    publishedYear: {
        type: Number,
        required: [true, 'Year published is required'],
        trim: true,
        //Published Year validation
        validate: {
            validator: function (val) {
                // this only points to current doc on NEW document creation
                return val <= new Date().getFullYear();
            },
            message: 'The Year ({VALUE}) is not a valid year'
        }
    },
    ISBN: {
        type: String,
        required: [true, 'ISBN number is required'],
        trim: true
    },
    photo: {
        type: String,
        default: 'default.jpg'
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
bookSchema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.title, {
        lower: true
    });
    next();
});
exports.Book = (0, mongoose_1.model)('Book', bookSchema);
