import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs/promises';
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

const compressImages = async (req, res, next) => {
    try {
        // Procesa cada campo de imagen (evidencePhoto y clientSignature)
        for (const field of ['evidencePhoto', 'clientSignature']) {
            if (req.files && req.files[field]) {
                const file = req.files[field][0];
                
                // Define el camino del archivo comprimido
                const compressedFilePath = path.join('uploads', `compressed-${file.filename}`);
                
                // Comprime la imagen usando sharp
                await sharp(file.path)
                    .resize(800) // Redimensiona si es necesario
                    .jpeg({ quality: 70 }) // Ajusta el formato y calidad
                    .toFile(compressedFilePath);
                
                // Elimina el archivo original sin comprimir
                await fs.unlink(file.path);
                
                // Actualiza el objeto `req.files` con el nuevo archivo comprimido
                req.files[field][0].path = compressedFilePath;
                req.files[field][0].filename = `compressed-${file.filename}`;
            }
        }

        next();
    } catch (error) {
        console.error('Error al comprimir la imagen:', error);
        res.status(500).json({ error: 'Error al procesar las imágenes' });
    }
};

export {compressImages, upload};
