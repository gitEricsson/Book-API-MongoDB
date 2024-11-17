'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function(resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.bookController = void 0;
const bookModel_1 = require('./../models/bookModel');
const appError_1 = require('./../utils/appError');
const catchAsync_1 = __importDefault(require('./../utils/catchAsync'));
const multer_1 = __importDefault(require('multer'));
const sharp_1 = __importDefault(require('sharp'));
class BookController {
  constructor() {
    // SAVING PHOTO AS A MEMORY/BUFFER
    this.multerStorage = multer_1.default.memoryStorage();
    this.multerFilter = (req, file, cb) => {
      if (file.mimetype.startsWith('image')) {
        cb(null, true);
      } else {
        cb(
          new appError_1.AppError(
            'Not an image! Please upload only images.',
            400
          ),
          false
        );
      }
    };
    this.upload = (0, multer_1.default)({
      storage: this.multerStorage,
      fileFilter: this.multerFilter
    });
    this.getAllBooks = (0, catchAsync_1.default)((req, res, next) =>
      __awaiter(this, void 0, void 0, function*() {
        const book = yield bookModel_1.Book.find({});
        if (!book || book.length < 1) {
          return next(new appError_1.AppError('No Book found!', 400));
        }
        // SEND RESPONSE
        res.status(200).json({
          status: 'success',
          results: book.length,
          data: { data: book }
        });
      })
    );
    this.getBook = (0, catchAsync_1.default)((req, res, next) =>
      __awaiter(this, void 0, void 0, function*() {
        const book = yield bookModel_1.Book.findById(req.params.id);
        if (!book) {
          return next(new appError_1.AppError('No Book found!', 400));
        }
        // SEND RESPONSE
        res.status(200).json({
          status: 'success',
          data: { data: book }
        });
      })
    );
    this.createBook = (0, catchAsync_1.default)((req, res, next) =>
      __awaiter(this, void 0, void 0, function*() {
        if (req.body.publishedYear > new Date().getFullYear())
          return next(
            new appError_1.AppError(
              `The Year ${req.body.publishedYear} is not a valid year`,
              400
            )
          );
        const book = yield bookModel_1.Book.create(req.body);
        res.status(201).json({
          status: 'success',
          data: {
            data: book
          }
        });
      })
    );
    this.updateBook = (0, catchAsync_1.default)((req, res, next) =>
      __awaiter(this, void 0, void 0, function*() {
        const book = yield bookModel_1.Book.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
            runValidators: true
          }
        );
        if (!book) {
          return next(
            new appError_1.AppError('No Book found with that ID', 404)
          );
        }
        // Year Validation
        if (
          req.body.publishedYear &&
          req.body.publishedYear > new Date().getFullYear()
        )
          return next(
            new appError_1.AppError(
              `The Year ${req.body.publishedYear} is not a valid year`,
              400
            )
          );
        res.status(200).json({
          status: 'success',
          data: {
            data: book
          }
        });
      })
    );
    this.deleteBook = (0, catchAsync_1.default)((req, res, next) =>
      __awaiter(this, void 0, void 0, function*() {
        const book = yield bookModel_1.Book.findByIdAndDelete(req.params.id);
        if (!book) {
          return next(
            new appError_1.AppError('No book found with that ID', 404)
          );
        }
        //Should be a status code of 204, but since a confirmation message is needed we use 200 instead
        res.status(200).send('It has been successfully deleted🎉');
      })
    );
    this.uploadCoverPhoto = this.upload.single('photo');
    this.resizeCoverPhoto = (0, catchAsync_1.default)((req, res, next) =>
      __awaiter(this, void 0, void 0, function*() {
        if (!req.file) return next();
        req.file.filename = `book-${req.params.id}-${Date.now()}.jpeg`;
        yield (0, sharp_1.default)(req.file.buffer)
          .resize(500, 500)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/${req.file.filename}`);
        next();
      })
    );
    this.updateCoverPhoto = (0, catchAsync_1.default)((req, res, next) =>
      __awaiter(this, void 0, void 0, function*() {
        var _a;
        // 1) Create error if user POSTs password data
        const photo =
          (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        if (
          !photo ||
          req.body.title ||
          req.body.publishedYear ||
          req.body.ISBN ||
          req.body.author
        ) {
          // eslint-disable-next-line no-undef
          return next(
            new appError_1.AppError(
              'This route is solely for Cover photo update. Please use an alternative route',
              400
            )
          );
        }
        const updatedBook = yield bookModel_1.Book.findByIdAndUpdate(
          req.params.id,
          { photo: photo },
          {
            new: true,
            runValidators: true
          }
        );
        res.status(200).json({
          status: 'success',
          data: {
            user: updatedBook
          }
        });
      })
    );
  }
}
exports.bookController = new BookController();
