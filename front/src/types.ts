export type TShopCard = {
  shopId: string
  name: string
  tags: string[]
  shopImage: string
  userId: number
}

export type TShop = TShopCard & {
  sections: TSection[]
  image?: File
}

export type TSection = {
  sectionId: number
  text: string
  imgUrls: string[]
  order?: number
  shopId: string
  userId: number
  images?: Blob[]
  indexes?: number[]
  deleteCover?: boolean
  deleteIndexes?: number[]
}

export type Filter = {
  name?: string
  tags?: string[]
}

export type TItemCard = {
  coverImg: string
  itemId: number
  name: string
  price: number
  currency: string
  shopId: string
}

export type TItem = TItemCard & {
  cover?: Blob
  gallery?: Blob[]
  imgUrls: string[]
  indexes?: number[]
  deleteCover?: boolean
  deleteIndexes?: number[]
}
