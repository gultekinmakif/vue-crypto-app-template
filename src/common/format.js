import BN from "@/common/BN"

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export default function format(num, collapse = false, digits = 0, isUSD = true) {
  if (num)
    if (collapse) {
      let x = num
      if (num >= 1e9) {
        x = (num / 1000000000).toFixed(digits).replace(/\.0$/, "") + "b"
      } else if (num >= 1e6) {
        x = (num / 1000000).toFixed(digits).replace(/\.0$/, "") + "m"
      } else if (num >= 1e4) {
        x = (num / 1000).toFixed(digits).replace(/\.0$/, "") + "k"
      } else return formatter.format(num)
      return isUSD ? "$" + x : x
    } else return formatter.format(num)
  else return num
}

export function AddressShorter(address) {
  return address.substr(0, 5) + "..." + address.substr(-4, 4)
}

export function formatBN(num, digits = -1) {
  return digits > 0
    ? BN(num).decimalPlaces() > digits
      ? BN(num).toFixed(digits).toString()
      : BN(num).toString()
    : BN(num).toString()
}

export function formatString(str, ln = 8) {
  return str?.length > ln ? str.substr(0, ln) + "..." : str
}
