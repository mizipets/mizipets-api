import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

export const OnlyRoles = (...roles: string[]) => {
    return applyDecorators(
        UseGuards(JwtAuthGuard),
        SetMetadata('roles', roles),
        UseGuards(RolesGuard)
    );
};
