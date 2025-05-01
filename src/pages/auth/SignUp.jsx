import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiMail, FiLock, FiEyeOff, FiEye } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { BsFillWalletFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import threeDElementsImg from '../../assets/Blend_Group_1.svg';
import { signUpSchema } from '../../utils/authValidators';
import { AiOutlineArrowRight } from 'react-icons/ai'; 
import { LuUserRoundPlus } from 'react-icons/lu';
import { toast } from "react-toastify";
import { useSignUp } from '../../hooks/useSignUp';
import { useNavigate } from 'react-router-dom';



const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, isLoading } = useSignUp();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(signUpSchema)
  });



  // eslint-disable-next-line react/prop-types
  function InputComponent({ type, id, className, label, isPasswordField = false, showPassword }) {
    return (
      <>
        <input
          type={isPasswordField ? (showPassword ? 'text' : 'password') : type}
          id={id}
          className={`pl-10 block w-full bg-[#E7FDFF] rounded-md border-[#CCCCCCCC] border p-2 focus:border-teal-500 focus:ring-teal-500 ${className} }`}
          placeholder={`Enter your ${label}`}
          {...register(id)}
        />
        {
          isPasswordField && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff className="text-gray-400" />
              ) : (
                <FiEye className="text-gray-400" />
              )}
            </button>
          )
        }
      </>
    )
  }


  const onSubmit = async (data) => {

    try {
      // Simulate API call or processing
      const success = await signUp(data);
      if (success) {
        navigate('/signin'); // Redirect to sign-in page after successful sign-up
        reset(); // Clear the form after successful submission

      }

      console.log(data);
      // Actual sign-up logic would go here

      // Clear the form after successful submission
      reset();
    } catch (error) {
      console.error('Sign-up error:', error);
      toast.error("Login failed. Please check your credentials.");

    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#E7FDFF]">
      {/* Left Side - Dark teal background with text and images */}
      <div className="hidden md:flex md:w-2/5 bg-[#013237] mih-[screen] rounded-[30px] my-12 ml-8 text-white p-8 flex-col justify-between relative ">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Veritix</h2>
          <button className="md:block relative bg-[#E7FDFF] rounded-[20px] w-[143px] h-[50px] font-medium text-[#013237] text-lg flex items-center">
            <span>Back</span>
            <AiOutlineArrowRight className="text-teal-900 absolute top-3 right-2" size={24} />
          </button>
        </div>

        <div className="mt-20 z-10">
          <h1 className="text-4xl md:text-5xl text-center font-bold mb-4">
            Start Your Event Journey <span className="inline-block">🚀</span>
          </h1>
          <p className="text-lg text-center mb-20">
            Sign up to unlock NFT tickets, crypto rewards, and
            exclusive access. Your adventure in live events and Web3
            begins here!
          </p>
        </div>

        {/* 3D elements positioned at the bottom */}
        <div className="absolute bottom-[-20px] right-0 w-64 h-64">
          {/* Replace with your actual 3D elements image */}
          <div className="w-full h-full bg-contain bg-no-repeat bg-right-bottom"
            style={{ backgroundImage: `url(${threeDElementsImg})` }}>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="md:w-3/5 p-4 md:p-8 lg:p-1 flex flex-col justify-center">
        <div className="max-w-[100%] mx-auto w-full px-5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#013237] mb-8 text-center">Create Your Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name row */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-3">First Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuUserRoundPlus className="text-gray-400" />
                  </div>
                  <InputComponent id="firstName" className="" label="First Name" type="text" />
                </div>
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>

              <div className="flex-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-3">Last Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuUserRoundPlus className="text-gray-400" />
                  </div>
                  <InputComponent id="lastName" label="Lastname" type="text" />
                </div>
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-3">Username</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuUserRoundPlus className="text-gray-400" />
                </div>
                <InputComponent id="username" label="Username" type="text" />
              </div>
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-3">Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <InputComponent id="email" label="Email Address" type="email" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-3">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <InputComponent
                  id="password"
                  label="Password"
                  type="password"
                  isPasswordField={true}
                  showPassword={showPassword}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Sign Up Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${isLoading
                    ? 'bg-teal-600 cursor-not-allowed'
                    : 'bg-[#013237] hover:bg-teal-800'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating your Account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#E7FDFF] text-[#013237]">or register with</span>
            </div>
          </div>

          {/* Social Sign Up */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-[#013237] rounded-md shadow-sm text-sm font-bold text-[#013237]"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              Google
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-[#013237] rounded-md shadow-sm text-sm font-bold text-gray-700"
            >
              <BsFillWalletFill className="h-5 w-5 mr-2 text-teal-900" />
              Wallet
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="font-bold text-teal-900 hover:text-[#013237]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
