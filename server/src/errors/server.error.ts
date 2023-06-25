/**
 * Error class for internal server errors, i.e. errors that are caused by server side issues.
 */
export default class InternalServerError extends Error {
    // AF: obj=this
    // RI: this.name = 'InternalServerError'
    constructor(message?: string) {
        super(message);
        this.name = 'InternalServerError';
    }
}