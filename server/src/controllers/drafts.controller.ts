import { Request, Response } from "express";
import logger from "../logging/loggerFactory";
import * as dto from "../models/dto/drafts.dto";
import * as service from "../services/drafts.service"
import { ServiceResponse } from "../services/serviceResponse";

(() => { logger.debug("Initializing fileIOController..."); })();    // initializing

/**
 * Controller to handle requests to add a new draft
 * It takes and validates the body of the request against {@link dto.newDraftPostBodySchema},
 * If it's a bad request, sends a 400 Bad Request response. 
 * Otherwise, saves the file to local and sends a 200 OK response.
 * If internal error occurs, sends a 500 Internal Server Error response.
 * 
 * @param req HTTP request from the client. 
 * The URL params should be an object that matches the `NewDraftPostBody` schema.
 * @param res HTTP response that will be sent back to the client. Status could be 400, 500, or 200. 
 */
export async function newDraft(req: Request, res: Response) {
    logger.info("En Route new...");
    logger.debug(`POST Body: ${JSON.stringify(req.body)}`);
    const { error, value } = dto.newDraftPostBodySchema.validate(req.body);
    if (error) {
        logger.info(`Bad Request: "${error}"`)
        res.status(400).json({
            status: "fail",
            message: `Bad request: ${error.message}`
        });
        return;
    }

    const reqBody = value as dto.NewDraftPostBody;

    sendResponse(res, await service.newDraft(reqBody));
}


/**
 * Controller to handle requests to get the list of drafts.
 * Lists all drafts in local storage and sends a 200 OK response with the list.
 * If internal error occurs, sends a 500 Internal Server Error response.
 * 
 * @param req HTTP request from the client. 
 * @param res HTTP response that will be sent back to the client. Status could be 400, 500, or 200. 
 */
export async function getDrafts(_: Request, res: Response) { 
    logger.info("En Route list...");
    sendResponse(res, await service.getDrafts());
}

/**
 * Controller to handle requests to clear all drafts.
 * Clears all drafts in local storage and sends a 200 OK response upon success.
 * If internal error occurs, sends a 500 Internal Server Error response.
 * 
 * @param _ HTTP request from the client. Not used in process.
 * @param res HTTP response that will be sent back to the client. Status could be 500 or 200. 
 */
export async function clearDrafts(_: Request, res: Response) { 
    logger.info("En Route clear...");
    sendResponse(res, await service.clearDrafts());
}

export async function joinDraft(req: Request, res: Response) {
    logger.info("En Route join...");
    logger.debug(`POST Body: ${JSON.stringify(req.body)}`);
    const { error, value } = dto.joinDraftPostBodySchema.validate(req.body);
    if (error) {
        logger.info(`Bad Request: "${error}"`)
        res.status(400).json({
            status: "fail",
            message: `Bad request: ${error.message}`
        });
        return;
    }

    const reqBody = value as dto.JoinDraftPostBody;

    sendResponse(res, await service.joinDraft(reqBody));
}

/**
 * Helper function to send an HTTP response based on the status of a service operation.
 * This function takes a {@link Response} and sets it to corresponding status code
 * based on the status of the given {@link ServiceResponse} object.
 * 
 * @param res HTTP response that will be sent back to the client. 
 * @param result {@link ServiceResponse} object, containing the status and potentially other data from a service 
 * operation. The status can be "success", "fail", or "error", leading to HTTP statuses 200, 400, or 500 respectively.
 * @see ServiceResponse
 */
function sendResponse(res: Response, result: ServiceResponse<any>) {
    switch (result.status) {
        case "success":
            res.status(200).json(result);
            break;
        case "fail":
            res.status(400).json(result);
            break;
        case "error":
            res.status(500).json(result);
            break;
    }
}