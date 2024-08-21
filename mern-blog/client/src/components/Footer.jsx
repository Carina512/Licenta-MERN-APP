import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer>
      <ul className="footer__categories">
        <li><Link to="/posts/categories/Healthy">Healthy</Link></li>
        <li><Link to="/posts/categories/FastFood">FastFood</Link></li>
        <li><Link to="/posts/categories/Vegan">Vegan</Link></li>
        <li><Link to="/posts/categories/GlutenFree">GlutenFree</Link></li>
        <li><Link to="/posts/categories/Vegetarian">Vegetarian</Link></li>

      </ul>
      <div className="footer__copyright">
        <small>All Rights Reserved &copy; Copyright, Crisan Carina</small>
      </div>
    </footer>
  );
};

export default Footer;
