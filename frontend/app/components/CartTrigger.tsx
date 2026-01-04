'use client'

import {useState, useEffect} from 'react'
import {useCart} from '@/app/context/CartContext'

export default function CartTrigger() {
  const {cart, toggleCart} = useCart()
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    if (cart?.lines?.edges) {
      const count = cart.lines.edges.reduce((total, {node}) => total + node.quantity, 0)
      setItemCount(count)
    } else {
      setItemCount(0)
    }
  }, [cart])

  return (
    <button className='nav-link cart-trigger' onClick={toggleCart}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M15.3 18L18 5.4H12.7125L9 0L5.2875 5.4H0L2.7 18H15.3ZM12.2391 6.3H16.8867L14.5723 17.1H3.42765L1.1133 6.3H5.7609H12.2391ZM9 1.5885L11.6203 5.4H6.37965L9 1.5885Z" fill="black"/>
      </svg>
      
      <span>{itemCount}</span>
    </button>
  )
}
