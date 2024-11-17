import { IBookSchema, Book } from './../models/bookModel';
import { AppError } from './../utils/appError';
import { Request, Response, NextFunction, Express } from 'express';
import catchAsync from './../utils/catchAsync';
import multer, { FileFilterCallback } from 'multer';
import sharp from 'sharp';
import cloudinary from 'cloudinary';

class BookController {
  // SAVING PHOTO AS A MEMORY/BUFFER
  multerStorage = multer.memoryStorage();

  multerFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ): void => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
  };

  upload = multer({
    storage: this.multerStorage,
    fileFilter: this.multerFilter
  });

  public getAllBooks = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const book: Array<IBookSchema> = await Book.find({});

      if (!book || book.length < 1) {
        return next(new AppError('No Book found!', 400));
      }

      // SEND RESPONSE
      res.status(200).json({
        status: 'success',
        results: book.length,
        data: { data: book }
      });
    }
  );

  public getBook = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const book = await Book.findById(req.params.id);

      if (!book) {
        return next(new AppError('No Book found!', 400));
      }

      // SEND RESPONSE
      res.status(200).json({
        status: 'success',
        data: { data: book }
      });
    }
  );

  public createBook = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      if (req.body.publishedYear > new Date().getFullYear())
        return next(
          new AppError(
            `The Year ${req.body.publishedYear} is not a valid year`,
            400
          )
        );

      const book: IBookSchema = await Book.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          data: book
        }
      });
    }
  );

  public updateBook = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const book: IBookSchema = await Book.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!book) {
        return next(new AppError('No Book found with that ID', 404));
      }

      // Year Validation
      if (
        req.body.publishedYear &&
        req.body.publishedYear > new Date().getFullYear()
      )
        return next(
          new AppError(
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
    }
  );

  public deleteBook = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const book = await Book.findByIdAndDelete(req.params.id);

      if (!book) {
        return next(new AppError('No book found with that ID', 404));
      }

      //Should be a status code of 204, but since a confirmation message is needed we use 200 instead
      res.status(200).send('It has been successfully deleted🎉');
    }
  );

  public uploadCoverPhoto = this.upload.single('photo');

  public resizeCoverPhoto = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.file) return next();

      // Local Storage
      /*
      req.file.filename = `book-${req.params.id}-${Date.now()}.jpeg`;

      await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/${req.file.filename}`);
*/

      // Upload to Cloudinary
      const result = await cloudinary.v2.uploader.upload(req.file.buffer, {
        folder: 'book_covers',
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
      });

      req.file.filename = result.secure_url;

      next();
    }
  );

  public updateCoverPhoto = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1) Create error if user POSTs password data
      const photo = req.file?.filename;

      if (
        !photo ||
        req.body.title ||
        req.body.publishedYear ||
        req.body.ISBN ||
        req.body.author
      ) {
        // eslint-disable-next-line no-undef
        return next(
          new AppError(
            'This route is solely for Cover photo update. Please use an alternative route',
            400
          )
        );
      }
      const updatedBook = await Book.findByIdAndUpdate(
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
    }
  );
}

export const bookController = new BookController();
