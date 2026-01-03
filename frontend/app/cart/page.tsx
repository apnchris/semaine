import Cart from '@/app/components/Cart'

export default function CartPage() {
  return (
    <div className="cart-page" style={{padding: '40px 20px', maxWidth: '800px', margin: '0 auto'}}>
      <h1>Your Cart</h1>
      <Cart />
    </div>
  )
}
