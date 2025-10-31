import { useState } from 'preact/hooks';
import { Screen } from './Screen';
import { ChatButton } from '../buttons/chat/ChatButton';

/**
 * Optional Shopping Cart Screen - tree-shakable component for displaying cart items
 * Only included in bundle when explicitly imported
 *
 * @param {Object} props
 * @param {Function} props.onClose - Called when screen is closed
 * @param {Array} [props.items=[]] - Cart items: [{ id, name, price, quantity }]
 * @param {Function} [props.onCheckout] - Called when checkout is clicked (items) => void
 * @param {Function} [props.onUpdateQuantity] - Called when quantity changes (itemId, newQuantity) => void
 */
export function ShoppingCartScreen({
  onClose,
  items = [],
  onCheckout,
  onUpdateQuantity,
}) {
  const [cartItems, setCartItems] = useState(items);

  const updateQuantity = (itemId, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + delta);
          if (onUpdateQuantity) {
            onUpdateQuantity(itemId, newQuantity);
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout(cartItems);
    } else {
      console.log('Checkout:', cartItems);
    }
    onClose();
  };

  const footer = cartItems.length > 0 && (
    <div class="pichat-cart-footer">
      <div class="pichat-cart-total">
        <span>Total:</span>
        <span class="pichat-cart-total-price">${total.toFixed(2)}</span>
      </div>
      <ChatButton
        variant="primary"
        label="Checkout"
        onClick={handleCheckout}
        className="pichat-cart-checkout-button"
      />
    </div>
  );

  return (
    <Screen title="Shopping Cart" onClose={onClose} footer={footer} className="pichat-cart-screen">
      {cartItems.length === 0 ? (
        <div class="pichat-cart-empty">
          <div class="pichat-cart-empty-icon">🛒</div>
          <p>Your cart is empty</p>
        </div>
      ) : (
        <div class="pichat-cart-items">
          {cartItems.map((item) => (
            <div key={item.id} class="pichat-cart-item">
              <div class="pichat-cart-item-info">
                <div class="pichat-cart-item-name">{item.name}</div>
                <div class="pichat-cart-item-price">${item.price.toFixed(2)}</div>
              </div>
              <div class="pichat-cart-item-controls">
                <button
                  class="pichat-cart-qty-button"
                  onClick={() => updateQuantity(item.id, -1)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span class="pichat-cart-item-quantity">{item.quantity}</span>
                <button
                  class="pichat-cart-qty-button"
                  onClick={() => updateQuantity(item.id, 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <div class="pichat-cart-item-subtotal">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </Screen>
  );
}
