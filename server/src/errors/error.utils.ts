import { ServiceResponse } from "../services/serviceResponse";

/**
 * Parse and match the error to the appropriate response.
 * @param err the error to parse
 * @param fallbackMsg the message to send if the error is not recognized
 * @returns {ServiceResponse} the response to send back to the client
 */
export const parseErrorForResponse = (err: any, fallbackMsg: string): ServiceResponse<any> => {
    if (err.name === "FailRequestError") {
        return { status: "fail", message: err.message };
    }
    if (err.name === "InternalServerError") {
        return { status: "error", message: err.message };
    }
    if (err instanceof Error) { 
        return { status: "error", message: err.message };
    }
    return { status: "error", message: fallbackMsg };
}