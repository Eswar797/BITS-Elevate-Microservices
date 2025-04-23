import { Link, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { RiFacebookFill, RiGoogleFill } from 'react-icons/ri';
import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../UserContext';
import Swal from "sweetalert2";

interface DecodedToken {
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  role: string;
  iat: number;
  exp: number;
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserData } = useContext(UserContext);
  
  // Get the redirect path from location state, or default to all-courses page
  const from = location.state?.from || '/all-courses';

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:7073/api/auth/login', {
        email,
        password,
      });
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Decode token and set user in context
      const decoded = jwtDecode<DecodedToken>(response.data.token);
      setUserData({
        email: decoded.email,
        firstName: decoded.firstName,
        id: decoded.id,
        lastName: decoded.lastName,
        role: decoded.role
      });
      
      Swal.fire({
        title: 'Logged In',
        text: 'You have successfully logged in!',
        icon: 'success',
        confirmButtonText: 'Continue',
      }).then(() => {
        // After user confirms, navigate to the intended destination
        navigate(from);
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      Swal.fire({
        title: 'Error',
        text: axiosError.response?.data?.message || 'An error occurred',
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login flex justify-center items-center">
        <div className="login__content rounded-lg mt-14 shadow-md p-8 w-full sm:w-96">
          <button className="login__option flex w-full items-center justify-center p-2 border border-black rounded-md mb-4">
            <RiGoogleFill className="mr-2" />
            <h4>Continue with Google</h4>
          </button>

          <button className="login__option flex w-full items-center justify-center p-2 border border-black rounded-md mb-4">
            <RiFacebookFill className="mr-2" />
            <h4>Continue with Facebook</h4>
          </button>

          <form onSubmit={handleSignIn}>
            <div className="login__inputs flex flex-col">
              <input
                type="text"
                placeholder="Email"
                className="mb-2 px-2 py-2 border border-black rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="mb-4 px-2 py-2 border border-black rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-300 text-white font-bold py-2 rounded-md relative"
                disabled={loading}
              >
                {loading && <div className="loader absolute inset-0 bg-black opacity-50"></div>}
                {loading ? 'Loading...' : 'Log In'}
              </button>
            </div>
          </form>
          <div className="login__text text-center mt-4">
            Don't have an account ?{' '}
            <Link to="/sign-up" className="text-blue-500 font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
     
    </>
  );
}
