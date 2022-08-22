import { AppRequest } from 'interfaces/app-request';
import { NotAuthorizedException } from 'exceptions/not-authorized-exception';

export function RequireDeveloper(): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;

    descriptor.value = function (req: AppRequest, ...args: any) {
      if (!req.developer) {
        throw new NotAuthorizedException('Invalid company provided');
      }
      return original.call(this, req, ...args);
    }
  }
}
