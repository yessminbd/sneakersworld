import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Item from './Item';
import Title from './Title';

const RelatedProducts = ({ category, currentProductId }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter(
                (item) => category === item.category && item._id !== currentProductId
            );
            setRelated(productsCopy.slice(0, 4)); // Get up to 4 items
        }
    }, [products, category, currentProductId]);

    if (related.length === 0) return null;

    return (
        <div className='mt-24 mb-8'>
            <Title title={'Related Products'} titlesStyles={"text-center"} />
            <div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mt-10'>
                {related.map((item, index) => (
                    <Item key={index} product={item} />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
