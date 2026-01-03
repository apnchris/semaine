'use client'

import {createContext, useContext, useState, useEffect, ReactNode} from 'react'
import {createCart, addToCart, updateCartLines, removeFromCart, getCart} from '@/lib/shopify'

interface CartLine {
  id: string
  quantity: number
  merchandise: {
    id: string
    title: string
    product: {
      title: string
      handle: string
    }
    priceV2: {
      amount: string
      currencyCode: string
    }
    image?: {
      url: string
      altText?: string
    }
  }
}

interface Cart {
  id: string
  checkoutUrl: string
  lines: {
    edges: Array<{node: CartLine}>
  }
  cost: {
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
  }
}

interface CartContextType {
  cart: Cart | null
  isLoading: boolean
  addItem: (variantId: string, quantity: number) => Promise<void>
  updateItem: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  getCheckoutUrl: () => string | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({children}: {children: ReactNode}) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = async () => {
      const cartId = localStorage.getItem('cartId')
      if (cartId) {
        try {
          const existingCart = await getCart(cartId)
          if (existingCart) {
            setCart(existingCart)
          } else {
            // Cart doesn't exist anymore, create new one
            localStorage.removeItem('cartId')
          }
        } catch (error) {
          console.error('Error loading cart:', error)
          localStorage.removeItem('cartId')
        }
      }
    }
    loadCart()
  }, [])

  const addItem = async (variantId: string, quantity: number) => {
    setIsLoading(true)
    try {
      let currentCart = cart

      // Create cart if it doesn't exist
      if (!currentCart) {
        currentCart = await createCart()
        if (!currentCart) {
          throw new Error('Failed to create cart')
        }
        localStorage.setItem('cartId', currentCart.id)
      }

      // Add item to cart
      const updatedCart = await addToCart(currentCart.id, [
        {merchandiseId: variantId, quantity},
      ])
      setCart(updatedCart)
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cart) return

    setIsLoading(true)
    try {
      const updatedCart = await updateCartLines(cart.id, [{id: lineId, quantity}])
      setCart(updatedCart)
    } catch (error) {
      console.error('Error updating cart:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (lineId: string) => {
    if (!cart) return

    setIsLoading(true)
    try {
      const updatedCart = await removeFromCart(cart.id, [lineId])
      setCart(updatedCart)
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getCheckoutUrl = () => {
    return cart?.checkoutUrl || null
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        getCheckoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
