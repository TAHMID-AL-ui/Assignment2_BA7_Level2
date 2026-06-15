import { Router } from 'express';
import { requireAuth, requireMaintainer } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  createIssueController,
  deleteIssueController,
  getAllIssuesController,
  getSingleIssueController,
  updateIssueController
} from './issues.controller.js';

const router = Router();

router.get('/', asyncHandler(getAllIssuesController));
router.get('/:id', asyncHandler(getSingleIssueController));
router.post('/', requireAuth, asyncHandler(createIssueController));
router.patch('/:id', requireAuth, asyncHandler(updateIssueController));
router.delete('/:id', requireAuth, requireMaintainer, asyncHandler(deleteIssueController));

export const issueRoutes = router;
