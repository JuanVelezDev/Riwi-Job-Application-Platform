import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { VacancyStatus } from './entities/vacancy.entity';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

@ApiTags('vacancies')
@Controller('vacancies')
export class VacanciesController {
    constructor(private readonly vacanciesService: VacanciesService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.GESTOR, UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create vacancy (Gestor/Admin)' })
    create(@Body() createVacancyDto: CreateVacancyDto) {
        return this.vacanciesService.create(createVacancyDto);
    }

    @Get()
    @ApiOperation({ summary: 'List active vacancies (Public)' })
    findAll(
        @Query('search') search?: string,
        @Query('seniority') seniority?: string,
    ) {
        return this.vacanciesService.findAll(search, seniority);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get vacancy details' })
    findOne(@Param('id') id: string) {
        return this.vacanciesService.findOne(id);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.GESTOR, UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update vacancy status (Gestor/Admin)' })
    updateStatus(@Param('id') id: string, @Body('status') status: VacancyStatus) {
        return this.vacanciesService.updateStatus(id, status);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.GESTOR, UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update vacancy details (Gestor/Admin)' })
    update(@Param('id') id: string, @Body() updateVacancyDto: UpdateVacancyDto) {
        return this.vacanciesService.update(id, updateVacancyDto);
    }
}
