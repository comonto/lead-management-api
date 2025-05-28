import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

export function validationMiddleware<T>(type: new () => T, skipMissingProperties = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToClass(type, req.body);

    validate(dtoInstance as object, { skipMissingProperties, forbidUnknownValues: true })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const errorMessages = errors.map(error => {
            return Object.values(error.constraints || {});
          }).flat();
          return res.status(400).json({
            message: 'Errore di validazione dei dati.',
            errors: errorMessages
          });
        } else {
          req.body = dtoInstance;
          next();
        }
      })
      .catch(err => {
        console.error("Errore nel middleware di validazione:", err);
        next(err);
      });
  };
}