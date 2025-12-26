export class HttpError extends Error {
    status: number;
    code: string;

    constructor({ status, code, message }: { status: number; code: string; message: string }) {
        super(message);
        this.status = status;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }
}
