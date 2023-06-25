import { Request, Response } from "express";
import logger from "../logging/loggerFactory";
import * as dto from "../models/dto/draft.dto";
import * as service from "../services/draft.service";
import { ServiceResponse } from "../services/serviceResponse";

/**
 * Controller to handle requests to get the status of a draft.
 * It takes and validates the URL param against {@link dto.draftIdURLParamsSchema}. 
 * If it's a bad request, sends a 400 Bad Request response. 
 * Otherwise, saves the file to local and sends a 200 OK response.
 * If internal error occurs, sends a 500 Internal Server Error response.
 * 
 * @param req HTTP request from the client. 
 * The URL params should be an object that matches the `DraftIdURLParams` schema.
 * @param res HTTP response that will be sent back to the client. Status could be 400, 500, or 200. 
 */
export async function getDraftStatus(req: Request, res: Response) {
    logger.info("En Route status...");
    logger.debug(`GET Params: ${JSON.stringify(req.params)}`);
    const { error, value } = dto.draftIdURLParamsSchema.validate(req.params);
    if (error) {
        logger.info(`Bad Request: "${error}"`)
        res.status(400).json({
            status: "fail",
            message: `Bad request: ${error.message}`
        });
        return;
    }

    const param = value as dto.DraftIdURLParams;

    sendResponse(res, await service.getDraftStatus(param));
}

/**
 * Controller to handle requests to get or generate the share ID of a draft.
 * It takes and validates the URL param against {@link dto.draftIdURLParamsSchema}. 
 * If it's a bad request, sends a 400 Bad Request response. 
 * Otherwise, saves the file to local and sends a 200 OK response.
 * If internal error occurs, sends a 500 Internal Server Error response.
 * 
 * @param req HTTP request from the client. 
 * The URL params should be an object that matches the `DraftIdURLParams` schema.
 * @param res HTTP response that will be sent back to the client. Status could be 400, 500, or 200. 
 */
export async function getDraftShareId(req: Request, res: Response) { 
    logger.info("En Route share...");
    logger.debug(`GET Params: ${JSON.stringify(req.params)}`);
    const { error, value } = dto.draftIdURLParamsSchema.validate(req.params);
    if (error) {
        logger.info(`Bad Request: "${error}"`)
        res.status(400).json({
            status: "fail",
            message: `Bad request: ${error.message}`
        });
        return;
    }

    const param = value as dto.DraftIdURLParams;

    sendResponse(res, await service.shareDraft(param));
}

/**
 * Controller to handle requests to pick an item.
 * It takes and validates the URL param against {@link dto.draftIdURLParamsSchema},
 * and the body of the request against {@link dto.pickItemPostBodySchema}.
 * If it's a bad request, sends a 400 Bad Request response. 
 * Otherwise, saves the file to local and sends a 200 OK response.
 * If internal error occurs, sends a 500 Internal Server Error response.
 * 
 * @param req HTTP request from the client. 
 * The URL params should be an object that matches the `DraftIdURLParams` schema.
 * The body of the request should be an object that matches the `PickItemParams` schema.
 * @param res HTTP response that will be sent back to the client. Status could be 400, 500, or 200. 
 */
export async function pickItem(req: Request, res: Response) {
    logger.info("En Route pick...");
    logger.debug(`POST Body: ${JSON.stringify(req.body)}`);
    const { error: error, value: value } = dto.draftIdURLParamsSchema.validate(req.params);
    if (error) {
        logger.info(`Bad Request: "${error}"`)
        res.status(400).json({
            status: "fail",
            message: `Bad request: ${error.message}`
        });
        return;
    }

    const { error: error2, value: value2 } = dto.pickItemPostBodySchema.validate(req.body);
    if (error2) {
        logger.info(`Bad Request: "${error2}"`)
        res.status(400).json({
            status: "fail",
            message: `Bad request: ${error2.message}`
        });
        return;
    }

    const param = { ...value, ...value2 } as dto.PickItemParams;

    sendResponse(res, await service.pickItem(param));
}
 
/**
 * Controller to handle requests to remove a draft from storage.
 * It takes and validates the URL param against {@link dto.draftIdURLParamsSchema},
 * If it's a bad request, sends a 400 Bad Request response. 
 * Otherwise, saves the file to local and sends a 200 OK response.
 * If internal error occurs, sends a 500 Internal Server Error response.
 * 
 * @param req HTTP request from the client. 
 * The URL params should be an object that matches the `DraftIdURLParams` schema.
 * @param res HTTP response that will be sent back to the client. Status could be 400, 500, or 200. 
 */
export async function removeDraft(req: Request, res: Response) {
    logger.info("En Route remove...");
    logger.debug(`GET Params: ${JSON.stringify(req.params)}`);
    const { error, value } = dto.draftIdURLParamsSchema.validate(req.params);
    if (error) {
        logger.info(`Bad Request: ${error}`)
        res.status(400).json({
            status: "fail",
            message: `Bad request: ${error.message}`
        });
        return;
    }

    const param = value as dto.DraftIdURLParams;

    sendResponse(res, await service.removeDraft(param));
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