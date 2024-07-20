import { useCallback, useEffect, useState } from 'react'
import { COMPANIES, productList } from '@/const/data'
import debounce from 'lodash/debounce'
import { IceCreamCard } from './iceCreamCard'
import { CompanyType, Mutable, IProduct } from '@/types'

interface ISort {
    category: 'kcal' | 'sugar'
    direction: 'asc' | 'desc'
}

export function IceCream() {
    // 정의
    const [filteredProducts, setFilteredProducts] =
        useState<IProduct[]>(productList)
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [selectedCompanies, setSelectedCompanies] =
        useState<CompanyType[]>(COMPANIES)
    const [sort, setSort] = useState<ISort>({
        category: 'kcal',
        direction: 'asc',
    })

    /**
     * 정렬 변경
     * @param category
     */
    const changeSort = (category: 'kcal' | 'sugar') => {
        if (sort.category === category) {
            return setSort({
                ...sort,
                direction: sort.direction === 'asc' ? 'desc' : 'asc',
            })
        }
        return setSort({
            category,
            direction: 'asc',
        })
    }

    /**
     * 디바운스처리된 검색어의 변경 함수
     */
    const debouncedChangeSearchTerm = debounce((term: string) => {
        setSearchTerm(term)
    }, 300)

    /**
     * 타이핑 시 처리
     * @param event
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value
        debouncedChangeSearchTerm(term)
    }

    /**
     * 회사 필터링 변경
     * @param company
     */
    const toggleCompanyFilter = (company: (typeof COMPANIES)[number]) => {
        const updatedCompanies: CompanyType[] = selectedCompanies.includes(
            company
        )
            ? selectedCompanies.filter(
                  (selectedCompany) => selectedCompany !== company
              )
            : [...selectedCompanies, company]
        setSelectedCompanies(updatedCompanies)
    }

    /**
     * 렌더링 중 정렬기능 모듈
     */
    const sorting = useCallback(
        (products: IProduct[]) => {
            if (sort === null) return products

            const sortedProducts = [...products].sort((a, b) => {
                const itemA = a[sort.category]
                const itemB = b[sort.category]
                return sort.direction === 'asc' ? itemA - itemB : itemB - itemA
            })
            setFilteredProducts(sortedProducts)

            return sortedProducts
        },
        [sort]
    )

    /**
     * 검색 결과 렌더링
     */
    useEffect(() => {
        // 렌더링 대상 생성
        let renderProducts = productList

        // 검색어
        if (searchTerm !== '') {
            renderProducts = renderProducts.filter((product) =>
                product.title.includes(searchTerm)
            )
        }

        // 회사 필터링
        renderProducts = renderProducts.filter((renderProduct) =>
            selectedCompanies.includes(renderProduct.company)
        )

        // 정렬
        renderProducts = sorting(renderProducts)

        // filteredProducts를 렌더링 결과값으로 갱신
        setFilteredProducts(renderProducts)
    }, [searchTerm, selectedCompanies, sort, sorting])

    return (
        <div className='flex flex-col p-2 w-full max-w-4xl mx-auto dark:bg-gray-800 dark:text-white'>
            <div className='relative w-full max-w-xl mx-auto'>
                <input
                    type='text'
                    onChange={handleInputChange}
                    className='flex w-full p-2 pl-10 border border-gray-300 rounded text-black'
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
                {COMPANIES.map((company) => (
                    <button
                        key={company}
                        onClick={() => toggleCompanyFilter(company)}
                        className={`p-2 ${
                            selectedCompanies.includes(company)
                                ? 'bg-green-500 opacity-100'
                                : 'bg-blue-500 opacity-50'
                        } text-white rounded`}
                    >
                        {company}
                    </button>
                ))}
            </div>
            <div className='p-3 flex justify-center space-x-2'>
                <button
                    onClick={() => changeSort('kcal')}
                    className={`p-2 ${
                        sort?.category === 'kcal'
                            ? sort.direction === 'asc'
                                ? 'bg-blue-500'
                                : 'bg-green-500'
                            : 'bg-gray-700'
                    } text-white rounded `}
                >
                    칼로리{' '}
                    {sort?.category === 'kcal'
                        ? sort.direction === 'asc'
                            ? '⬆️'
                            : '⬇️'
                        : null}
                </button>
                <button
                    onClick={() => changeSort('sugar')}
                    className={`p-2 ${
                        sort?.category === 'sugar'
                            ? sort.direction === 'asc'
                                ? 'bg-blue-500'
                                : 'bg-green-500'
                            : 'bg-gray-700'
                    } text-white rounded`}
                >
                    당{' '}
                    {sort?.category === 'sugar'
                        ? sort.direction === 'asc'
                            ? '⬆️'
                            : '⬇️'
                        : null}
                </button>
            </div>

            <div className='flex flex-wrap justify-center gap-4'>
                {filteredProducts.map((product, index) => (
                    <IceCreamCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}
