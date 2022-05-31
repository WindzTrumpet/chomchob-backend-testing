import { Router } from 'express'
import * as userCtrl from '../controllers/UserController'
import * as exchangeCtrl from '../controllers/ExchangeController'

const router = Router()

router.get('/list', userCtrl.verifyToken, exchangeCtrl.list)
router.get('/:exchangeID', userCtrl.verifyToken, exchangeCtrl.get)
router.post('/create', userCtrl.verifyToken, exchangeCtrl.create)

export default router