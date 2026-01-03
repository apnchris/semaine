'use client'

import {useState, useEffect} from 'react'
import {useCart} from '@/app/context/CartContext'
import Cart from './Cart'

export default function CartTrigger() {
  const {cart} = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const [itemCount, setItemCount] = useState(0)

  useEffect(() => {
    if (cart?.lines?.edges) {
      const count = cart.lines.edges.reduce((total, {node}) => total + node.quantity, 0)
      setItemCount(count)
    } else {
      setItemCount(0)
    }
  }, [cart])

  const toggleCart = () => {
    setIsOpen(!isOpen)
  }

  const closeCart = () => {
    setIsOpen(false)
  }

  // Expose openCart function globally so AddToCart can use it
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).openCart = () => setIsOpen(true)
    }
  }, [])

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={toggleCart}
      >
        Cart
        {itemCount > 0 && (
          <span
          >
            ({itemCount})
          </span>
        )}
      </button>

      {/* Cart Sidebar Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeCart}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
          />

          {/* Sidebar */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '500px',
              backgroundColor: '#fff',
              zIndex: 1000,
              overflowY: 'auto',
              boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.15)',
              padding: '20px',
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeCart}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                lineHeight: '1',
              }}
            >
              ✕
            </button>

            <Cart />
          </div>
        </>
      )}
    </>
  )
}
