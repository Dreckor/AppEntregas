import app from "./server.js"
import { connectdb } from "./db.js"
import { PORT } from "./config.js";

async function main() {
    try {
      await connectdb();
      app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
            console.log(`Entorno: ${process.env.NODE_ENV}`);
        });
      
      
    } catch (error) {
      console.error(error);
    }
  }
  
  main();
