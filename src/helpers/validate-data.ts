import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { BadRequestException } from 'exceptions/bad-request-exception';

export async function validateData<T extends object>(type: ClassConstructor<T>, data: unknown): Promise<T> {
  const result = plainToClass(type, data, { enableImplicitConversion: true });
  const validationErrors = await validate(result);

  if (validationErrors.length) {
    throw new BadRequestException(validationErrors.join(' '))
  }
  return result;
}

