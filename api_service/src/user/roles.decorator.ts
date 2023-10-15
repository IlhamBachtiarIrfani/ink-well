import { SetMetadata } from '@nestjs/common';
import { AccessRole } from './roles.enum';

export const ROLES_KEY = 'ROLES';
export const Roles = (...roles: AccessRole[]) => SetMetadata(ROLES_KEY, roles);
