import { diskStorage, memoryStorage } from 'multer';

export const uploadMemory = {
  storage: memoryStorage(),
};

export const uploadDisk = {
  storage: diskStorage({
    destination: function (req, file, cb) {
      const uploadDir: string = './src/uploads';
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  }),
};
