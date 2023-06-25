import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import sinon from 'sinon';
import { Env } from '../../../../env';
Env.TEST = true;    // workaround for local env
import dao from '../../../../models/daoFactory';
import shareCodeMapping from '../../../../services/shareCodeMapping.service';
import { clearDraftsTest, pushRandomDraft, randomDraft } from '../../helper/test.utils';
import { getDrafts, joinDraft, newDraft, clearDrafts } from '../../../../controllers/drafts.controller';

describe('controllers/darfts', function () {
    it('init success', () =>
        assert.notStrictEqual(dao.drafts, undefined)
    );

    it('newDraft success', async function () {
        const draft1 = await randomDraft();

        const req1 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/drafts/new`,
            body: {
                name: draft1.name,
                items: draft1.items,
                users: draft1.users,
                rounds: draft1.rounds
            }
        });
        const res1 = httpMocks.createResponse();

        await newDraft(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 200);

        const draft2 = await randomDraft();

        const req2 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/drafts/new`,
            body: {
                name: draft2.name,
                items: draft2.items,
                users: draft2.users,
                rounds: draft2.rounds
            }
        });
        const res2 = httpMocks.createResponse();

        await newDraft(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 200);

        clearDraftsTest();
    });

    it('newDraft bad request', async function () {
        const req1 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/drafts/new`,
            body: {
                name: "test",
            }
        });
        const res1 = httpMocks.createResponse();

        await newDraft(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "fail",
            message: `Bad request: "items" is required`
        });

        const req2 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/drafts/new`,
            body: {
                items: ["test"],
            }
        });
        const res2 = httpMocks.createResponse();
        
        await newDraft(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "fail",
            message: `Bad request: "name" is required`
        });
    });

    it('newDraft internal server error', async function () {
        const req1 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/drafts/new`,
            body: {
                name: "test",
                items: ["test"],
                users: ["test"],
                rounds: 1
            }
        });
        const res1 = httpMocks.createResponse();

        const getStub1 = sinon.stub(dao.drafts, 'add');
        getStub1.throws(new Error("internal server error"));

        await newDraft(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 500);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "error",
            message: "internal server error"
        });
        getStub1.restore();

        const getStub2 = sinon.stub(dao.drafts, 'add');
        getStub2.throws(new Error("ok now it's another error"));

        const req2 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/drafts/new`,
            body: {
                name: "test",
                items: ["test"],
                users: ["test"],
                rounds: 1
            }
        });
        const res2 = httpMocks.createResponse();

        await newDraft(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 500);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "error",
            message: "ok now it's another error"
        });
        getStub2.restore();
    });

    it('getDrafts success', async function () {
        const draft1 = await pushRandomDraft();
        const draft2 = await pushRandomDraft();

        let draftData = [draft1, draft2].map(draft => ({ draftId: draft.uuid, name: draft.name }));

        const req1 = httpMocks.createRequest({
            method: 'GET',
            url: `/api/drafts`
        });
        const res1 = httpMocks.createResponse();

        await getDrafts(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "success",
            message: "Drafts loaded",
            data: draftData
        });

        const draft3 = await pushRandomDraft();
        draftData = [...draftData, { draftId: draft3.uuid, name: draft3.name }];
        const req2 = httpMocks.createRequest({
            method: 'GET',
            url: `/api/drafts`
        });
        const res2 = httpMocks.createResponse();

        await getDrafts(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 200);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "success",
            message: "Drafts loaded",
            data: draftData
        });
        clearDraftsTest();
    });

    it('getDrafts internal server error', async function () {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: `/api/drafts`
        });
        const res = httpMocks.createResponse();

        const getAllStub = sinon.stub(dao.drafts, 'getAll');
        getAllStub.throws(new Error("internal server error"));

        await getDrafts(req, res);

        assert.strictEqual(res._getStatusCode(), 500);
        assert.deepStrictEqual(res._getJSONData(), {
            status: "error",
            message: "internal server error"
        });
        getAllStub.restore();
    });

    it('joinDraft success', async function () {
        const draft1 = await pushRandomDraft();
        const shareCode1 = shareCodeMapping.add(draft1.uuid);

        const req1 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/drafts/join`,
            body: {
                shareCode: shareCode1,
                user: "test"
            }
        });
        const res1 = httpMocks.createResponse();

        await joinDraft(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "success",
            message: `Successfully joined the draft.\n Note: code ${shareCode1} is no longer valid!`,
            data: {
                draftId: draft1.uuid,
                canDraft: draft1.users.includes("test")
            }
        });

        const draft2 = await pushRandomDraft();
        const shareCode2 = shareCodeMapping.add(draft2.uuid);
        const req2 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/drafts/join`,
            body: {
                shareCode: shareCode2,
                user: "test"
            }
        });

        const res2 = httpMocks.createResponse();

        await joinDraft(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 200);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "success",
            message: `Successfully joined the draft.\n Note: code ${shareCode2} is no longer valid!`,
            data: {
                draftId: draft2.uuid,
                canDraft: draft2.users.includes("test")
            }
        });
        clearDraftsTest();
    });

    it('joinDraft bad request', async function () {
        const req1 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/drafts/join`,
            body: {
                shareCode: "test",
            }   
        });

        const res1 = httpMocks.createResponse();

        await joinDraft(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "fail",
            message: `Bad request: "user" is required`
        });

        const req2 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/drafts/join`,
            body: {
                user: "test"
            }
        });
        const res2 = httpMocks.createResponse();

        await joinDraft(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "fail",
            message: `Bad request: "shareCode" is required`
        });
        clearDraftsTest();
    });

    it('joinDraft internal server error', async function () {
        const draft1 = await pushRandomDraft();
        const shareCode1 = shareCodeMapping.add(draft1.uuid);
        const req1 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/drafts/join`,
            body: {
                shareCode: shareCode1,
                user: "test"
            }
        });
        const res1 = httpMocks.createResponse();

        const joinStub1 = sinon.stub(dao.draft, 'join');
        joinStub1.throws(new Error("wahthappaned"));

        await joinDraft(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 500);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "error",
            message: "wahthappaned"
        });

        joinStub1.restore();

        const draft2 = await pushRandomDraft();
        const shareCode2 = shareCodeMapping.add(draft2.uuid);
        const joinStub2 = sinon.stub(dao.draft, 'join');
        joinStub2.throws(new Error("newError"));

        const req2 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/draft/join`,
            body: {
                shareCode: shareCode2,
                user: "talsdfjhalt"
            }
        });

        const res2 = httpMocks.createResponse();

        await joinDraft(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 500);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "error",
            message: "newError"
        });
        joinStub2.restore();
        clearDraftsTest();
    });

    it('clearDrafts success', async function () {
        await pushRandomDraft();
        await pushRandomDraft();

        const req = httpMocks.createRequest({
            method: 'GET',
            url: `/api/drafts/clear`
        });
        const res = httpMocks.createResponse();

        await clearDrafts(req, res);

        assert.strictEqual((await dao.drafts.getAll()).length, 0);
        clearDraftsTest();
    });
});