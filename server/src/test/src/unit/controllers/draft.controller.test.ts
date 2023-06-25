import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import sinon from 'sinon';
import { Env } from '../../../../env';
Env.TEST = true;    // workaround for local env
import { getDraftShareId, getDraftStatus, pickItem, removeDraft } from '../../../../controllers/draft.controller';
import dao from '../../../../models/daoFactory';
import shareCodeMapping from '../../../../services/shareCodeMapping.service';
import { clearDraftsTest, pushRandomDraft } from '../../helper/test.utils';

describe('controllers/darft', function () {
    it('init success', () =>
        assert.notStrictEqual(dao.draft, undefined)
    );

    it('getDraftStatus success', async function () {
        const draft1 = await pushRandomDraft();

        const req1 = httpMocks.createRequest({
            method: 'GET',
            url: `/api/draft/`,
            params: {
                draftId: draft1.uuid
            }
        });
        const res1 = httpMocks.createResponse();

        await getDraftStatus(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "success",
            message: "Draft Loaded",
            data: { ...draft1 }
        });

        const draft2 = await pushRandomDraft();

        const req2 = httpMocks.createRequest({
            method: 'GET',
            url: `/api/draft/`,
            params: {
                draftId: draft2.uuid
            }
        });
        const res2 = httpMocks.createResponse();

        await getDraftStatus(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 200);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "success",
            message: "Draft Loaded",
            data: { ...draft2 }
        });
        
        clearDraftsTest();
    });

    it('getDraftStatus bad request', async function () {
        const req1 = httpMocks.createRequest({
            method: 'GET',
            url: '/api/draft'
        });
        const res1 = httpMocks.createResponse();

        await getDraftStatus(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "fail",
            message: `Bad request: "draftId" is required`
        });
    });

    it('getDraftStatus internal server error', async function () {
        const req1 = httpMocks.createRequest({
            method: 'GET',
            url: '/api/drafts',
            params: {
                draftId: 'asda654654aasd'
            }
        });
        const res1 = httpMocks.createResponse();

        const getStub1 = sinon.stub(dao.draft, 'get');
        getStub1.throws(new Error("internal server error"));

        await getDraftStatus(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 500);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "error",
            message: "internal server error"
        });
        getStub1.restore();

        const getStub2 = sinon.stub(dao.draft, 'get');
        getStub2.throws(new Error("ok now it's another error"));

        const req2 = httpMocks.createRequest({
            method: 'GET',
            url: '/api/drafts/',
            params: {
                draftId: '123'
            }
        });
        const res2 = httpMocks.createResponse();

        await getDraftStatus(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 500);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "error",
            message: "ok now it's another error"
        });
        getStub2.restore();
    });

    it('getDraftShareId success', async function () {
        const draft1 = await pushRandomDraft();

        const req1 = httpMocks.createRequest({
            method: 'GET',
            url: `/api/draft/share`,
            params: {
                draftId: draft1.uuid
            }
        });
        const res1 = httpMocks.createResponse();

        await getDraftShareId(req1, res1);
        
        const savedId1 = shareCodeMapping.getId(draft1.uuid);

        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "success",
            message: "Got the share code",
            data: {
                shareCode: savedId1
            }
        });

        const draft2 = await pushRandomDraft();

        const req2 = httpMocks.createRequest({
            method: 'GET',
            url: `/api/draft/share`,
            params: {
                draftId: draft2.uuid
            }
        });
        const res2 = httpMocks.createResponse();

        await getDraftShareId(req2, res2);

        const savedId2 = shareCodeMapping.getId(draft2.uuid);

        assert.strictEqual(res2._getStatusCode(), 200);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "success",
            message: "Got the share code",
            data: {
                shareCode: savedId2
            }
        });
        clearDraftsTest();
    });

    it('getDraftShareId internal server error', async function () { 
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/api/draft/share',
            params: {
                draftId: '123'
            }
        });
        const res = httpMocks.createResponse();

        const shareStub = sinon.stub(shareCodeMapping, 'add');
        shareStub.throws(new Error("internal server error"));

        await getDraftShareId(req, res);
            
        assert.strictEqual(res._getStatusCode(), 500);
        assert.deepStrictEqual(res._getJSONData(), {
            status: "error",
            message: "internal server error"
        });
        shareStub.restore();
    });

    it('pickItem success', async function () {
        const draft1 = await pushRandomDraft();

        const req1 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/draft/pick`,
            params: {
                draftId: draft1.uuid
            },
            body: {
                user: draft1.users[0],
                item: draft1.items[0]
            }
        });
        const res1 = httpMocks.createResponse();

        await pickItem(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "success",
            message: "Successfully picked item"
        });

        const draft2 = await pushRandomDraft();
        const req2 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/draft/pick`,
            params: {
                draftId: draft2.uuid
            },
            body: {
                user: draft2.users[0],
                item: draft2.items[0]
            }
        });
            
        const res2 = httpMocks.createResponse();

        await pickItem(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 200);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "success",
            message: "Successfully picked item"
        });
        clearDraftsTest();
    });

    it('pickItem bad request', async function () { 
        const draft1 = await pushRandomDraft();
        const req1 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/draft/pick`,
            params: {
                draftId: draft1.uuid
            },
            body: {
                user: draft1.users[0]
            }
        });
        const res1 = httpMocks.createResponse();

        await pickItem(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "fail",
            message: `Bad request: "item" is required`
        });

        const draft2 = await pushRandomDraft();
        const req2 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/draft/pick`,
            body: {
                user: draft2.users[0],
                item: draft2.items[0]
            }
        });
        const res2 = httpMocks.createResponse();

        await pickItem(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "fail",
            message: `Bad request: "draftId" is required`
        });
        clearDraftsTest();
    });

    it('pickItem internal server error', async function () { 
        const draft1 = await pushRandomDraft();
        const req1 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/draft/pick`,
            params: {
                draftId: draft1.uuid
            },
            body: {
                user: draft1.users[0],
                item: draft1.items[0]
            }
        });
        const res1 = httpMocks.createResponse();

        const pickStub1 = sinon.stub(dao.draft, 'pick');
        pickStub1.throws(new Error("wahthappaned"));

        await pickItem(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 500);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "error",
            message: "wahthappaned"
        });
        
        pickStub1.restore();

        const loadStub2 = sinon.stub(dao.draft, 'pick');
        loadStub2.throws(new Error("newError"));

        const req2 = httpMocks.createRequest({
            method: 'POST',
            url: `/api/draft/pick`,
            params: {
                draftId: draft1.uuid
            },
            body: {
                user: draft1.users[0],
                item: draft1.items[0]
            }
        });

        const res2 = httpMocks.createResponse();

        await pickItem(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 500);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "error",
            message: "newError"
        });
        loadStub2.restore();
    });

    it('removeDraft success', async function () {
        const draft1 = await pushRandomDraft();
        const req1 = httpMocks.createRequest({
            method: 'GET',
            url: `/api/draft/remove`,
            params: {
                draftId: draft1.uuid
            }
        });
        const res1 = httpMocks.createResponse();

        await removeDraft(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "success",
            message: "Draft removed"
        });

        const draft2 = await pushRandomDraft();

        const req2 = httpMocks.createRequest({
            method: 'GET',
            url: `/api/draft/remove`,
            params: {
                draftId: draft2.uuid
            }
        });
        const res2 = httpMocks.createResponse();

        await removeDraft(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 200);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "success",
            message: "Draft removed"
        });
        clearDraftsTest();
    });

    it('removeDraft internal server error', async function () {
        const req1 = httpMocks.createRequest({
            method: 'GET',
            url: '/api/draft/remove',
            params: {
                draftId: "123"
            }
        });
        const res1 = httpMocks.createResponse();

        const listStub1 = sinon.stub(dao.draft, 'remove');
        listStub1.throws(new Error("smthbad:("));

        await removeDraft(req1, res1);

        assert.strictEqual(res1._getStatusCode(), 500);
        assert.deepStrictEqual(res1._getJSONData(), {
            status: "error",
            message: "smthbad:("
        });
        listStub1.restore();

        const listStub2 = sinon.stub(dao.draft, 'remove');
        listStub2.throws(new Error("finefine"));

        const req2 = httpMocks.createRequest({
            method: 'GET',
            url: '/api/draft/remove',
            params: {
                draftId: "asdlkjhalsdk"
            }
        });
        const res2 = httpMocks.createResponse();

        await removeDraft(req2, res2);

        assert.strictEqual(res2._getStatusCode(), 500);
        assert.deepStrictEqual(res2._getJSONData(), {
            status: "error",
            message: "finefine"
        });
        listStub2.restore();
        clearDraftsTest();
    })
});