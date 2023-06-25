import DraftsDao from '../../dao/drafts.dao';
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
export default class LocalDraftsDao implements DraftsDao {
    add(draft: Draft): Promise<void> {
        throw new Error(`Method not implemented. ${draft}`);
    }
    getAll(): Promise<Draft[]> {
        throw new Error('Method not implemented.');
    }
}

