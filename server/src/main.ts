import { NestFactory } from '@nestjs/core';
import { PrismaService } from './prisma.service';
import { UserModule } from './user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const prismaService = app.get(PrismaService);
  app.enableCors({ origin: '*' });
  await prismaService.enableShutdownHooks(app);
  await app.listen(4000);
}
bootstrap();
