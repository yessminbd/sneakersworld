import React from 'react';
import { Link } from 'react-router-dom';

const Item = ({ product }) => {
    const imageSrc = Array.isArray(product.image) ? product.image[0] : product.image;

    return (
        <div className='group rounded-2xl bg-white border border-gray-10 hover:border-gray-20 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col'>
            {/* Image Container with Link */}
            <Link to={`/product/${product._id}`} className='relative block h-72 w-full overflow-hidden bg-gray-10/50'>
                <img
                    src={imageSrc}
                    alt={product.name}
                    className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                    loading="lazy"
                />
                {product.popular && (
                    <span className='absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-tertiary text-white shadow-sm'>
                        Popular
                    </span>
                )}
            </Link>

            {/* Product Info */}
            <div className='p-4 flex flex-col flex-1 justify-between'>
                <div>
                    <div className='flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-50'>
                        <span className='text-tertiary'>{product.subCategory || product.category}</span>
                        {product.subCategory && product.category && (
                            <span className='text-gray-30 text-[10px]'>{product.category}</span>
                        )}
                    </div>
                    <h4 className='text-base font-bold text-primary line-clamp-1 mt-0.5 group-hover:text-tertiary transition-colors'>
                        {product.name}
                    </h4>
                    <p className='text-xs text-gray-50 line-clamp-2 mt-1 leading-relaxed'>
                        {product.description}
                    </p>
                </div>

                <div className='flex items-center justify-between pt-4 mt-3 border-t border-gray-10'>
                    <span className='text-base font-extrabold text-primary'>
                        {product.price} <span className='text-xs font-semibold text-tertiary'>DT</span>
                    </span>
                    <Link
                        to={`/product/${product._id}`}
                        className='text-xs font-semibold px-3 py-1.5 rounded-full bg-primary text-white hover:bg-tertiary transition-colors'
                    >
                        Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Item;