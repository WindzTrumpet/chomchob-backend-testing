import { Router } from 'express'
import user from './user'
import currency from './currency'
import exchange from './exchange'

const router = Router()

router.get('/', (req, res) => {
    return res.send('API Worked!')
})

router.use('/user', user)
router.use('/currency', currency)
router.use('/exchange', exchange)

export default router