import Draft from "../entity/draft.entity";

/**
 * This interface defines all operations on single draft.
 * 
 * @interface
 */
export default interface DraftDao {
    /**
     * Removes the draft from the storage. If the draft does not exist, the storage is left unchanged.
     * @param draftId the id of the draft to be removed.
     * @modify this
     * @effects this is modified to not including the file.
     */
    remove(draftId: string): Promise<void>;
    
    /**
     * Gets the draft object from the storage.
     * @param draftId the id of the draft to be loaded.
     * @returns {Draft} the draft loaded from the storage.
     */
    get(draftId: string): Promise<Draft>;

    /**
     * Updates the draft object to the given draft.
     * @param draftId the id of the draft to be updated.
     * @param draft the draft to be updated.
     * @modify this
     * @effects this is modified to be the given draft.
     */
    update(draftId: string, draft: Draft): Promise<void>;

    /**
     * Lets the user join the draft.
     * @param draftId the id of the draft to be joined.
     * @param user the user that's to join the draft.
     * @returns {boolean} true if the user can pick in this draft, false otherwise.
     */
    join(draftId: string, user: string): Promise<boolean>;

    /**
     * Lets the user pick the item in the draft.
     * @param draftId the id of the draft to pick item from.
     * @param user the user that's to pick the item.
     * @param item the item that's to be picked.
     * @modify this
     * @effects the item is removed from the draft, and the draft is updated such that draft.picks include
     * the record of the pick. Also the currUser and currRound are pushed by 1.
     * @returns {Draft} the draft after the item is picked.
     * @see {@link Draft}
     */
    pick(draftId: string, user: string, item: string): Promise<Draft>;
}