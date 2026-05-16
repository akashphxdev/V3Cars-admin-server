import app from '@/app';
import env from '@/config/env';
import prisma from '@/config/db';

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
      console.log(`Health check: http://localhost:${env.PORT}/health`);
      console.log(`Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();