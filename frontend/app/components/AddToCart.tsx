'use client'

import {useState} from 'react'
import {useCart} from '@/app/context/CartContext'

interface AddToCartProps {
  variants: Array<{
    id: string
    title: string
    price: number
    compareAtPrice?: number
    sku?: string
    availableForSale: boolean
  }>
  productTitle: string
}

export default function AddToCart({variants, productTitle}: AddToCartProps) {
  const {addItem, isLoading, openCart} = useCart()
  const [selectedVariant, setSelectedVariant] = useState(variants[0]?.id || '')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')

  const selectedVariantData = variants.find((v) => v.id === selectedVariant)

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setMessage('Please select a variant')
      return
    }
    
    if (!selectedVariantData?.availableForSale) {
      setMessage('This variant is out of stock')
      return
    }

    if (quantity < 1) {
      setMessage('Please select a valid quantity')
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
              <option key={variant.id} value={variant.id}>
                {variant.title} - ${variant.price}
                {!variant.availableForSale && ' (Out of stock)'}
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
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          disabled={!selectedVariantData?.availableForSale}
          style={{
            padding: '8px',
            marginLeft: '8px',
            width: '80px',
            opacity: selectedVariantData?.availableForSale ? 1 : 0.5,
          }}
        />
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isLoading || !selectedVariantData?.availableForSale}
        style={{
          marginTop: '16px',
          padding: '12px 24px',
          backgroundColor: selectedVariantData?.availableForSale ? '#000' : '#ccc',
          color: '#fff',
          border: 'none',
          cursor: selectedVariantData?.availableForSale ? 'pointer' : 'not-allowed',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        {isLoading
          ? 'Adding...'
          : !selectedVariantData?.availableForSale
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
