import app from "./server.js"
import { connectdb } from "./db.js"
const PORT = 3000
async function main() {
    try {
      await connectdb();
      app.listen(PORT);
      console.log(`Listening on port http://localhost:${PORT}`);
      //console.log(`Environment: ${process.env.NODE_ENV}`)
    } catch (error) {
      console.error(error);
    }
  }
  
  main();