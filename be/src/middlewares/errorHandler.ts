import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/httpError";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
    let status = 500;
    let code = "INTERNAL_SERVER_ERROR";
    let message = "Internal Server Error";

    if (err instanceof HttpError) {
        status = err.status;
        code = err.code;
        message = err.message;
    }

    res.status(status).json({
        success: false,
        error: {
            code,
            message,
        },
    });
}
