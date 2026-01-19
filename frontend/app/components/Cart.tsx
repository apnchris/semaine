'use client'

import {useState, useEffect} from 'react'
import {useCart} from '@/app/context/CartContext'
import {DeliveryIcon, PaymentIcon, ReturnIcon} from '@/app/components/Vectors'
import {formatPrice} from '@/app/client-utils'
import styles from '@/app/css/components/cart.module.css'

interface ShopPage {
  shipping?: string
  returns?: string
  payment?: string
}

export default function Cart() {
  const {cart, isLoading, updateItem, removeItem, getCheckoutUrl} = useCart()
  const [shopPage, setShopPage] = useState<ShopPage | null>(null)

  useEffect(() => {
    async function fetchShopPage() {
      try {
        const response = await fetch('/api/shop-page')
        if (response.ok) {
          const data = await response.json()
          setShopPage(data)
        }
      } catch (error) {
        console.error('Failed to fetch shopPage:', error)
      }
    }
    fetchShopPage()
  }, [])

  if (!cart || cart.lines.edges.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty</p>
      </div>
    )
  }

  const checkoutUrl = getCheckoutUrl()
  const totalItems = cart.lines.edges.reduce((sum, {node: line}) => sum + line.quantity, 0)

  return (
    <div className={styles.cart}>
      <p className={`${styles.cartTitle} font-sm`}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
      
      <div className={styles.cartItems}>
        {cart.lines.edges.map(({node: line}) => (
          <div
            key={line.id}
            className={styles.cartItem}
          >
            {line.merchandise.image && (
              <img
                src={line.merchandise.image.url}
                alt={line.merchandise.image.altText || line.merchandise.title}
                className={styles.cartItemImage}
              />
            )}

            <div className={`${styles.cartItemTitle}`}>
              <span className={`${styles.cartItemTitleText} font-s`}>{line.merchandise.product.title}</span><br />
              <span className={`${styles.cartItemTitlePrice} font-xs`}>{line.merchandise.priceV2.currencyCode} {formatPrice(line.merchandise.priceV2.amount)}</span>
            </div>

            <div className={`${styles.cartQuantity} font-s`}>
              <div className={styles.quantityControls}>
                <button
                  type="button"
                  onClick={() => {
                    if (line.quantity <= 1) {
                      removeItem(line.id)
                    } else {
                      updateItem(line.id, line.quantity - 1)
                    }
                  }}
                  disabled={isLoading}
                  className={styles.quantityButton}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  id={`quantity-${line.id}`}
                  type="number"
                  min="0"
                  value={line.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0
                    if (value === 0) {
                      removeItem(line.id)
                    } else {
                      updateItem(line.id, value)
                    }
                  }}
                  disabled={isLoading}
                  className={styles.quantityInput}
                />
                <button
                  type="button"
                  onClick={() => updateItem(line.id, line.quantity + 1)}
                  disabled={isLoading}
                  className={styles.quantityButton}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.cartItemTotalPrice}>
              <span className={`${styles.cartItemTotalPriceText} font-s`}>{line.merchandise.priceV2.currencyCode} {formatPrice(parseFloat(line.merchandise.priceV2.amount) * line.quantity)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Shopping Terms */}
      {shopPage && (
        <div className={`${styles.productTerms} ${styles.productInfoBlock} book`}>
          <div className={`${styles.productInfoBlockGrid}`}>
            <div className={`${styles.productTermsColumn}`}>
              {shopPage.shipping && (
                <div className={`${styles.productDetail} font-s`}>
                  <DeliveryIcon />
                  <pre style={{whiteSpace: 'pre-wrap'}}>{shopPage.shipping}</pre>
                </div>
              )}
              {shopPage.returns && (
                <div className={`${styles.productDetail} font-s`}>
                  <ReturnIcon />
                  <pre style={{whiteSpace: 'pre-wrap'}}>{shopPage.returns}</pre>
                </div>
              )}
            </div>
            {shopPage.payment && (
              <div className={`${styles.productDetail} font-s`}>
                <PaymentIcon />
                <pre style={{whiteSpace: 'pre-wrap'}}>{shopPage.payment}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.cartSummary}>
        <div className={styles.cartSummarySubtotal}>
          Subtotal
        </div>

        {checkoutUrl && (
          <div className={`${styles.checkoutButtonContainer} font-s`}>
            <a
              href={checkoutUrl}
              className={styles.checkoutButton}
            >
              Checkout
            </a>

            <span className={styles.cartSummaryItemValue}>
              {cart.cost.totalAmount.currencyCode} {formatPrice(cart.cost.totalAmount.amount)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
