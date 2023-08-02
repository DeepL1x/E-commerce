import { Item, Shop } from "@prisma/client"

type TShop = Shop & {
  tags: string[] | string
}

type TItem = Item & {
  deleteCover?: boolean
  deleteIndexes?: number[]
}
export { TShop, TItem }
