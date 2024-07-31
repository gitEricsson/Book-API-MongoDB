import { Router } from 'express';
import { bookController } from './../controllers/bookController';

const router = Router();

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

router.patch(
  '/cover-image/:id',
  bookController.uploadCoverPhoto,
  bookController.resizeCoverPhoto,
  bookController.updateCoverPhoto
);

export default router;
