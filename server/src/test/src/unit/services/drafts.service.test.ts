import * as assert from 'assert';
import sinon from 'sinon';
import dao from '../../../../models/daoFactory';
import { clearDraftsTest, pushRandomDraft, randomDraft } from '../../helper/test.utils';
import shareCodeMapping from '../../../../services/shareCodeMapping.service';
import { getDrafts, newDraft, joinDraft, clearDrafts } from '../../../../services/drafts.service';

describe('services/draftsService', function () {
    it('init success', () =>
        assert.notStrictEqual(dao.draft, undefined)
    );

    it('newDraft success', async function () {
        const draft1 = await randomDraft();

        const req1 = { name: draft1.name, items: draft1.items, rounds: draft1.rounds, users: draft1.users };
        clearDraftsTest();
        const res1 = await newDraft(req1);
        const draftResult1 = (await dao.drafts.getAll())[0];
        
        assert.deepStrictEqual(res1, {
            status: "success",
            message: "Draft added",
            data: {
                draftId: draftResult1.uuid,
            }
        });

        const draft2 = await randomDraft();

        const req2 = { name: draft2.name, items: draft2.items, rounds: draft2.rounds, users: draft2.users };
        clearDraftsTest();
        const res2 = await newDraft(req2);
        const draftResult2 = (await dao.drafts.getAll())[0];

        assert.deepStrictEqual(res2, {
            status: "success",
            message: "Draft added",
            data: {
                draftId: draftResult2.uuid,
            }
        });

        clearDraftsTest();
    });

    it('newDraft internal server error', async function () {
        const req1 = { name: "goodNewDraft1", items: [], rounds: 1, users: [] };

        const addStub1 = sinon.stub(dao.drafts, 'add');
        addStub1.throws(new Error("internal server error"));

        const res1 = await newDraft(req1);;

        assert.deepStrictEqual(res1, {
            status: "error",
            message: "internal server error"
        });
        addStub1.restore();

        const addStub2 = sinon.stub(dao.drafts, 'add');
        addStub2.throws(new Error("it's ok, but not really"));

        const req2 = { name: "goodNewDraft2", items: [], rounds: 1, users: [] };
        const res2 = await newDraft(req2);

        assert.deepStrictEqual(res2, {
            status: "error",
            message: "it's ok, but not really"
        });
        addStub2.restore();

        clearDraftsTest();
    });

    it('getDrafts success', async function () {
        const draft1 = await pushRandomDraft();
        const draft2 = await pushRandomDraft();

        const draftsData1 = [draft1, draft2].map(draft => ({ draftId: draft.uuid, name: draft.name }));

        const res1 = await getDrafts();
        assert.deepStrictEqual(res1, {
            status: "success",
            message: "Drafts loaded",
            data: draftsData1
        });

        const draft3 = await pushRandomDraft();
        const draftsData2 = [...draftsData1, { draftId: draft3.uuid, name: draft3.name }];
        
        const res2 = await getDrafts();
        assert.deepStrictEqual(res2, {
            status: "success",
            message: "Drafts loaded",
            data: draftsData2
        });

        clearDraftsTest();
    });

    it('getDrafts internal server error', async function () {
        const getAll = sinon.stub(dao.drafts, 'getAll');
        getAll.throws(new Error("internal server error"));

        const res1 = await getDrafts();
        assert.deepStrictEqual(res1, {
            status: "error",
            message: "internal server error"
        });
        getAll.restore();

        const getAllStub2 = sinon.stub(dao.drafts, 'getAll');
        getAllStub2.throws(new Error("yet another error"));

        const res2 = await getDrafts();
        assert.deepStrictEqual(res2, {
            status: "error",
            message: "yet another error"
        });
        getAllStub2.restore();
    });

    it('joinDraft success', async function () {
        const draft1 = await pushRandomDraft();
        const shareCode1 = shareCodeMapping.add(draft1.uuid);

        const req1 = { shareCode: shareCode1, user: "user1" };
        const res1 = await joinDraft(req1);
        assert.deepStrictEqual(res1, {
            status: "success",
            message: `Successfully joined the draft.\n Note: code ${shareCode1} is no longer valid!`,
            data: {
                draftId: draft1.uuid,
                canDraft: draft1.users.includes("user1")
            }
        });

        const draft2 = await pushRandomDraft();
        const shareCode2 = shareCodeMapping.add(draft2.uuid);

        const req2 = { shareCode: shareCode2, user: "user2" };
        const res2 = await joinDraft(req2);
        assert.deepStrictEqual(res2, {
            status: "success",
            message: `Successfully joined the draft.\n Note: code ${shareCode2} is no longer valid!`,
            data: {
                draftId: draft2.uuid,
                canDraft: draft2.users.includes("user2")
            }
        });

        clearDraftsTest();
    });

    it('joinDraft internal server error', async function () {
        const req1 = { shareCode: "goodJoinDraft1", user: "user1" };

        const getUuidStub1 = sinon.stub(shareCodeMapping, 'getUuid');
        getUuidStub1.throws(new Error("wahthappaned"));

        const res1 = await joinDraft(req1);
        assert.deepStrictEqual(res1, {
            status: "error",
            message: "wahthappaned"
        });
        getUuidStub1.restore();

        const req2 = { shareCode: "goodJoinDraft2", user: "user2" };

        const getUuidStub2 = sinon.stub(shareCodeMapping, 'getUuid');
        getUuidStub2.throws(new Error("new error asdasd"));

        const res2 = await joinDraft(req2);
        assert.deepStrictEqual(res2, {
            status: "error",
            message: "new error asdasd"
        });
        getUuidStub2.restore();
    });

    it('clearDrafts success', async function () {
        await pushRandomDraft();
        await pushRandomDraft();

        const res1 = await clearDrafts();
        assert.deepStrictEqual(res1, {
            status: "success",
            message: "Drafts cleared"
        });

        await pushRandomDraft();
        const res2 = await clearDrafts();
        assert.deepStrictEqual(res2, {
            status: "success",
            message: "Drafts cleared"
        });

        clearDraftsTest();
    });

    it('clearDrafts internal server error', async function () {
        const getAllStub1 = sinon.stub(dao.drafts, 'getAll');
        getAllStub1.throws(new Error("smthbad:("));

        const res1 = await clearDrafts();
        assert.deepStrictEqual(res1, {
            status: "error",
            message: "smthbad:("
        });
        getAllStub1.restore();

        const getAllStub2 = sinon.stub(dao.drafts, 'getAll');
        getAllStub2.throws(new Error("finefine"));

        const res2 = await clearDrafts();
        assert.deepStrictEqual(res2, {
            status: "error",
            message: "finefine"
        });
        getAllStub2.restore();
    });
});