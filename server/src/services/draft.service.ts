import { PickItemParams, DraftIdURLParams } from '../models/dto/draft.dto';
import dao from '../models/daoFactory';
import logger from '../logging/loggerFactory';
import { ServiceResponse } from './serviceResponse';
import Draft from '../models/entity/draft.entity';
import shareCodeMapping from './shareCodeMapping.service';
import { parseErrorForResponse } from '../errors/error.utils';

(() => logger.debug("Initializing draftService..."))();    // initializing

/**
 * Gets the status of a draft.
 *
 * @param req the {@link DraftIdURLParams} with the draftId to get the status of.
 * @returns {Promise<ServiceResponse<Draft>>} with wanted payload of a draft object.
 * @see {@link parseErrorForResponse} 
 */
export const getDraftStatus = async (req: DraftIdURLParams): Promise<ServiceResponse<Draft>> => {
    try {
        const draft = await dao.draft.get(req.draftId);
        return { status: "success", message: `Draft Loaded`, data: draft };
    } catch (err) {
        return parseErrorForResponse(err, `Unable to get the status of ${req.draftId}`);
    }
}

/**
 * Gets the share code of a draft.
 * 
 * @param req the {@link DraftIdURLParams} with the draftId to get the share code of. 
 * @returns {Promise<ServiceResponse<{ shareCode: string }>>} with payload of 
 * the generated or gotten share code.
 * @see {@link parseErrorForResponse}
 */
export const shareDraft = async (req: DraftIdURLParams): Promise<ServiceResponse<{ shareCode: string }>> => {
    try {
        const code = shareCodeMapping.add(req.draftId);
        return { status: "success", message: "Got the share code", data: { shareCode: code } };
    } catch (err) {
        return parseErrorForResponse(err, `Unable to create share code for ${req.draftId}`);
    }
}

/**
 * Picks an item in a draft.
 * @param req the {@link PickItemParams} with the draftId, user, and item to pick.
 * @returns {Promise<ServiceResponse<void>>} with status and message.
 * @see {@link parseErrorForResponse}
 */
export const pickItem = async (req: PickItemParams): Promise<ServiceResponse<void>> => {
    try {
        await dao.draft.pick(req.draftId, req.user, req.item);
        return { status: "success", message: `Successfully picked item` };
    } catch (err) {
        return parseErrorForResponse(err, `Unable to pick ${req.item} in draft ${req.draftId} for ${req.user}`);
    }
}

/**
 * Removes a draft from local storage.
 * @param req the {@link DraftIdURLParams} with the draftId to remove.
 * @returns {Promise<ServiceResponse<void>>} with status and message.
 * @see {@link parseErrorForResponse}
 */
export const removeDraft = async (req: DraftIdURLParams): Promise<ServiceResponse<void>> => {
    try {
        await dao.draft.remove(req.draftId);
        shareCodeMapping.remove(req.draftId);
        return { status: "success", message: `Draft removed` };
    } catch (err) {
        return parseErrorForResponse(err, `Unable to remove ${req.draftId}`);
    }
}