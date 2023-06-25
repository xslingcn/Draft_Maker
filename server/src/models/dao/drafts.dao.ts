import Draft from "../entity/draft.entity";

/**
 * This interface defines all operations on the list of drafts.
 * 
 * @interface
 */
export default interface DraftsDao {
    /**
     * Adds the draft to the storage.
     * @param draft the draft to be added.
     * @modify this
     * @effects this is modified to include the draft.
     */
    add(draft: Draft): Promise<void>;

    /**
     * Gets the list of all drafts.
     * @returns {Draft[]} the list of all drafts.
     */
    getAll(): Promise<Draft[]>;
    
}