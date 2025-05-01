import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { signInSchema } from '../../utils/authValidators';
import { UserIcon } from '../../icons/UserIcon';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from '../../icons/ArrowRightIcon';
import { useForgotPassword } from '../../hooks/useForgotPassword';
import { toast } from 'react-toastify';
import { useLogin } from '../../hooks/auth';
// NOTE: This is the SignInForm component
// It should be further designed and styled as per the required UI design, this is just a basic implementation
// to show how the form works with the created validations
export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });
  const login = useLogin();
  const { forgotPassword } = useForgotPassword();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    try {
      const { email, password } = data;
      const response = login.mutateAsync({ email, password });
      if (response.status === 200) {
        navigate('/');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    forgotPassword();
  };

  return (
    <div className="relative flex items-start justify-between w-full min-h-full gap-6 px-8 py-8 mx-auto overflow-hidden max-w-7xl">
      {/* Left Section - Login Form */}
      <div className="flex w-full h-full md:w-1/2 ">
        <div className="flex flex-col items-center justify-between w-full">
          <h1 className="font-poly mb-[60px] mt-[20px] md:mt-[71px] md:mb-[122px] text-4xl font-bold text-[#013237]">
            Welcome Back
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-16">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="font-dm-sans block text-[#121212]"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex items-center left-3">
                  <UserIcon className="h-5 w-5 text-[#666666]" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Enter your Email Address"
                  className="w-full rounded-md border border-[#cccccc] bg-transparent py-3 pl-10 pr-3 text-[#121212] focus:border-[#013237] focus:outline-none"
                />
              </div>
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-[#121212]">
                  Password
                </label>
                <Link
                  to="#"
                  onClick={handleForgotPassword}
                  className="text-sm text-[#013237] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 flex items-center left-3">
                  <UserIcon className="h-5 w-5 text-[#666666]" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  placeholder="Enter your Password"
                  className="w-full rounded-md border border-[#cccccc] bg-transparent py-3 pl-10 pr-3 text-[#121212] focus:border-[#013237] focus:outline-none"
                />
              </div>
              {errors.password && (
                <span className="block text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full text-xl font-poly rounded-md bg-[#013237] py-4 text-center font-bold text-white transition-colors hover:bg-[#013237]/90"
            >
              Sign In
            </button>
          </form>

          <div className="flex flex-col items-center justify-start flex-1 w-full mt-5">
            <p className="">
              Already have an account ?
              <NavLink to="/signup" className="inline ml-1 font-bold">
                Sign Up
              </NavLink>
            </p>
          </div>
        </div>
      </div>
      {/* Right Section - Image */}
      <div className="relative flex-grow-0 hidden w-1/2 h-full rounded-3xl md:block">
        {/* Background Image */}
        <img
          src={'/Images/sign_asset_1.svg'}
          alt="Veritixlogo"
          className="object-cover w-full h-full rounded-3xl signin-img"
        />
        <div className="absolute inset-0 z-0 flex flex-col w-full h-full px-10 rounded-3xl py-9">
          <div className="flex items-center justify-between w-full">
            <img
              src={'/veritix_logo.svg'}
              alt="Veritixlogo"
              className="w-16 h-8"
            />
            <NavLink
              to="/"
              className="rounded-3xl font-poly flex justify-between items-center gap-4 text-2xl text-[#013237] bg-[#E7FDFF] py-3 px-6"
            >
              Back
              <ArrowRightIcon />
            </NavLink>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 gap-5 mt-10 mb-0">
            <h1 className="text-[56px] leading-[56px] font-medium text-center text-white">
              Start Your Event Journey 🚀
            </h1>
            <p className="text-xl font-light text-center text-white">
              Sign up to unlock NFT tickets, crypto rewards, and exclusive
              access. Your adventure in live events and Web3 begins here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
