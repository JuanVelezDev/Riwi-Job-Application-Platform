import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { User } from '../users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Application, Vacancy, User])],
    controllers: [ApplicationsController],
    providers: [ApplicationsService],
    exports: [ApplicationsService],
})
export class ApplicationsModule { }
