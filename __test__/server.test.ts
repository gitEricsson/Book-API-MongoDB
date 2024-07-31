import request from 'supertest';
import app from './../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';

jest.setTimeout(30000);

describe('Books API', () => {
  let mongoServer: MongoMemoryServer;

  interface Book {
    title: string;
    author: string;
    publishedYear: number;
    ISBN: string;
  }

  // Create an object of type Book
  const book: Book = {
    title: 'Things Fall Apart',
    author: 'Chinua Achibe',
    publishedYear: 1958,
    ISBN: '978-0385474542'
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const dbUri = await mongoServer.getUri();
    const dbName: string = 'books';

    mongoose
      .connect(dbUri, { dbName, autoCreate: true })
      .then(() => {
        console.log('DB connection successful!');
      })
      .catch((err: Error) => {
        console.error('DB connection error:', err);
      });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('It should add a new book', async () => {
    const res = await request(app)
      .post('/api/books')
      .send(book);

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.data).toHaveProperty('id');
    expect(res.body.status).toEqual('success');
  });

  it('It should retrieve a list of all books', async () => {
    const res = await request(app).get('/api/books');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
  });

  it('It should retrieve details of a specific book by ID', async () => {
    const initialRes = await request(app)
      .post('/api/books')
      .send(book);

    const bookId = initialRes.body.data.data.id;
    const res = await request(app).get(`/api/books/${bookId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.data.id).toEqual(bookId);
  });

  it('It should update the details of a specific book by ID', async () => {
    const initialRes = await request(app)
      .post('/api/books')
      .send(book);

    const bookId = initialRes.body.data.data.id;
    const res = await request(app)
      .patch(`/api/books/${bookId}`)
      .send({
        author: 'Updated Author',
        publishedYear: 2010
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success');
  });

  it('It should successfully upload an image', async () => {
    const initialRes = await request(app)
      .post('/api/books')
      .send(book);

    console.log(path.resolve(__dirname, 'file/imageTest.jpg'));
    const bookId = initialRes.body.data.data.id;
    const res = await request(app)
      .post(`/api/books/cover-image/${bookId}`)
      .attach('photo', path.resolve(__dirname, 'file/imageTest.jpg'));

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success');
  });

  it("It should delete a specific book by it's ID", async () => {
    const initialRes = await request(app)
      .post('/api/books')
      .send(book);

    const bookId = initialRes.body.data.data.id;
    const res = await request(app).delete(`/api/books/${bookId}`);
    expect(res.statusCode).toEqual(200);
  });
});