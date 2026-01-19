'use client'

import {useCart} from '@/app/context/CartContext'
import Cart from './Cart'
import styles from '@/app/css/components/cart.module.css'

export default function CartOverlay() {
  const {isCartOpen, closeCart} = useCart()

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="overlay"
      />

      {/* Sidebar */}
      <div
        className={styles.cartContainer}
      >
        <Cart />
      </div>

      {/* Close Button */}
      <button
        onClick={closeCart}
        className={styles.closeButton}
      >
        Close
      </button>
    </>
  )
}
