import { Router } from 'express';
import * as controller from '../controllers/draft.controller';

/**
 * Router for single draft requests.
 */
const router = Router();

router.get('/:draftId', controller.getDraftStatus);
router.get('/:draftId/share', controller.getDraftShareId);
router.post('/:draftId/pick', controller.pickItem);
router.get('/:draftId/remove', controller.removeDraft);

export default router;