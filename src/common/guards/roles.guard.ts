import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
  const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
  
  const { user } = context.switchToHttp().getRequest();

  console.log('🔐 Required Roles:', requiredRoles);
  console.log('👤 User from JWT:', user);

  if (!requiredRoles) {
    return true; // no role restriction
  }

  if (!user || !user.role) {
    console.warn('⚠️ No user or role in request');
    return false;
  }

  const hasAccess = requiredRoles.includes(user.role);
  console.log(`✅ Access ${hasAccess ? 'GRANTED' : 'DENIED'} for role: ${user.role}`);
  
  return hasAccess;
}

}
