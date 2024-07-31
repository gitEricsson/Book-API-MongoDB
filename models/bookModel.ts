import { Schema, model } from 'mongoose';
import slugify from 'slugify';
import { NextFunction } from 'express';

export interface IBookSchema {
  title: string;
  slug?: string;
  author: string;
  publishedYear: number;
  ISBN: string | number;
  photo?: string;
}

const bookSchema = new Schema<IBookSchema>(
  {
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
        validator: function(val: number) {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
bookSchema.pre('save', function(next: NextFunction) {
  this.slug = slugify(this.title, {
    lower: true
  });
  next();
});

export const Book = model<IBookSchema>('Book', bookSchema);
