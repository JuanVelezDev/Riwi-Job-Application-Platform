import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('applications')
@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) { }

    @Post()
    @Roles(UserRole.CODER)
    @ApiOperation({ summary: 'Apply to a vacancy (Coder)' })
    create(@Request() req, @Body() createApplicationDto: CreateApplicationDto) {
        return this.applicationsService.create(req.user.id, createApplicationDto);
    }

    @Get('my')
    @Roles(UserRole.CODER)
    @ApiOperation({ summary: 'List my applications (Coder)' })
    findMyApplications(@Request() req) {
        return this.applicationsService.findAllByUser(req.user.id);
    }

    @Get('vacancy/:id')
    @Roles(UserRole.GESTOR, UserRole.ADMIN)
    @ApiOperation({ summary: 'List applicants for a vacancy (Gestor/Admin)' })
    findByVacancy(@Param('id') id: string) {
        return this.applicationsService.findAllByVacancy(id);
    }
}
