import { Category } from "./category"

export interface Product {
  id?: number
  name: string
  price: string
  description: string
  image: string
  categoryId: number
  createdAt?: string
  updatedAt?: string
  Category: Category
}
