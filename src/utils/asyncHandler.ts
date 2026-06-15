import { NextFunction, Request, Response } from 'express';

type Controller = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (controller: Controller) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    controller(req, res, next).catch(next);
  };
};
