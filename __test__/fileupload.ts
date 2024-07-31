import multer from 'multer';
import { Request, Response, NextFunction, Express } from 'express';

const FILE_SIZE = 1;
type FileFilterCallback = any;

export enum StorageType {
  DISK = 'disk'
}

export class FileService {
  fileUtil = {
    fileValidation(
      fn: (
        request: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
      ) => Promise<void>
    ) {
      return fn;
    }
  };
  disk() {
    return multer.diskStorage({
      destination: function(
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
      ) {
        cb(null, '/tmp/my-uploads');
      },
      filename: function(
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
      ) {
        cb(null, file.fieldname + '-' + Date.now());
      }
    });
  }
  uploadFiles = (
    storage: StorageType,
    validationFn: (
      request: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => Promise<void>
  ) => {
    const upload = multer({
      storage: this[storage](),
      limits: { fileSize: 1024 * 1024 * FILE_SIZE },
      fileFilter: this.fileUtil.fileValidation(validationFn)
    });
    return upload.array('files', 5);
  };
}
