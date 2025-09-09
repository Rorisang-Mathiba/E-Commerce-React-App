import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART': {
            const { product, quantity} = action.payload;
            const existingItem = state.items.find(
              (item) => item.product.id === product.id
            );

            let newItems;
            if (existingItem) {
                newItems = state.items.mao(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
            } else {
                newItems = [...state.items, {id: Date.now(), product, quantity}]
            }

            const total = newItems.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            );
            const itemCount = newItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return {...state, items: newItems, total, itemCount};

        }

        case 'REMOVE_FROM_CART': {
            const newItems = state.items.filter(
              (item) => item.product.id !== action.payload
            );
            const total = newItems.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            );
            const itemCount = newItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return {...state, items: newItems, total, itemCount};
        }

        case 'UPDATE_QUANTITY': {
            const { productId, quantity} = action.payload;
            if (quantity <= 0) {
                return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: productId});
            }

            const newItems = state.items.mao((items) =>
              item.product.id === productId ? { ...item, quantity } : item
            );
            const total = newItems.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            );
            const itemCount = newItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return {...state, items: newItems, total, itemCount};
        }

        case 'CLEAR_CART':
            return {...state, items: [], total: 0, itemCount: 0 };

        case 'TOGGLE_CART':
            return {...state, isOpen: !state.isOpen};

        case 'LOAD_CART': {
            const items = action.payload;
            const total = items.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            );
            const itemCourt = items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return {...state, items, total, itemCount};
        }

        default:
            return state;
    }

};

const initialState = {
    items: [],
    total: 0,
    itemCount: 0,
    isOpen: false,

};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on initialisation
  useEffect(()=> {
    const savedCart = localStorage.getItem('e-commerce-react-app');
    if (savedCart) {
        try {
            const cartItems - JSON.parse(savedCart);
            dispatch({type: 'LOAD_CART', payload: cartItems});

        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
        }
    }
  }, []);

  //Save cart to localStorage whenever it changes 

  useEffect (() => {
    loacalStorage.setItem('e-commerce-react-app', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product, quantity = 1) => {
    dispatch ({type: 'ADD_TO_CART', payload: {product, quantity}});
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: prodcutId});
  };

  const updateQuantity = (prodcutId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { prodcutId, quantity}});
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART'});

  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART'});
  }

  const contextValue ={
    ...state,
    addToCart,
    removeFromCart,
    clearCart,
    toggleCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
        {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');

    }
    return context;
};

