import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { products, currency, cartItems, updateQuantity, getCartAmount, delivery_fee } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;
  const itemCount = cartData.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className='bg-gradient-to-b from-primaryLight via-primaryLight to-gray-10/60 min-h-[calc(100vh-64px)]'>
      <div className='max-padd-container py-14'>
        {/* Header */}
        <div className='flex items-end justify-between flex-wrap gap-3'>
          <div className='text-center sm:text-left'>
            
            {cartData.length > 0 && (
              <p className='text-sm text-gray-50 font-medium mt-1'>
                {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
              </p>
            )}
          </div>
          {cartData.length > 0 && (
            <Link
              to='/collection'
              className='inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4 transition-all'
            >
              <ArrowLeft className='w-4 h-4' /> Continue shopping
            </Link>
          )}
        </div>

        {cartData.length === 0 ? (
          /* Empty state */
          <div className='mt-10 rounded-3xl bg-primary text-center px-6 py-20'>
            <div className='w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mx-auto mb-5'>
              <ShoppingBag className='w-7 h-7 text-white' />
            </div>
            <h3 className='text-2xl font-black text-white'>Your cart is empty</h3>
            <p className='text-white/50 text-sm mt-2 max-w-xs mx-auto'>
              Looks like you haven't picked your next pair yet.
            </p>
            <Link
              to='/collection'
              className='inline-flex items-center gap-2 mt-7 bg-white text-primary px-8 py-3.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg'
            >
              Discover the collection <ArrowRight className='w-4 h-4' />
            </Link>
          </div>
        ) : (
          <div className='mt-8 flex flex-col lg:flex-row gap-8 items-start'>
            {/* Cart Items */}
            <div className='flex-1 w-full flex flex-col gap-4'>
              {cartData.map((item) => {
                const productData = products.find((product) => product._id === item._id);
                if (!productData) return null;
                const imageSrc = Array.isArray(productData.image) ? productData.image[0] : productData.image;

                return (
                  <div
                    key={`${item._id}-${item.size}`}
                    className='group p-4 bg-white/80 backdrop-blur rounded-2xl border border-gray-10 shadow-sm hover:shadow-md hover:border-gray-20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4'
                  >
                    {/* Image + info */}
                    <div className='flex items-center gap-4 flex-1 min-w-0'>
                      <div className='w-24 h-24 rounded-xl overflow-hidden bg-gray-10 flex-shrink-0'>
                        <img
                          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                          src={imageSrc}
                          alt={productData.name}
                        />
                      </div>
                      <div className='min-w-0'>
                        <p className='text-base sm:text-lg font-bold text-primary line-clamp-1'>{productData.name}</p>
                        <div className='flex items-center gap-2 mt-1.5 flex-wrap'>
                          <span className='px-2.5 py-1 rounded-full bg-primary text-white text-xs font-bold'>
                            Size {item.size}
                          </span>
                          <span className='text-sm font-semibold text-gray-50'>
                            {productData.price} {currency}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity + total + remove */}
                    <div className='flex items-center justify-between sm:justify-end gap-4 sm:gap-6'>
                      <div className='flex items-center bg-gray-10 rounded-full p-1'>
                        <button
                          type='button'
                          onClick={() => item.quantity > 1 && updateQuantity(item._id, item.size, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label='Decrease quantity'
                          className='w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent'
                        >
                          <Minus className='w-3.5 h-3.5' />
                        </button>
                        <span className='w-8 text-center text-sm font-bold text-primary'>{item.quantity}</span>
                        <button
                          type='button'
                          onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                          aria-label='Increase quantity'
                          className='w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-white transition-colors'
                        >
                          <Plus className='w-3.5 h-3.5' />
                        </button>
                      </div>

                      <p className='w-24 text-right font-black text-primary'>
                        {productData.price * item.quantity} {currency}
                      </p>

                      <button
                        type='button'
                        onClick={() => updateQuantity(item._id, item.size, 0)}
                        aria-label={`Remove ${productData.name}`}
                        className='w-9 h-9 flex items-center justify-center rounded-full text-gray-30 hover:bg-primary hover:text-white transition-all'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className='w-full lg:w-[360px] lg:sticky lg:top-24'>
              <div className='bg-primary text-white p-6 rounded-3xl shadow-xl'>
                <h3 className='text-lg font-black mb-5 uppercase tracking-wider'>Summary</h3>

                <div className='flex flex-col gap-3 text-sm'>
                  <div className='flex justify-between font-medium text-white/60'>
                    <p>Subtotal</p>
                    <p className='text-white'>{subtotal} {currency}</p>
                  </div>
                  <div className='flex justify-between font-medium text-white/60'>
                    <p>Shipping fee</p>
                    <p className='text-white'>{delivery_fee} {currency}</p>
                  </div>
                  <hr className='border-white/10 my-1' />
                  <div className='flex justify-between items-baseline'>
                    <p className='font-bold'>Total</p>
                    <p className='font-black text-2xl text-white'>{total} {currency}</p>
                  </div>
                </div>

                <Link
                  to='/place-order'
                  className='mt-6 w-full bg-white text-primary text-sm font-bold uppercase tracking-wider py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg'
                >
                  Proceed to Checkout <ArrowRight className='w-4 h-4' />
                </Link>

                <div className='mt-5 pt-5 border-t border-white/10 flex flex-col gap-2.5 text-xs text-white/50'>
                  <span className='flex items-center gap-2'>
                    <Truck className='w-4 h-4 text-white/70 shrink-0' /> Delivery across Tunisia
                  </span>

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}