import { COMPANIES } from '@/const/data'

export type Mutable<T> = {
    -readonly [P in keyof T]: T[P]
}

export type CompanyType = Mutable<typeof COMPANIES>[number]

export interface IProduct {
    image: string
    title: string
    kcal: number
    sugar: number
    company: (typeof COMPANIES)[number]
}
