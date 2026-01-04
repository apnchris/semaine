'use client'

import {useCart} from '@/app/context/CartContext'
import Cart from './Cart'

export default function CartOverlay() {
  const {isCartOpen, closeCart} = useCart()

  if (!isCartOpen) return null

  return (
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
  )
}
