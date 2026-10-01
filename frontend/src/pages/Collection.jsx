import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useLang } from '../context/LangContext';
import Item from '../components/Item';
import Title from '../components/Title';

export default function Collection() {
  const { products } = useContext(ShopContext);
  const { t } = useLang();
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [priceFilter, setPriceFilter] = useState('');
  const [sortType, setSortType] = useState('relevant');

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    // Gender / Audience (category in backend/admin: Men, Women, Kids)
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => {
        const itemCategories = Array.isArray(item.category)
          ? item.category
          : item.category
          ? [item.category]
          : []
        return (
          itemCategories.some(c => category.includes(c)) ||
          category.includes(item.gender)
        )
      })
    }

    // Brands (subCategory in backend/admin: Nike, Adidas, Puma, etc.)
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item =>
        subCategory.includes(item.subCategory) ||
        subCategory.includes(item.brand)
      );
    }

    if (priceFilter) {
      if (priceFilter === '0-100') {
        productsCopy = productsCopy.filter(item => item.price <= 100);
      } else if (priceFilter === '100-200') {
        productsCopy = productsCopy.filter(item => item.price > 100 && item.price <= 200);
      } else if (priceFilter === '200+') {
        productsCopy = productsCopy.filter(item => item.price > 200);
      }
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, priceFilter, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  // Extract unique brands (subCategory) and categories
  const dynamicBrands = [...new Set(products.map(item => item.subCategory).filter(Boolean))];
  const uniqueBrands = dynamicBrands.length > 0 ? dynamicBrands : ['Adidas', 'Nike', 'Puma', 'New Balance', 'Jordan'];

  return (
    <div className='max-padd-container py-16 flex flex-col sm:flex-row gap-1 sm:gap-10 border-t border-gray-10 bg-primaryLight'>
      {/* Filter Options */}
      <div className='min-w-60'>
        <p className='text-xl font-bold text-primary mb-5 uppercase tracking-wide'>{t.filters}</p>

        {/* Brand Filter (subCategory) */}
        <div className='border border-gray-20 rounded-xl p-5 mb-5 bg-white shadow-sm'>
          <p className='mb-4 text-sm font-bold text-primary uppercase'>{t.brands}</p>
          <div className='flex flex-col gap-3 text-sm text-gray-50'>
            {uniqueBrands.map((brand, index) => (
              <p className='flex gap-2 items-center' key={index}>
                <input className='w-4 h-4 rounded text-tertiary focus:ring-tertiary' type='checkbox' value={brand} onChange={toggleSubCategory} />
                <span className='font-medium'>{brand}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Gender / Category Filter (category) */}
        <div className='border border-gray-20 rounded-xl p-5 mb-5 bg-white shadow-sm'>
          <p className='mb-4 text-sm font-bold text-primary uppercase'>{t.gender}</p>
          <div className='flex flex-col gap-3 text-sm text-gray-50'>
            <p className='flex gap-2 items-center'>
              <input className='w-4 h-4 rounded text-tertiary focus:ring-tertiary' type='checkbox' value='Men' onChange={toggleCategory} />
              <span className='font-medium'>{t.men}</span>
            </p>
            <p className='flex gap-2 items-center'>
              <input className='w-4 h-4 rounded text-tertiary focus:ring-tertiary' type='checkbox' value='Women' onChange={toggleCategory} />
              <span className='font-medium'>{t.women}</span>
            </p>
            <p className='flex gap-2 items-center'>
              <input className='w-4 h-4 rounded text-tertiary focus:ring-tertiary' type='checkbox' value='Kids' onChange={toggleCategory} />
              <span className='font-medium'>{t.kids}</span>
            </p>
          </div>
        </div>

        {/* Price Filter */}
        <div className='border border-gray-20 rounded-xl p-5 mb-5 bg-white shadow-sm'>
          <p className='mb-4 text-sm font-bold text-primary uppercase'>{t.price}</p>
          <div className='flex flex-col gap-3 text-sm text-gray-50'>
            <p className='flex gap-2 items-center'>
              <input className='w-4 h-4 rounded text-tertiary focus:ring-tertiary' type='radio' name="price" value='' onChange={() => setPriceFilter('')} defaultChecked />
              <span className='font-medium'>{t.allPrices}</span>
            </p>
            <p className='flex gap-2 items-center'>
              <input className='w-4 h-4 rounded text-tertiary focus:ring-tertiary' type='radio' name="price" value='0-100' onChange={(e) => setPriceFilter(e.target.value)} />
              <span className='font-medium'>{t.under100}</span>
            </p>
            <p className='flex gap-2 items-center'>
              <input className='w-4 h-4 rounded text-tertiary focus:ring-tertiary' type='radio' name="price" value='100-200' onChange={(e) => setPriceFilter(e.target.value)} />
              <span className='font-medium'>{t.between100and200}</span>
            </p>
            <p className='flex gap-2 items-center'>
              <input className='w-4 h-4 rounded text-tertiary focus:ring-tertiary' type='radio' name="price" value='200+' onChange={(e) => setPriceFilter(e.target.value)} />
              <span className='font-medium'>{t.over200}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex justify-between items-center text-base sm:text-2xl mb-8'>
          <Title title={t.allCollection} />

          {/* Product Sort */}
          <select onChange={(e) => setSortType(e.target.value)} className='border border-gray-20 rounded-lg text-sm px-4 py-2 bg-white text-primary focus:outline-none focus:ring-1 focus:ring-tertiary font-medium'>
            <option value="relevant">{t.sortRelevant}</option>
            <option value="low-high">{t.sortLowHigh}</option>
            <option value="high-low">{t.sortHighLow}</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10'>
          {filterProducts.map((item, index) => (
            <Item key={index} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
