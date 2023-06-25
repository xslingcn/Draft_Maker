import assert from "assert";
import { Env } from "../../../env";

describe('env', function () {
    it('env set', function () {
        assert.notStrictEqual(Env.TEST, undefined);
        assert.notStrictEqual(Env.DEBUG, undefined);
        assert.notStrictEqual(Env.PORT, undefined);
        assert.notStrictEqual(Env.HOST, undefined);
        assert.notStrictEqual(Env.ROOT_DIR, undefined);
        assert.notStrictEqual(Env.STORAGE, undefined);
        assert.notStrictEqual(Env.STORAGE_DIR, undefined);
        
    });

    it('env type correct', function () { 
        assert.strictEqual(typeof Env.TEST, "boolean");
        assert.strictEqual(typeof Env.DEBUG, "boolean");
        assert.strictEqual(typeof Env.PORT, "number");
        assert.strictEqual(typeof Env.HOST, "string");
        assert.strictEqual(typeof Env.ROOT_DIR, "string");
        assert.strictEqual(typeof Env.STORAGE, "string");
        assert.strictEqual(typeof Env.STORAGE_DIR, "string");
    });
});