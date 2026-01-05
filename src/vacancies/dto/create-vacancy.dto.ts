import { IsEnum, IsInt, IsNotEmpty, IsPositive, IsString, Min } from 'class-validator';
import { VacancyModality } from '../entities/vacancy.entity';

export class CreateVacancyDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    technologies: string;

    @IsString()
    @IsNotEmpty()
    seniority: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsEnum(VacancyModality)
    modality: VacancyModality;

    @IsString()
    @IsNotEmpty()
    salaryRange: string;

    @IsString()
    @IsNotEmpty()
    company: string;

    @IsInt()
    @Min(1)
    @IsPositive()
    maxApplicants: number;
}
