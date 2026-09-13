import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

const SOCIAL_LINKS = [
  { icon: FiFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FiInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FiTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FiYoutube, href: "https://youtube.com", label: "YouTube" },
];

const SHOP_LINKS = [
  { label: "All Products", to: "/products" },
  { label: "Fashion", to: "/products?category=fashion" },
  { label: "Electronics", to: "/products?category=electronics" },
  { label: "Shoes", to: "/products?category=shoes" },
  { label: "New Arrivals", to: "/products?category=new-arrivals" },
  { label: "Deals", to: "/products?category=deals" },
];

const CUSTOMER_LINKS = [
  { label: "My Orders", to: "/orders" },
  { label: "Shopping Cart", to: "/cart" },
  { label: "Login", to: "/login" },
  { label: "Create Account", to: "/register" },
  { label: "Checkout", to: "/checkout" },
];

function Footer() {
  return (
    <footer className="bg-gray-950 text-white border-t border-gray-900">
      {/* MAIN FOOTER */}
      <div className="shop-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 py-12 sm:py-14 lg:py-16">
          
          {/* BRAND */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="inline-block text-2xl sm:text-3xl font-bold tracking-tight text-white hover:text-gray-300 transition-colors"
            >
              ShopZone
            </Link>

            <p className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed max-w-sm">
              Your one-stop destination for quality products, modern styles, and everyday essentials.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-900 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* SHOP LINKS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Shop
            </h3>
            <nav className="flex flex-col gap-2.5 mt-5">
              {SHOP_LINKS.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CUSTOMER LINKS */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Customer
            </h3>
            <nav className="flex flex-col gap-2.5 mt-5">
              {CUSTOMER_LINKS.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CONTACT INFO */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
              Contact
            </h3>
            <div className="flex flex-col gap-5 mt-5">
              <div className="flex items-start gap-3">
                <FiMail size={18} className="mt-0.5 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Email
                  </p>
                  <a
                    href="mailto:support@shopzone.com"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    support@shopzone.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiPhone size={18} className="mt-0.5 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Phone
                  </p>
                  <a
                    href="tel:+919000000000"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    +91 90000 00000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMapPin size={18} className="mt-0.5 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-sm text-gray-400">
                    India
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="border-t border-gray-900 bg-gray-950/50">
        <div className="shop-container">
          <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              © {new Date().getFullYear()} ShopZone. All rights reserved.
            </p>

            <div className="flex items-center gap-6 text-xs sm:text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;