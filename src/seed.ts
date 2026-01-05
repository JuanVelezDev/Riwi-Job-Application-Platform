import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/entities/user.entity';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const adminEmail = 'admin@riwi.io';
    const gestorEmail = 'gestor@riwi.io';

    const admin = await usersService.findByEmail(adminEmail);
    if (!admin) {
        await usersService.create({
            name: 'Admin User',
            email: adminEmail,
            password: 'password123',
            role: UserRole.ADMIN,
        });
        console.log('Admin user created');
    } else {
        console.log('Admin user already exists');
    }

    const gestor = await usersService.findByEmail(gestorEmail);
    if (!gestor) {
        await usersService.create({
            name: 'Gestor User',
            email: gestorEmail,
            password: 'password123',
            role: UserRole.GESTOR,
        });
        console.log('Gestor user created');
    } else {
        console.log('Gestor user already exists');
    }

    await app.close();
}
bootstrap();
