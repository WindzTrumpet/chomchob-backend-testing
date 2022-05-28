import { Router } from 'express'
import * as userCtrl from '../controllers/UserController'

const router = Router()

router.post('/create', userCtrl.verifyToken, userCtrl.createUser)
router.post('/auth', userCtrl.authenticate)
router.get('/profile', userCtrl.verifyToken, userCtrl.profile)

export default router