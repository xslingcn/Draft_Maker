import FailRequestError from "../../../errors/fail.error";
import logger from "../../../logging/loggerFactory";
import DraftDao from "../../dao/draft.dao";
import Draft from "../../entity/draft.entity";

/**
 * This class provides Draft operations defined by {@link DraftDao} on memory.
 *
 * @class
 * @implements {DraftDao}
 * @see {@link DraftDao}
 */
export default class MemoryDraftDao implements DraftDao {
    private _drafts: Map<string, Draft>;

    constructor(storage: Map<string, Draft>) {
        this._drafts = storage;
    }

    /**
     * Removes the draft from the storage.
     * @param draftId the id of the draft to be removed.
     * @modify this
     * @effects this is modified to not including the draft.
     */
    async remove(draftId: string): Promise<void> {
        this._drafts.delete(draftId);
    }

    /**
     * Gets the draft object from the storage.
     * @param draftId the id of the draft to be loaded.
     * @returns {Draft} the draft loaded from the storage.
     */
    async get(draftId: string): Promise<Draft> {
        const draft = this._drafts.get(draftId);
        if (!draft) { 
            logger.info(`Draft ${draftId} not found`);
            throw new FailRequestError(`Draft ${draftId} not found`);
        }
        return draft;
    }

    /**
     * Updates the draft object to the given draft.
     * @param draftId the id of the draft to be updated.
     * @param draft the draft to be updated with.
     * @modify this
     * @effects this is modified to be the given draft.
     */
    async update(draftId: string, draft: Draft): Promise<void> {
        this._drafts.set(draftId, draft);
    }

    /**
     * Lets the user join the draft.
     * @param draftId the id of the draft to be joined.
     * @param user the user that's to join the draft.
     * @returns {boolean} true if the user can pick in this draft, false otherwise.
     */
    async join(draftId: string, user: string): Promise<boolean> {
        const draft = await this.get(draftId);
        return draft.join(user);
    }

    /**
     * Lets the user pick the item in the draft.
     * @param draftId the id of the draft to pick item from.
     * @param user the user that's to pick the item.
     * @param item the item that's to be picked.
     * @modify this
     * @effects the item is removed from the draft, and the draft is updated such that draft.picks include
     * @returns {Draft} the draft after the item is picked.
     */
    async pick(draftId: string, user: string, item: string): Promise<Draft> {
        const draft = await this.get(draftId);
        draft.pick(user, item);
        return draft;
    }
}