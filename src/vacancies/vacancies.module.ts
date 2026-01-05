import { Module } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vacancy])],
    controllers: [VacanciesController],
    providers: [VacanciesService],
    exports: [VacanciesService],
})
export class VacanciesModule { }
