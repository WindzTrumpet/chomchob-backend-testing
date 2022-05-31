import { Router } from 'express'
import * as userCtrl from '../controllers/UserController'
import * as currencyCtrl from '../controllers/CurrencyController'

const router = Router()

router.get('/list', userCtrl.verifyToken, currencyCtrl.list)
router.get('/:currencyID', userCtrl.verifyToken, currencyCtrl.get)

export default router