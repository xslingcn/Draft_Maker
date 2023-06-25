/**
 * Response from service representing a successful operation.
 */
interface SuccessResponse<T> {
    status: "success";
    message: string;
    data?: T;
}

/**
 * Response from service representing a failed operation.
 * 
 * An operations fails when the request is valid, but has no permission, wrong state, etc.
 */
interface FailResponse {
    status: "fail";
    message: string;
}

/**
 * Response from service representing an internal server error.
 */
interface ErrorResponse {
    status: "error";
    message: string;
}

export type ServiceResponse<T> = SuccessResponse<T> | FailResponse | ErrorResponse;