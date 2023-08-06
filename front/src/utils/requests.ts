import axios, { AxiosError } from "axios"
import { Filter } from "types"

axios.defaults.withCredentials = true

const myAxios = axios.create()
myAxios.defaults.withCredentials = true
myAxios.interceptors.response.use(
  (response) => {
    return Promise.resolve(response.data)
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

const asyncWrapper = (fn: Function) => {
  return async (...args: any[]) => {
    return await fn(...args)
  }
}

export const getData = asyncWrapper(async (url: string) => {
  return myAxios.get(url)
})

export const getDataWithParams = asyncWrapper(
  async (url: string, params: Filter) => {
    return myAxios.get(url, { params: params })
  }
)

export const postData = asyncWrapper(
  async (url: string, data: any, options?: Object) => {
    return myAxios.post(url, data, {
      ...options,
      withCredentials: true,
    })
  }
)
export const putData = asyncWrapper(
  async (url: string, data: any, options?: Object) => {
    return myAxios.put(url, data, {
      ...options,
      withCredentials: true,
    })
  }
)

export const deleteData = asyncWrapper(async (url: string, data: any) => {
  return myAxios.delete(url, data)
})
