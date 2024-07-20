/* eslint-disable @next/next/no-img-element */
import { IProduct } from '@/types'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'

export function IceCreamCard({ product }: { product: IProduct }) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })
    return (
        <Link
            className={
                'relative w-64 h-64 group rounded-3xl overflow-hidden bg-gray-50'
            }
            ref={ref}
            href={`https://www.coupang.com/np/search?q=${encodeURI(
                product.title
            )}`}
        >
            {inView && (
                <img
                    src={product.image}
                    alt={product.title}
                    className='w-full h-full object-cover'
                />
            )}
            {inView && (
                <div
                    className={
                        'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-4xl bg-black bg-opacity-50 p-2 rounded opacity-0 transition-opacity duration-100 group-hover:opacity-100 text-gray-100'
                    }
                >
                    <p className=''>{product.kcal}kcal</p>
                    <p className=''>{product.sugar}g</p>
                </div>
            )}
        </Link>
    )
}
