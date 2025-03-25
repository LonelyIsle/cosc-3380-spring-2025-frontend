function Navbar() {
  const [opacity, setOpacity] = useState(100);
  const [isLoggedIn, setIsLoggedIn] = useState(
    JSON.parse(localStorage.getItem("loggedIn")),
  );
  const { getCartQuantity } = useShop();
  const cartQuantity = getCartQuantity();

  const cartIcon =
    cartQuantity > 10
      ? cartSvgs["cart-overflow"]
      : cartSvgs[`cart-${cartQuantity}`];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const pxDelimeter = 100;

      setOpacity((prevOpacity) => {
        if (scrollY > pxDelimeter && prevOpacity !== 80) {
          return 80;
        } else if (scrollY <= pxDelimeter && prevOpacity !== pxDelimeter) {
          return pxDelimeter;
        }
        return prevOpacity;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 This listens for login/logout updates
  useEffect(() => {
    const handleAuthChange = () => {
      const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
      setIsLoggedIn(loggedIn);
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  return (
    <nav
      className="h-20 bg-mantle flex justify-between items-center px-28 sticky top-0 z-10 transition-all duration-300"
      style={{ backgroundColor: `rgba(24, 24, 37, ${opacity / 100})` }}
    >
      <Link to="/" className="text-3xl text-text">
        <img src={logo} alt="Navbar Logo" className="header-box h-20" />
      </Link>
      <ul className="flex gap-4 justify-center items-center">
        {!isLoggedIn ? (
          <>
            <li>
              <Link
                to="/login"
                className="header-box text-mantle bg-gradient-to-r from-maroon to-peach"
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="header-box text-mantle bg-gradient-to-r from-green to-teal"
              >
                Register
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link
              to="/profile"
              className="header-box text-mantle bg-gradient-to-r from-green to-teal"
            >
              Profile Page
            </Link>
          </li>
        )}
        <li>
          <Link
            to="/shop"
            className="header-box text-mantle bg-gradient-to-r from-blue to-sapphire"
          >
            Shop
          </Link>
        </li>
        <li>
          <Link to="/cart">
            <img src={cartIcon} alt="Cart" className="header-box h-20" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
