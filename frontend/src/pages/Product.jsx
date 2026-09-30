import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Star, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import RelatedProducts from '../components/RelatedProducts';

export default function Product() {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  
  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(Array.isArray(item.image) ? item.image[0] : item.image);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  if (!productData) {
    return <div className="opacity-0"></div>; // or a loading spinner
  }

  return (
    <div className='border-t-2 border-gray-10 pt-10 pb-20 transition-opacity ease-in duration-500 opacity-100 bg-primaryLight'>
      {/* Product Data */}
      <div className='max-padd-container flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col flex-wrap justify-between sm:justify-normal sm:w-[18.7%] w-full gap-3'>
            {Array.isArray(productData.image) && productData.image.map((item, index) => (
              <img 
                src={item} 
                key={index} 
                onClick={() => setImage(item)} 
                className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-xl border border-gray-20 hover:border-tertiary transition-colors' 
                alt="thumbnail" 
              />
            ))}
          </div>
          <div className='flex-1 relative rounded-2xl overflow-hidden shadow-sm flex items-center justify-center bg-white h-fit'>
            <img className='w-full h-auto max-h-[80vh] object-contain' src={image} alt="main product" />
          </div>
        </div>

        {/* Product Info */}
        <div className='flex-1 flex flex-col justify-center'>
          <p className='text-sm font-bold text-gray-50 uppercase tracking-wider mb-2'>{productData.category}</p>
          <h1 className='font-black text-3xl sm:text-4xl text-primary leading-tight'>{productData.name}</h1>
          
          <div className='flex items-center gap-1 mt-3'>
            {[1, 2, 3, 4, 5].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-30'}`} />
            ))}
            <p className='pl-2 text-sm text-gray-50 font-medium'>(122 reviews)</p>
          </div>

          <p className='mt-6 text-4xl font-black text-primary'>{productData.price} <span className="text-xl text-tertiary">DT</span></p>
          <p className='mt-5 text-gray-50 text-base leading-relaxed md:w-4/5'>{productData.description}</p>

          {/* Sizes */}
          {productData.sizes && productData.sizes.length > 0 && (
            <div className='flex flex-col gap-4 my-8'>
              <p className='text-sm font-bold text-primary uppercase'>Shoe Size</p>
              <div className='flex gap-3 flex-wrap'>
                {productData.sizes.map((item, index) => (
                  <button 
                    key={index} 
                    onClick={() => setSize(item)} 
                    className={`border border-gray-20 py-2.5 px-5 rounded-lg text-sm font-medium transition-colors ${item === size ? 'bg-primary text-white border-primary' : 'bg-white text-primary hover:border-primary'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => addToCart(productData._id, size)}
            className='bg-tertiary text-white px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-primary transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 mt-4 shadow-lg hover:shadow-xl'
          >
            Add to Cart
            <ArrowRight className="w-4 h-4" />
          </button>

          <hr className='mt-10 mb-6 border-gray-20' />

          <div className='flex flex-col gap-3 text-sm text-gray-50 font-medium'>
            <div className="flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-blue-500" />
               <p>100% Original Product Guaranteed.</p>
            </div>
            <div className="flex items-center gap-3">
               <Truck className="w-5 h-5 text-emerald-500" />
               <p>Cash on delivery available nationwide.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="max-padd-container">
        <RelatedProducts category={productData.category} currentProductId={productData._id} />
      </div>
    </div>
  );
}
