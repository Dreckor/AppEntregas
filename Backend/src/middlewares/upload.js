import multer from 'multer';
import path from 'path';

// Configure storage for the files
const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define the uploads directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure Multer to accept both evidencePhoto and clientSignature
const upload = multer({ storage: storage }).fields([
    { name: 'evidencePhoto', maxCount: 1 },
    { name: 'clientSignature', maxCount: 1 }
]);

export default upload;
