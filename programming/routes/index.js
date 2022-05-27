import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.send('API Worked!')
})

export default router