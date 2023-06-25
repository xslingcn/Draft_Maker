import assert from "assert";
import logger from "../../../../logging/loggerFactory";
import { Env } from "../../../../env";

describe('logging/loggerFactory', function () {
    it('logger exists', function () {
        assert.notStrictEqual(logger, undefined);
    });
    
    it('logger level correct', function () {
        if (Env.TEST) { 
            assert.strictEqual(logger.level, 'error');
        }
        else if (Env.DEBUG) {
            assert.strictEqual(logger.level, 'debug');
        }
        else assert.strictEqual(logger.level, 'info');
     });
 });