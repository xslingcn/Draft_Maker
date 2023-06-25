import * as assert from 'assert';
import sinon from 'sinon';
import dao from '../../../../models/daoFactory';
import { clearDraftsTest, pushRandomDraft } from '../../helper/test.utils';
import { getDraftStatus, pickItem, removeDraft, shareDraft } from '../../../../services/draft.service';
import shareCodeMapping from '../../../../services/shareCodeMapping.service';

describe('services/draftService', function () {
    it('init success', () =>
        assert.notStrictEqual(dao.draft, undefined)
    );

    it('getDraftStatus success', async function () {
        const draft1 = await pushRandomDraft();

        const req1 = { draftId: draft1.uuid };
        const res1 = await getDraftStatus(req1);

        assert.deepStrictEqual(res1, {
            status: "success",
            message: "Draft Loaded",
            data: draft1
        });

        const draft2 = await pushRandomDraft();

        const req2 = { draftId: draft2.uuid };
        const res2 = await getDraftStatus(req2);

        assert.deepStrictEqual(res2, {
            status: "success",
            message: "Draft Loaded",
            data: draft2
        });
        clearDraftsTest();
    });

    it('getDraftStatus internal server error', async function () {
        const req1 = { draftId: "goodGetDraftStatus1" };

        const getStub1 = sinon.stub(dao.draft, 'get');
        getStub1.throws(new Error("internal server error"));

        const res1 = await getDraftStatus(req1);;

        assert.deepStrictEqual(res1, {
            status: "error",
            message: "internal server error"
        });
        getStub1.restore();

        const getStub2 = sinon.stub(dao.draft, 'get');
        getStub2.throws(new Error("it's ok, but not really"));

        const req2 = { draftId: "goodGetDraftStatus2" };
        const res2 = await getDraftStatus(req2);

        assert.deepStrictEqual(res2, {
            status: "error",
            message: "it's ok, but not really"
        });
        getStub2.restore();
        clearDraftsTest();
    });

    it('shareDraft success', async function () {
        const draft1 = await pushRandomDraft();
        const req1 = { draftId: draft1.uuid };
        const res1 = await shareDraft(req1); 
        const shareCode1 = shareCodeMapping.getId(draft1.uuid);
        assert.deepStrictEqual(res1, {
            status: "success",
            message: "Got the share code",
            data: { shareCode: shareCode1 }
        });

        const draft2 = await pushRandomDraft();
        const req2 = { draftId: draft2.uuid };
        const res2 = await shareDraft(req2);
        const shareCode2 = shareCodeMapping.getId(draft2.uuid);
        assert.deepStrictEqual(res2, {
            status: "success",
            message: "Got the share code",
            data: { shareCode: shareCode2 }
        });
        clearDraftsTest();
    });
    
    it('shareDraft internal server error', async function () { 
        const req1 = { draftId: "goodShareDraft1" };

        const addStub1 = sinon.stub(shareCodeMapping, 'add');
        addStub1.throws(new Error("internal server error"));

        const res1 = await shareDraft(req1);
        assert.deepStrictEqual(res1, {
            status: "error",
            message: "internal server error"
        });
        addStub1.restore();

        const addStub2 = sinon.stub(shareCodeMapping, 'add');
        addStub2.throws(new Error("it's ok, but not really"));

        const req2 = { draftId: "goodShareDraft2" };
        const res2 = await shareDraft(req2);
        assert.deepStrictEqual(res2, {
            status: "error",
            message: "it's ok, but not really"
        });
        addStub2.restore();
    });

    it('pickItem success', async function () {
        const draft1 = await pushRandomDraft();
        
        const req1 = { draftId: draft1.uuid, user: draft1.users[0], item: draft1.items[0] };
        const res1 = await pickItem(req1);
        assert.deepStrictEqual(res1, {
            status: "success",
            message: "Successfully picked item"
        });

        const draft2 = await pushRandomDraft();
        const req2 = { draftId: draft2.uuid, user: draft2.users[0], item: draft2.items[0] };
        const res2 = await pickItem(req2);
        assert.deepStrictEqual(res2, {
            status: "success",
            message: "Successfully picked item"
        });
        clearDraftsTest();
    });

    it('pickItem internal server error', async function () {
        const req1 = { draftId: "goodPickItem1", user: "user1", item: "item1" };

        const pickStub1 = sinon.stub(dao.draft, 'pick');
        pickStub1.throws(new Error("wahthappaned"));

        const res1 = await pickItem(req1);
        assert.deepStrictEqual(res1, {
            status: "error",
            message: "wahthappaned"
        });
        pickStub1.restore();

        const pickStub2 = sinon.stub(dao.draft, 'pick');
        pickStub2.throws(new Error("newError"));

        const req2 = { draftId: "goodPickItem2", user: "user2", item: "item2" };
        const res2 = await pickItem(req2);

        assert.deepStrictEqual(res2, {
            status: "error",
            message: "newError"
        });
        pickStub2.restore();
    });

    it('removeDraft success', async function () {
        const draft1 = await pushRandomDraft();
        const req1 = { draftId: draft1.uuid };
        const res1 = await removeDraft(req1);
        assert.deepStrictEqual(res1, {
            status: "success",
            message: "Draft removed"
        });

        const draft2 = await pushRandomDraft();
        const req2 = { draftId: draft2.uuid };
        const res2 = await removeDraft(req2);
        assert.deepStrictEqual(res2, {
            status: "success",
            message: "Draft removed"
        });

        clearDraftsTest();
    });

    it('removeDraft internal server error', async function () {
        const req1 = { draftId: "goodRemoveDraft1" };

        const removeStub1 = sinon.stub(dao.draft, 'remove');
        removeStub1.throws(new Error("smthbad:("));

        const res1 = await removeDraft(req1);
        assert.deepStrictEqual(res1, {
            status: "error",
            message: "smthbad:("
        });
        removeStub1.restore();

        const removeStub2 = sinon.stub(dao.draft, 'remove');
        removeStub2.throws(new Error("finefine"));

        const res2 = await removeDraft(req1);
        assert.deepStrictEqual(res2, {
            status: "error",
            message: "finefine"
        });
        removeStub2.restore();
    });
});