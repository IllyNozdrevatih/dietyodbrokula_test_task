import { uniqBy } from "lodash"

export const getAutocompleteMonths = (orders) => {
  const autocompleteMonthList = []

  for (const orderItem of orders) {
    const orderItemEntryDate = new Date(orderItem.date)

    const monthObject = {
      text: orderItemEntryDate.toLocaleDateString("pl-PL", { month: "long", year: "numeric" }),
      value: orderItem.date,
      disabled: false,
    }
    autocompleteMonthList.push(monthObject)
  }

  const uniqueMonthList = uniqBy(autocompleteMonthList, "text")

  uniqueMonthList.sort((a, b) => {
    const firstEntryDate = new Date(a.value)
    const secondEntryDate = new Date(b.value)

    return firstEntryDate - secondEntryDate
  })

  return uniqueMonthList
}
