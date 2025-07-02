
import dotenv from 'dotenv';
import app from './app';

dotenv.config(); 
const PORT = process.env.PORT || 5000; 

//Start server
app.listen(PORT,()=>{
    console.log(`🚀 Server running on http://localhost:${PORT}`);
})

// import dotenv from 'dotenv';
// import app from './app';
// import { redisClient } from './emails/redisClient'; 

// dotenv.config(); 
// const PORT = process.env.PORT || 5000; 

// async function startServer() {
//   try {
//     // Connect to Redis before starting the server
//     await redisClient.connect();
//     console.log("✅ Redis connected");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ Failed to start server:", err);
//     process.exit(1);
//   }
// }

// startServer();
