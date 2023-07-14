import axios from "axios"
import { Filter } from "types"

const asyncWrapper = (fn: Function) => {
  return async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      console.log(error)
    }
  }
}

export const getData = asyncWrapper(async (url: string) => {
  const data = (await axios.get(url)).data
  return data
})

export const getDataWithParams = asyncWrapper(
  async (url: string, params: Filter) => {
    const data = (await axios.get(url, { params: params })).data
    return data
  }
)

export const postData = asyncWrapper(async (url: string, data: any) => {
  const res = (await axios.post(url, data)).data
  return res
})
