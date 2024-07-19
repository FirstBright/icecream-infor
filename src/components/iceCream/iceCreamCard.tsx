import { useInView } from "react-intersection-observer"

interface Product {
    image: string
    title: string
    kcal: string
    sugar: string
    company: string
}

export function IceCreamCard({ product }: { product: Product }) {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })
    return (
        <div className={"relative p-1 w-64 h-64"} ref={ref}>
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
                        "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-4xl bg-black bg-opacity-50 p-2 rounded opacity-0 transition-opacity duration-100 hover:opacity-100 text-gray-100"
                    }
                >
                    <p className=''>{product.kcal}</p>
                    <p className=''>{product.sugar}</p>
                </div>
            )}
        </div>
    )
}
