import dotenv from 'dotenv';
dotenv.config();

import { app } from './interface/http/app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`☕ Valkia Coffee API corriendo en http://localhost:${PORT}`);
  console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Frontend autorizado: ${process.env.FRONTEND_URL || 'https://valkia-coffee.vercel.app'}`);
});
