import assert from "assert";
import dao from "../../../../models/daoFactory";
import { Env } from "../../../../env";
import { DaoType } from "../../../../models/daoType";
import LocalDraftDao from "../../../../models/storageImpl/local/draft.local.daoImpl";
import LocalDraftsDao from "../../../../models/storageImpl/local/drafts.local.daoImpl";
import MemoryDraftDao from "../../../../models/storageImpl/memory/draft.memory.daoImpl";
import MemoryDraftsDao from "../../../../models/storageImpl/memory/drafts.memory.daoImpl";

describe('models/daoFactory', function () {
    it('DAO exists', function () {
        assert.notStrictEqual(dao, undefined);
    });

    it('DAO type correct', function () {
        switch (Env.STORAGE) { 
            case DaoType.LOCAL:
                assert.strictEqual((dao.draft instanceof LocalDraftDao), true);
                assert.strictEqual((dao.drafts instanceof LocalDraftsDao), true);
                break;
            case DaoType.MEMORY:
                assert.strictEqual((dao.draft instanceof MemoryDraftDao), true);
                assert.strictEqual((dao.drafts instanceof MemoryDraftsDao), true);
                break;
            default:
                throw new Error(`Unknown storage type: ${Env.STORAGE}`);
        }
    });
});