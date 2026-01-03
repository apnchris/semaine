'use client'

import {useCart} from '@/app/context/CartContext'

export default function Cart() {
  const {cart, isLoading, updateItem, removeItem, getCheckoutUrl} = useCart()

  if (!cart || cart.lines.edges.length === 0) {
    return (
      <div className="cart-empty">
        <p>Your cart is empty</p>
      </div>
    )
  }

  const checkoutUrl = getCheckoutUrl()

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      
      <div className="cart-items">
        {cart.lines.edges.map(({node: line}) => (
          <div key={line.id} className="cart-item" style={{
            borderBottom: '1px solid #eee',
            padding: '16px 0',
            display: 'flex',
            gap: '16px',
          }}>
            {line.merchandise.image && (
              <img
                src={line.merchandise.image.url}
                alt={line.merchandise.image.altText || line.merchandise.title}
                style={{width: '80px', height: '80px', objectFit: 'cover'}}
              />
            )}
            
            <div style={{flex: 1}}>
              <h3 style={{margin: '0 0 8px'}}>{line.merchandise.product.title}</h3>
              <p style={{margin: '0 0 8px', color: '#666'}}>{line.merchandise.title}</p>
              <p style={{margin: 0, fontWeight: 'bold'}}>
                {line.merchandise.priceV2.currencyCode} {line.merchandise.priceV2.amount}
              </p>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <div>
                <label htmlFor={`quantity-${line.id}`}>Qty: </label>
                <input
                  id={`quantity-${line.id}`}
                  type="number"
                  min="1"
                  value={line.quantity}
                  onChange={(e) => updateItem(line.id, parseInt(e.target.value) || 1)}
                  disabled={isLoading}
                  style={{width: '60px', padding: '4px'}}
                />
              </div>
              
              <button
                onClick={() => removeItem(line.id)}
                disabled={isLoading}
                style={{
                  padding: '8px',
                  backgroundColor: '#f00',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary" style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
          <span>Subtotal:</span>
          <span>
            {cart.cost.subtotalAmount.currencyCode} {cart.cost.subtotalAmount.amount}
          </span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px'}}>
          <span>Total:</span>
          <span>
            {cart.cost.totalAmount.currencyCode} {cart.cost.totalAmount.amount}
          </span>
        </div>

        {checkoutUrl && (
          <a
            href={checkoutUrl}
            style={{
              display: 'block',
              marginTop: '16px',
              padding: '16px',
              backgroundColor: '#000',
              color: '#fff',
              textAlign: 'center',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Proceed to Checkout
          </a>
        )}
      </div>
    </div>
  )
}
