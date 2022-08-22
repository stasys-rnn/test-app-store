import { NotAuthorizedException } from 'exceptions/not-authorized-exception';
import { AppRequest } from 'interfaces/app-request';
import 'reflect-metadata';

export function RequireUser(): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value!;

    descriptor.value = function(req: AppRequest, ...args: any) {
      if (!req.user) {
        throw new NotAuthorizedException('Invalid user provided');
      }
      return original.call(this, req, ...args);
    }
  }
}
