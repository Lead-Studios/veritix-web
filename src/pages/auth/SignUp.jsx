import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { BsFillWalletFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { signUpSchema } from '../../utils/authValidators';
import { LuUserRoundPlus } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '../../hooks/auth';
import InputComponent from '../../components/Input';
import AuthInnerLayout from '../../components/Layout/AuthInnerLayout';

const SignUpPage = () => {
  const signUp = useSignUp();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      // Simulate API call or processing
      const response = await signUp.mutateAsync(data);
      if (response.status === 200) {
        navigate('/signin'); // Redirect to sign-in page after successful sign-up
        reset(); // Clear the form after successful submission
      }

      console.log(data);
      reset();
    } catch (error) {
      console.error('Sign-up error:', error);
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <AuthInnerLayout isLeft>
      {/* Right Side - Sign Up Form */}
      <div className="flex flex-col items-center justify-between w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-[#000625] mb-8 text-center">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          {/* Name row */}
          <div className="w-full flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-[#121212] mb-3"
              >
                First Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuUserRoundPlus className="text-gray-400" />
                </div>
                <InputComponent
                  id="firstName"
                  className=""
                  label="First Name"
                  type="text"
                  register={register}
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-[#121212] mb-3"
              >
                Last Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuUserRoundPlus className="text-gray-400" />
                </div>
                <InputComponent
                  id="lastName"
                  label="Lastname"
                  type="text"
                  register={register}
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[#121212] mb-3"
            >
              Username
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LuUserRoundPlus className="text-gray-400" />
              </div>
              <InputComponent
                id="username"
                label="Username"
                type="text"
                register={register}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#121212] mb-3"
            >
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <InputComponent
                id="email"
                className=""
                label="Email Address"
                type="email"
                register={register}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#121212] mb-3"
            >
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <InputComponent
                id="password"
                label="Password"
                type="password"
                isPasswordField={true}
                register={register}
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* background: linear-gradient(274.96deg, #1E3A8A -12.07%, #0A1854 36.94%, #000625 85.96%);
background: linear-gradient(274.96deg, #1E3A8A -12.07%, #0A1854 36.94%, #000625 85.96%);
[25deg,red_5%,yellow_60%,lime_90%,teal]
           */}
          {/* Sign Up Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={signUp.isPending}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                  ${
                    signUp.isPending
                      ? 'bg-teal-600 cursor-not-allowed'
                      : 'bg-[linear-gradient(274.96deg,_#1E3A8A_-12.07%,_#0A1854_36.94%,_#000625_85.96%)] hover:opacity-80'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
            >
              {signUp.isPending ? (
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
        <div className="mt-8 relative w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#E6EAFF] text-[#013237]">
              or register with
            </span>
          </div>
        </div>

        {/* Social Sign Up */}
        <div className="mt-6 grid grid-cols-2 gap-3 w-full">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-[#013237] rounded-md shadow-sm text-sm font-bold text-[#013237]"
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            Google
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-[#013237] rounded-md shadow-sm text-sm font-bold text-[#121212]"
          >
            <BsFillWalletFill className="h-5 w-5 mr-2 text-teal-900" />
            Wallet
          </button>
        </div>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="font-bold text-teal-900 hover:text-[#013237]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthInnerLayout>
  );
};

export default SignUpPage;
