// Cart Service - handles cart operations

export const addToCart = (product, quantity) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  const existingItem = cart.find((item) => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }
  
  localStorage.setItem("cart", JSON.stringify(cart));
  return cart;
};

export const removeFromCart = (productId) => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const updatedCart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  return updatedCart;
};

export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const clearCart = () => {
  localStorage.setItem("cart", JSON.stringify([]));
};

export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const updateCartItemQuantity = (productId, quantity) => {
  const cart = getCart();
  const updatedCart = cart.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  );
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  return updatedCart;
};
