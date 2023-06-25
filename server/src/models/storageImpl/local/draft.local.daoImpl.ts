import DraftDao from '../../dao/draft.dao';
import Draft from '../../entity/draft.entity';

/**
 * This class provides file IO operations defined by {@link DraftDao} on local file system.
 * A directory for storage is created upon construction if not exists. The storage path
 * is by {@link Env.STORAGE_DIR}
 *
 * @class
 * @property {string} storageDir the directory to store files.
 * @see DraftDao
 */
export default class LocalDraftDao implements DraftDao {
    remove(draftId: string): Promise<void> {
        throw new Error(`Method not implemented. ${draftId}`);
    }
    get(draftId: string): Promise<Draft> {
        throw new Error(`Method not implemented. ${draftId}`);
    }
    update(draftId: string, draft: Draft): Promise<void> {
        throw new Error(`Method not implemented. ${draftId} ${draft}`);
    }
    join(draftId: string, user: string): Promise<boolean> {
        throw new Error(`Method not implemented. ${draftId} ${user}`);
    }
    pick(draftId: string, user: string, item: string): Promise<Draft> {
        throw new Error(`Method not implemented. ${draftId} ${user} ${item}`);
    }
}

