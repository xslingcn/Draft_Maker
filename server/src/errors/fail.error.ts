/**
 * Error class for failed requests, i.e. requests failed due to invalid input.
 */
export default class FailRequestError extends Error {
    // AF: obj=this
    // RI: this.name = 'FailRequestError'
    constructor(message?: string) {
        super(message);
        this.name = 'FailRequestError';
    }
}