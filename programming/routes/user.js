import { Router } from 'express'
import * as userCtrl from '../controllers/UserController'
import * as walletCtrl from '../controllers/WalletController'

const router = Router()

router.post('/create', userCtrl.verifyToken, userCtrl.onlyAdmin, userCtrl.createUser)
router.post('/auth', userCtrl.authenticate)
router.get('/profile', userCtrl.verifyToken, userCtrl.profile)
router.get('/wallet', userCtrl.verifyToken, walletCtrl.userCurrentBalance)
router.post('/wallet/transfer', userCtrl.verifyToken, walletCtrl.transfer)
router.post('/wallet/adjust', userCtrl.verifyToken, userCtrl.onlyAdmin, walletCtrl.adjust)

export default router