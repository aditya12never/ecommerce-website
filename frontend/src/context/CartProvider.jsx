import { useState } from "react";
import CartContext from "./CartContext";

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // ADD TO CART
  const addToCart = (product) => {
    const stock = Number(product.stock ?? 0);

    if (stock <= 0) {
      alert("This product is currently out of stock.");
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        if (existingItem.quantity >= stock) {
          alert(
            `Only ${stock} unit${
              stock === 1 ? "" : "s"
            } available for this product.`
          );

          return currentItems;
        }

        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // REMOVE FROM CART
  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => item.id !== productId
      )
    );
  };

  // INCREASE QUANTITY
  const increaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const stock = Number(item.stock ?? 0);

        if (item.quantity >= stock) {
          alert(
            `Only ${stock} unit${
              stock === 1 ? "" : "s"
            } available for this product.`
          );

          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  };

  // DECREASE QUANTITY
  const decreaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // CLEAR CART
  const clearCart = () => {
    setCartItems([]);
  };

  // TOTAL NUMBER OF ITEMS
  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // TOTAL PRICE
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;