import { Router } from 'express'
import * as userCtrl from '../controllers/UserController'
import * as exchangeCtrl from '../controllers/ExchangeController'

const router = Router()

router.get('/list', userCtrl.verifyToken, exchangeCtrl.list)
router.get('/:exchangeID', userCtrl.verifyToken, exchangeCtrl.get)
router.post('/create', userCtrl.verifyToken, userCtrl.onlyAdmin, exchangeCtrl.create)
router.post('/:exchangeID/update', userCtrl.verifyToken, userCtrl.onlyAdmin, exchangeCtrl.update)

export default router