import { FileService, StorageType } from './fileupload';
import multer from 'multer';

// Mocking multer file upload service
const mMulter = {
  array: jest.fn()
};

jest.mock('multer', () => {
  const multer = jest.fn(() => mMulter);
  const oMulter = jest.requireActual('multer');
  for (let prop in oMulter) {
    if (oMulter.hasOwnProperty(prop)) {
      multer[prop] = oMulter[prop];
    }
  }
  return multer;
});

describe('It should successfully upload an image', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });
  let validationFn: jest.Mock<any, any>;
  beforeEach(() => {
    validationFn = jest.fn();
  });

  afterEach(() => {
    validationFn.mockClear();
  });

  it('should pass', () => {
    const fileService = new FileService();
    fileService.uploadFiles(StorageType.DISK, validationFn);
    expect(multer).toBeCalled();
    expect(mMulter.array).toHaveBeenCalledWith('files', 5);
  });
});
