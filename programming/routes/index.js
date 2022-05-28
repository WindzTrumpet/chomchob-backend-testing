import { Router } from 'express'
import user from './user'

const router = Router()

router.get('/', (req, res) => {
    return res.send('API Worked!')
})

router.use('/user', user)

export default router