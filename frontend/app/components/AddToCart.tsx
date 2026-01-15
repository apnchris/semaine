'use client'

import {useState} from 'react'
import {useCart} from '@/app/context/CartContext'
import styles from '../css/components/productPage.module.css'

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
    <div className={`${styles.addToCart} ${variants.length > 1 ? styles.withVariants : styles.noVariants} font-s`}>
      {variants.length > 1 && (
        <div className={`${styles.variantSelector}`}>
          {variants.map((variant) => (
            <label
              key={variant.id}
              className={`${selectedVariant === variant.id ? styles.active : ''} ${!variant.availableForSale ? styles.soldOut : ''} ${styles.variantLabel}`}
            >
              <input
                type="radio"
                name="variant"
                value={variant.id}
                checked={selectedVariant === variant.id}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className={`${styles.variantInput}`}
              />
              <span>
                {variant.title}
              </span>
            </label>
          ))}
        </div>
      )}

      <label className={`${styles.addToCartButtonContainer} ${isLoading || !selectedVariantData?.availableForSale ? styles.disabled : ''}`}>
        <button
          onClick={handleAddToCart}
          disabled={isLoading || !selectedVariantData?.availableForSale}
          className={`${styles.addToCartButton}`}
        >
          {isLoading
            ? 'Adding...'
            : !selectedVariantData?.availableForSale
              ? 'Out of Stock'
              : 'Add to Cart'}
        </button>

        <span className={styles.productPrice}>${selectedVariantData?.price}</span>
      </label>

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
