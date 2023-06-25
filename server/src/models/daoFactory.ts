import { Env } from "../env";
import logger from "../logging/loggerFactory";
import DraftDao from "./dao/draft.dao";
import { DaoType } from "./daoType";
import DraftsDao from "./dao/drafts.dao";
import LocalDraftDao from "./storageImpl/local/draft.local.daoImpl";
import MemoryDraftDao from "./storageImpl/memory/draft.memory.daoImpl";
import LocalDraftsDao from "./storageImpl/local/drafts.local.daoImpl";
import MemoryDraftsDao from "./storageImpl/memory/drafts.memory.daoImpl";
import Draft from "./entity/draft.entity";

/**
 * Factory for creating a DraftDao in respect to the pre-set storage type.
 * If the storage type is "local", it initialize a {@link LocalStorageDao}, which save data to local file system.
 * If the storage type is "memory", it initialize a {@link MemoryDao}, which save data to memory.
 * 
 * To get the DAO instance, call {@link get}.
 * 
 * The DAO instance is kpet singleton, i.e. the class should be instantiated only once and not
 * be used outside this file except for testing.
 * @class
 * @property {DraftDao} _draft_dao the Draft DAO instance
 * @property {DraftsDao} _drafts_dao the Drafts DAO instance
 * 
 * @see DaoType
 */
class DaoFactory {
    //AF: object = _*_dao
    //RI: _*_dao is an instance of DraftDao or DraftsDao and is of type corresponding to the pre-set storage type
    private readonly _draft_dao: DraftDao;
    private readonly _drafts_dao: DraftsDao;
    private readonly memory_storage?: Map<string, Draft>;

    /**
     * Constructs a DaoFactory instance and initializes a DAO with a specific storage type.
     * 
     * @constructor
     */
    constructor() {
        logger.debug("Initializing file storage...");

        if (Env.STORAGE === DaoType.MEMORY) { 
            this.memory_storage = new Map<string, Draft>();
            this._draft_dao = new MemoryDraftDao(this.memory_storage);
            this._drafts_dao = new MemoryDraftsDao(this.memory_storage);
        }
        else {
            this._draft_dao = this.createDraftDao();
            this._drafts_dao = this.createDraftsDao();  
        }

        logger.debug("file storage all set :)");
    }

    /**
     * Gets the Draft DAO instance.
     * 
     * @returns {DraftDao} The DAO instance
     */
    public get draft(): DraftDao {
        return this._draft_dao;
    }

    /**
     * Gets the Drafts DAO instance.
     * 
     * @returns {DraftsDao} The DAO instance
     */
    public get drafts(): DraftsDao {
        return this._drafts_dao;
    }

    /**
     * Creates a DAO instance with repsect to the pre-set storage type.
     * If the storage type is "local", it initialize a {@link LocalStorageDao}, which save data to local file system.
     * If the storage type is "memory", it initialize a {@link MemoryDao}, which save data to memory.
     * @returns {DraftDao} The DAO instance
     */
    private createDraftDao(): DraftDao {
        switch (Env.STORAGE) {
            case DaoType.LOCAL:
                return new LocalDraftDao();
            default:
                throw new Error(`Unknown storage type: ${Env.STORAGE}`);
        } 
    }

    /**
     * Creates a DAO instance with repsect to the pre-set storage type.
     * If the storage type is "local", it initialize a {@link LocalStorageDao}, which save data to local file system.
     * If the storage type is "memory", it initialize a {@link MemoryDao}, which save data to memory.
     * @returns {DraftsDao} The DAO instance
     */
    private createDraftsDao(): DraftsDao { 
        switch (Env.STORAGE) {
            case DaoType.LOCAL:
                return new LocalDraftsDao();
            default:
                throw new Error(`Unknown storage type: ${Env.STORAGE}`);
        }
    }
}

const dao = new DaoFactory();
export default dao;