import multer from 'multer';
import fs from "fs";
const userPictureUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/upload/userPictureUpload'); 
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

const groceryPictureUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './public/upload/groceryPictureUpload'); 
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed'));
      }
      cb(null, true);
    },
  });

  const removeFile=(file:any,module:string)=>{
    if (file) {
        fs.unlink(file.path, (unlinkError) => {
          if (unlinkError) {
            console.error(`Error deleting ${module} picture:`, unlinkError);
          }
        });
      }
      return;
  }
export  {userPictureUpload,groceryPictureUpload,removeFile};
