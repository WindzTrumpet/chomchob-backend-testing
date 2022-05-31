import _ from 'lodash'

export async function userCurrentBalance(req, res) {
    try {
        const user = req.user

        const wallets = await user.getWallets({
            attributes: ['balance'],
            include: {
                association: 'Currency',
                attributes: ['name']
            }
        })

        res.json(_.map(wallets, o => ({
            currency: o['Currency']['name'],
            balance: o['balance'],
        })))
    } catch (err) {
        console.error(err)

        return res.status(500).json({
            error: true,
            code: 'unknown',
        })
    }
}