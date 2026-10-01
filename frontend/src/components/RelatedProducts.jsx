import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLang } from '../context/LangContext';
import Item from './Item';
import Title from './Title';

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
    const { products } = useContext(ShopContext);
    const { t } = useLang();
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            let productsCopy = products.slice();
            // Prioritize same brand or same category
            let matched = productsCopy.filter(
                (item) => item._id !== currentProductId && (
                    (subCategory && item.subCategory === subCategory) ||
                    (category && item.category === category)
                )
            );
            // If few matches, fallback to other products
            if (matched.length === 0) {
                matched = productsCopy.filter((item) => item._id !== currentProductId);
            }
            setRelated(matched.slice(0, 4)); // Get up to 4 items
        }
    }, [products, category, subCategory, currentProductId]);

    if (related.length === 0) return null;

    return (
        <div className='mt-24 mb-8'>
            <Title title={t.relatedProductsTitle || 'You May Also Like'} titlesStyles={"text-center"} />
            <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mt-10'>
                {related.map((item, index) => (
                    <Item key={index} product={item} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
