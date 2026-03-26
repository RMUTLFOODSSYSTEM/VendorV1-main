// src/context/CartContext.js
import { createContext, useContext, useMemo, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((it) => it.id === product.id);
      if (found) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, qty: it.qty + qty } : it
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty }];
    });
  };

  const update = (id, qty) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty } : it))
        .filter((it) => it.qty > 0)
    );
  };

  const remove = (id) => setItems((prev) => prev.filter((it) => it.id !== id));
  const clear = () => setItems([]);

  // ✅ จำนวนรวมของสินค้าทั้งหมดในตะกร้า (ไว้โชว์ badge)
  const count = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );

  const value = { items, add, update, remove, clear, count, subtotal };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
