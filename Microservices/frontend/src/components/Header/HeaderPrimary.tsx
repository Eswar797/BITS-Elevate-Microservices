import { Link, useNavigate } from "react-router-dom";
import { RiCloseLine, RiMenuLine, RiShoppingCartLine } from "react-icons/ri";
import { useContext, useEffect, useState } from "react";

import { UserContext } from "../../UserContext";
import UserMenu from "./UserMenu";
import { useMediaQuery } from "@chakra-ui/react";
import SearchAutocomplete from "./SearchAutocomplete";

function HeaderPrimary() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setUserData(null);
    localStorage.removeItem('token');
    navigate('/sign-in');
    window.location.reload();
  };

  return (
    <div>
      <div className={`headerPrimary bg-[#ffffff] flex justify-between items-center h-24 shadow-lg px-4 sm:px-6 lg:px-8 text-lg ${isScrolled ? 'fixed top-0 left-0 right-0 z-50' : ''}`}>
        <div className="flex flex-row space-x-6 md:space-x-20">
          <div className="left flex items-center">
            <Link to="/">
              <div className="udemyLogo">
                <img
                  src="/newlogo.jpg"
                  className="logo h-16 w-auto"
                  alt="Bits Elevate Logo"
                />
              </div>
            </Link>
          </div>
          
          {/* Search Bar - Hidden on Mobile */}
          {!isMobile && (
            <div className="mid flex-1 ml-4 sm:ml-6 lg:ml-8 relative">
              <SearchAutocomplete />
            </div>
          )}
        </div>
        
        {/* Right Section with User Controls */}
        <div className="right flex font-sans items-center">
          {!isMobile ? (
            <>
              {user ? (
                <>
                  {user.role === "admin" && (
                    <div className="w-20 mx-6 md:mx-10">
                      <span className="business">
                        <Link to="/admin">Your Dashboard</Link>
                      </span>
                    </div>
                  )}
                  {user.role === "creator" && (
                    <div className="w-20 mx-6 md:mx-10">
                      <span className="business">
                        <Link to="/creator">Your Dashboard</Link>
                      </span>
                    </div>
                  )}
                  {(user.role === "student" || user.role === "user") && (
                    <div className="w-20 mx-6 md:mx-10">
                      <span className="business">
                        <Link to="/student-dashboard">Your Dashboard</Link>
                      </span>
                    </div>
                  )}
                  <div className="w-20">
                    <span className="teach">Teach on Bits Elevate</span>
                  </div>
                  <div className="cartDiv ml-4">
                    <RiShoppingCartLine className="icon" />
                  </div>
                  <div className="pl-4">
                    <UserMenu role={user.role} handleLogout={handleLogout} />
                  </div>
                </>
              ) : (
                <div className="right flex font-sans items-center">
                  <Link to="/sign-in">
                    <div className="login button bg-white text-slate-700 text-lg shadow-lg border hover:text-slate-900 rounded-md px-6 py-2 ml-4 cursor-pointer">
                      Log In
                    </div>
                  </Link>
                  <Link to="/sign-up">
                    <div className="signup button bg-blue-400 text-white text-lg border shadow-lg hover:bg-blue-500 rounded-md px-6 py-2 ml-3 cursor-pointer">
                      Sign up
                    </div>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <RiCloseLine className="h-6 w-6" />
              ) : (
                <RiMenuLine className="h-6 w-6" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile search bar */}
            <div className="relative mb-4">
              <SearchAutocomplete isMobile={true} />
            </div>
            
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user.role === "creator" && (
                  <Link
                    to="/creator"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  >
                    Creator Dashboard
                  </Link>
                )}
                {(user.role === "student" || user.role === "user") && (
                  <Link
                    to="/student-dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  >
                    Student Dashboard
                  </Link>
                )}
                <Link
                  to="/teach"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Teach on Bits Elevate
                </Link>
                <button 
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  <RiShoppingCartLine className="inline-block h-5 w-5 mr-2" />
                  Cart
                </button>
                <div className="px-3 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-600 font-medium hover:bg-red-50 rounded-md"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Log In
                </Link>
                <Link
                  to="/sign-up"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HeaderPrimary;
