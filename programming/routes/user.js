import { Router } from 'express'
import * as userCtrl from '../controllers/UserController'
import * as walletCtrl from '../controllers/WalletController'

const router = Router()

router.post('/create', userCtrl.verifyToken, userCtrl.onlyAdmin, userCtrl.createUser)
router.post('/auth', userCtrl.authenticate)
router.get('/profile', userCtrl.verifyToken, userCtrl.profile)
router.get('/wallet', userCtrl.verifyToken, walletCtrl.userCurrentBalance)

export default router