import BN from "bignumber.js"

BN.config({ ROUNDING_MODE: BN.ROUND_DOWN })
BN.config({ EXPONENTIAL_AT: 999 })

export default BN
