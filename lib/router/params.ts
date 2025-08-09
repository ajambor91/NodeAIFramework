import 'reflect-metadata';
import { Validator } from '../validation/validators';

/**
 * @decorator Body
 * @description A parameter decorator that marks a parameter as the request body.
 * @returns {ParameterDecorator}
 */
export const Body = (): ParameterDecorator => {
  return (target, propertyKey, parameterIndex) => {
    if (!Reflect.hasMetadata('body', target.constructor, propertyKey as string)) {
      Reflect.defineMetadata('body', [], target.constructor, propertyKey as string);
    }

    const bodyParams = Reflect.getMetadata('body', target.constructor, propertyKey as string);
    bodyParams.push(parameterIndex);
  };
};

/**
 * @decorator Valid
 * @description A parameter decorator that marks a parameter to be validated.
 * @param {new () => Validator} validator - The validator to use.
 * @returns {ParameterDecorator}
 */
export const Valid = (validator: new () => Validator): ParameterDecorator => {
  return (target, propertyKey, parameterIndex) => {
    if (!Reflect.hasMetadata('validators', target.constructor, propertyKey as string)) {
      Reflect.defineMetadata('validators', [], target.constructor, propertyKey as string);
    }

    const validators = Reflect.getMetadata('validators', target.constructor, propertyKey as string);
    validators.push({ index: parameterIndex, validator });
  };
};

/**
 * @decorator PathParam
 * @description A parameter decorator that marks a parameter as a path parameter.
 * @param {string} name - The name of the path parameter.
 * @returns {ParameterDecorator}
 */
export const PathParam = (name: string): ParameterDecorator => {
  return (target, propertyKey, parameterIndex) => {
    if (!Reflect.hasMetadata('pathParams', target.constructor, propertyKey as string)) {
      Reflect.defineMetadata('pathParams', [], target.constructor, propertyKey as string);
    }

    const pathParams = Reflect.getMetadata('pathParams', target.constructor, propertyKey as string);
    pathParams.push({ index: parameterIndex, name });
  };
};

/**
 * @decorator QueryParams
 * @description A parameter decorator that marks a parameter as the query parameters.
 * @returns {ParameterDecorator}
 */
export const QueryParams = (): ParameterDecorator => {
  return (target, propertyKey, parameterIndex) => {
    if (!Reflect.hasMetadata('queryParams', target.constructor, propertyKey as string)) {
      Reflect.defineMetadata('queryParams', [], target.constructor, propertyKey as string);
    }

    const queryParams = Reflect.getMetadata('queryParams', target.constructor, propertyKey as string);
    queryParams.push(parameterIndex);
  };
};