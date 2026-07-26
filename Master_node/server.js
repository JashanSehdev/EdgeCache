import dotenv from 'dotenv'
import app from './src/app.js';

dotenv.config();

app.listen(process.env.PORT || 3001, () => {
  console.log(`[Master] server is working on port ${process.env.PORT || 3001}`);
});
