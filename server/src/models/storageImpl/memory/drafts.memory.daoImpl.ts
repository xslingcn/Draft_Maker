import DraftsDao from "../../dao/drafts.dao";
import Draft from "../../entity/draft.entity";

/**
 * This class provides operations on all Drafts defined by {@link DraftsDao} on memory.
 *
 * @class
 * @implements {DraftsDao}
 * @see {@link DraftsDao}
 */
export default class MemoryDraftsDao implements DraftsDao {
    private _drafts: Map<string, Draft>;

    constructor(storage: Map<string, Draft>) { 
        this._drafts = storage;
    }

    /**
     * Adds the draft to the storage.
     * @param draft the draft to be added.
     * @modify this
     * @effects this is modified to include the draft.
     */
    async add(draft: Draft): Promise<void> {
       this._drafts.set(draft.uuid, draft);
    }

    /**
     * Gets the list of all drafts.
     * @returns {Draft[]} the list of all drafts.
     */
    async getAll(): Promise<Draft[]> {
        return Array.from(this._drafts.values());
    }
}