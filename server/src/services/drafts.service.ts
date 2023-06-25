import dao from '../models/daoFactory';
import logger from '../logging/loggerFactory';
import { ServiceResponse } from './serviceResponse';
import Draft from '../models/entity/draft.entity';
import { JoinDraftPostBody, NewDraftPostBody } from '../models/dto/drafts.dto';
import shareCodeMapping from './shareCodeMapping.service';
import FailRequestError from '../errors/fail.error';
import { parseErrorForResponse } from '../errors/error.utils';

(() => logger.debug("Initializing draftsService..."))();    // initializing


/**
 * Adds a new draft to the local storage.
 *
 * @param req the {@link NewDraftPostBody} with all the information to create a new draft.
 * @returns {Promise<ServiceResponse<{ draftId: string }>>} with the payload of the created draftId.
 * @see {@link parseErrorForResponse} 
 */
export const newDraft = async (req: NewDraftPostBody): Promise<ServiceResponse<{ draftId: string }>> => { 
    try {
        const draft = new Draft(req.name, req.items, req.rounds, req.users);
        await dao.drafts.add(draft);
        return { status: "success", message: `Draft added`, data: { draftId: draft.uuid } };
    } catch (err) {
        return parseErrorForResponse(err, `Unable to add draft`);
    }
}

/**
 * Gets all the drafts in the local storage.
 * 
 * @returns {Promise<ServiceResponse<{ draftId: string, name: string }[]>>} with the payload of all the drafts.
 */
export const getDrafts = async (): Promise<ServiceResponse<{ draftId: string, name: string }[]>> => { 
    try {
        const drafts = await dao.drafts.getAll();
        const draftsData = drafts.map(draft => ({ draftId: draft.uuid, name: draft.name }));
        return { status: "success", message: `Drafts loaded`, data: draftsData };
    } catch (err) {
        return parseErrorForResponse(err, `Unable to get drafts`);
    }
}

/**
 * Lets a user join a draft.
 * @param req the {@link JoinDraftPostBody} with the share code and user to join the draft.
 * @returns {Promise<ServiceResponse<{ draftId: string, canDraft: boolean }>>} with the payload of the draftId and 
 * whether the user can draft.
 */
export const joinDraft = async (req: JoinDraftPostBody): Promise<ServiceResponse<{ draftId: string, canDraft: boolean }>> => {
    try {
        const draftId = shareCodeMapping.getUuid(req.shareCode);
        if (!draftId)
            throw new FailRequestError(`Draft not found`);
        const canDraft = await dao.draft.join(draftId, req.user);
        shareCodeMapping.remove(draftId);
        return { status: "success", message: `Successfully joined the draft.\n Note: code ${req.shareCode} is no longer valid!`, data: { draftId: draftId, canDraft } };
    } catch (err) {
        return parseErrorForResponse(err, `Unable to join draft ${req.shareCode}`);
    }
}

/**
 * Clears all the drafts in the local storage.
 * @returns {Promise<ServiceResponse<void>>} with status and message.
 */
export const clearDrafts = async (): Promise<ServiceResponse<void>> => {
    try {
        await dao.drafts.getAll()
            .then(drafts => Promise.all(drafts.map(draft => dao.draft.remove(draft.uuid))));
        return { status: "success", message: `Drafts cleared` };
    } catch (err) {
        return parseErrorForResponse(err, `Unable to clear drafts`);
    }
}