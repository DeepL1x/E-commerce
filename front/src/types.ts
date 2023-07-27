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
  imgIndexes?: number[]
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
  cover?: File
  gallery?: File[]
  imgUrls: string[]
  imgIndexes?: number[]
}
