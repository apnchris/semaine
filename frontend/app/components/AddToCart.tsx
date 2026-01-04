'use client'

import {useState} from 'react'
import {useCart} from '@/app/context/CartContext'

interface AddToCartProps {
  variants: Array<{
    _id: string
    store: {
      id: string
      gid: string
      title: string
      price: number
      compareAtPrice?: number
      sku?: string
      inventory: {
        isAvailable: boolean
        management?: string
        policy?: string
      }
    }
  }>
  productTitle: string
}

export default function AddToCart({variants, productTitle}: AddToCartProps) {
  const {addItem, isLoading, openCart} = useCart()
  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.store.gid || '')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setMessage('Please select a variant')
      return
    }

    try {
      await addItem(selectedVariant, quantity)
      setMessage('Added to cart!')
      
      // Open the cart sidebar
      openCart()
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error adding to cart')
      console.error(error)
    }
  }

  const selectedVariantData = variants.find((v) => v.store.gid === selectedVariant)?.store

  return (
    <div className="add-to-cart">
      {variants.length > 1 && (
        <div className="variant-selector">
          <label htmlFor="variant-select">
            <strong>Select Variant:</strong>
          </label>
          <select
            id="variant-select"
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            style={{
              padding: '8px',
              marginTop: '8px',
              width: '100%',
              maxWidth: '300px',
            }}
          >
            {variants.map((variant) => (
              <option key={variant.store.gid} value={variant.store.gid} disabled={!variant.store.inventory?.isAvailable}>
                {variant.store.title} - ${variant.store.price}
                {!variant.store.inventory?.isAvailable && ' (Out of stock)'}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="quantity-selector" style={{marginTop: '16px'}}>
        <label htmlFor="quantity">
          <strong>Quantity:</strong>
        </label>
        <input
          id="quantity"
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          style={{
            padding: '8px',
            marginLeft: '8px',
            width: '80px',
          }}
        />
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isLoading || !selectedVariantData?.inventory?.isAvailable}
        style={{
          marginTop: '16px',
          padding: '12px 24px',
          backgroundColor: selectedVariantData?.inventory?.isAvailable ? '#000' : '#ccc',
          color: '#fff',
          border: 'none',
          cursor: selectedVariantData?.inventory?.isAvailable ? 'pointer' : 'not-allowed',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        {isLoading
          ? 'Adding...'
          : !selectedVariantData?.inventory?.isAvailable
            ? 'Out of Stock'
            : 'Add to Cart'}
      </button>

      {message && (
        <p
          style={{
            marginTop: '8px',
            color: message.includes('Error') ? 'red' : 'green',
          }}
        >
          {message}
        </p>
      )}
    </div>
  )
}
