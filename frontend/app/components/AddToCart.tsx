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
          <div style={{marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {variants.map((variant) => (
              <label
                key={variant.id}
                className={selectedVariant === variant.id ? 'active' : ''}
              >
                <input
                  type="radio"
                  name="variant"
                  value={variant.id}
                  checked={selectedVariant === variant.id}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  disabled={!variant.availableForSale}
                />
                <span>
                  {variant.title}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="quantity-selector" style={{display: 'none'}}>
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

      <div className='add-to-cart-container'>
        <button
          onClick={handleAddToCart}
          disabled={isLoading || !selectedVariantData?.availableForSale}
        >
          {isLoading
            ? 'Adding...'
            : !selectedVariantData?.availableForSale
              ? 'Out of Stock'
              : 'Add to Cart'}
        </button>

        <span className='product-price'>${selectedVariantData?.price}</span>
      </div>

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
