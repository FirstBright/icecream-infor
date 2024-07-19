import { useCallback, useEffect, useState } from "react"
import { productList } from "@/const/data"
import debounce from "lodash/debounce"
import { IceCreamCard } from "./iceCreamCard"

interface Product {
    image: string
    title: string
    kcal: string
    sugar: string
    company: string
}

export function IceCream() {
    const [filteredProducts, setFilteredProducts] =
        useState<Product[]>(productList)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
    const [sortDirectionKcal, setSortDirectionKcal] = useState<"asc" | "desc">(
        "asc"
    )
    const [sortDirectionSugar, setSortDirectionSugar] = useState<
        "asc" | "desc"
    >("asc")

    const handleSearch = useCallback(
        debounce((term: string, selectedCompanies: string[]) => {
            let filtered = productList

            if (selectedCompanies.length > 0) {
                filtered = filtered.filter((product) =>
                    selectedCompanies.includes(product.company)
                )
            }

            if (term) {
                filtered = filtered.filter((product) =>
                    product.title.toLowerCase().includes(term.toLowerCase())
                )
            }

            setFilteredProducts(filtered)
        }, 300),
        []
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value
        setSearchTerm(term)
        handleSearch(term, selectedCompanies)
    }

    const toggleCompanyFilter = (company: string) => {
        const updatedCompanies = selectedCompanies.includes(company)
            ? selectedCompanies.filter((c) => c !== company)
            : [...selectedCompanies, company]
        setSelectedCompanies(updatedCompanies)
        handleSearch(searchTerm, updatedCompanies)
    }

    const sortByKcal = () => {
        const sortedProducts = [...filteredProducts].sort((a, b) => {
            const kcalA = parseInt(a.kcal.replace("kcal", ""))
            const kcalB = parseInt(b.kcal.replace("kcal", ""))
            return sortDirectionKcal === "asc" ? kcalA - kcalB : kcalB - kcalA
        })
        setFilteredProducts(sortedProducts)
        setSortDirectionKcal(sortDirectionKcal === "asc" ? "desc" : "asc")
    }

    const sortBySugar = () => {
        const sortedProducts = [...filteredProducts].sort((a, b) => {
            const sugarA = parseFloat(a.sugar.replace("g", ""))
            const sugarB = parseFloat(b.sugar.replace("g", ""))
            return sortDirectionSugar === "asc"
                ? sugarA - sugarB
                : sugarB - sugarA
        })
        setFilteredProducts(sortedProducts)
        setSortDirectionSugar(sortDirectionSugar === "asc" ? "desc" : "asc")
    }

    return (
        <div className='flex flex-col p-2 w-full max-w-4xl mx-auto dark:bg-gray-800 dark:text-white'>
            <div className='relative w-full max-w-xl mx-auto'>
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleInputChange}
                    className='flex w-full p-2 pl-10 border border-gray-300 rounded'
                />
                <svg
                    className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-200'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M21 21l-4.35-4.35M17.65 11.35a6.35 6.35 0 11-12.7 0 6.35 6.35 0 0112.7 0z'
                    />
                </svg>
            </div>
            <div className='p-5 flex justify-center space-x-2'>
                <p>제조사:</p>
                {["해태", "라라스윗", "롯데", "빙그레", "하겐다즈"].map(
                    (company) => (
                        <button
                            key={company}
                            onClick={() => toggleCompanyFilter(company)}
                            className={`p-2 ${
                                selectedCompanies.includes(company)
                                    ? "bg-green-500 opacity-100"
                                    : "bg-blue-500 opacity-50"
                            } text-white rounded`}
                        >
                            {company}
                        </button>
                    )
                )}
            </div>
            <div className='p-3 flex justify-center space-x-2'>
                <button
                    onClick={sortByKcal}
                    className={`p-2 ${
                        sortDirectionKcal === "asc"
                            ? "bg-blue-500"
                            : "bg-green-500"
                    } text-white rounded `}
                >
                    칼로리 {sortDirectionKcal === "asc" ? "⬆️" : "⬇️"}
                </button>
                <button
                    onClick={sortBySugar}
                    className={`p-2 ${
                        sortDirectionSugar === "asc"
                            ? "bg-blue-500"
                            : "bg-green-500"
                    } text-white rounded`}
                >
                    당 {sortDirectionSugar === "asc" ? "⬆️" : "⬇️"}
                </button>
            </div>

            <div className='flex flex-wrap justify-center'>
                {filteredProducts.map((product, index) => (
                    <IceCreamCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}
