import React from "react";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button/Button";
import "./Header.css";

const Header = () => {
  const { itemCount, toggleCart } = useCart();

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <h1>E-commerce-react</h1>
          </div>
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
            />
          </div>
          {/* Actions */}
          <div className="header-actions">
            <Button variant="secondary" size="sm">
              <User size={18} />
              Account
            </Button>

            <button className="cart-button" onClick={toggleCart}>
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}{" "}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Layout;
