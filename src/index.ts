import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import identifyRoutes from './routes/identify';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/identify', identifyRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
