import dotenv from 'dotenv';
dotenv.config({
  override: true
});

import app from './src/app.js';

app.listen(process.env.PORT || 3000, () => {
  console.log('[EDGE] server is working on port 3000');
});
