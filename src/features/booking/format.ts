const aed = new Intl.NumberFormat('en-AE', {
  style: 'currency',
  currency: 'AED',
  maximumFractionDigits: 0,
})

export const formatAed = (amount: number) => aed.format(amount)
