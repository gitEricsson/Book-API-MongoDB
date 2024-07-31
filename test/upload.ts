import chai from 'chai';
import fs from 'fs';
import chaiHttp from 'chai-http';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';

chai.use(chaiHttp);
const { expect } = chai;

let mongoServer: MongoMemoryServer;

describe('Books API', () => {
  before(async () => {
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

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('It should successfully upload an image', async () => {
    const initialRes = await chai
      .request(app)
      .post('/api/books')
      .send({
        title: 'Things Fall Apart',
        author: 'Chinua Achibe',
        publishedYear: 1958,
        ISBN: '978-0385474542'
      });

    const bookId = initialRes.body.data.data.id;
    console.log(bookId);

    const res = await chai
      .request(app)
      .post(`/api/books/cover-image/${bookId}`)
      .set('content-type', 'multipart/form-data')
      .attach('photo', path.resolve(__dirname, 'imageTest.jpg'));
    // .attach(
    //   'photo',
    //   fs.readFileSync(`${__dirname}/imageTest.jpg`),
    //   'test/imageTest.jpg'
    // );

    expect(res.statusCode).to.equal(200);
    expect(res.body.status).to.equal('success');
  });
});
