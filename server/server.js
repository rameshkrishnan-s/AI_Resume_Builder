import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';


const app = express();
const PORT = process.env.PORT || 3000;

// Database Connection
await connectDB();

app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://ai-resume-builder-2ii5.onrender.com'
  ],
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Server is live");
});


app.use('/api/users',userRouter)
app.use('/api/resumes',resumeRouter)
app.use('/api/ai/',aiRouter)
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
