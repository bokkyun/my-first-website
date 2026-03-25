import { Router } from 'express';
import {
  getGroups,
  createGroup,
  getGroup,
  joinGroup,
  leaveGroup,
  getGroupMembers,
} from '../controllers/groupController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', getGroups);
router.post('/', createGroup);
router.get('/:id', getGroup);
router.post('/join', joinGroup);
router.delete('/:id/leave', leaveGroup);
router.get('/:id/members', getGroupMembers);

export default router;
