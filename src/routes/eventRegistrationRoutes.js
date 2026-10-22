import { Router } from 'express';
import { createEventRegistration, getMyEventRegistration } from '../controllers/eventRegistrationController.js';
import { membershipUpload } from '../middleware/upload.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();

router.get('/mine', requireAuth, getMyEventRegistration);
router.post('/', membershipUpload.fields([{name:'profilePicture',maxCount:1}, {name:'cv',maxCount:1}]), createEventRegistration);
export default router;