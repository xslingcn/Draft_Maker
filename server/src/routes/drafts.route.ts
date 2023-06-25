import { Router } from 'express';
import * as controller from '../controllers/drafts.controller';

/**
 * Router for all drafts requests.
 */
const router = Router();

router.post('/new', controller.newDraft)
router.get('/list', controller.getDrafts);
router.get('/clear', controller.clearDrafts);
router.post('/join', controller.joinDraft);

export default router;