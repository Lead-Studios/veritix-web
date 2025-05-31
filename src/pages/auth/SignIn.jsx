import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../../utils/authValidators";
import { UserIcon } from "../../icons/UserIcon";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLogin } from "../../hooks/auth";
import AuthInnerLayout from "../../components/Layout/AuthInnerLayout";
// NOTE: This is the SignInForm component
// It should be further designed and styled as per the required UI design, this is just a basic implementation
// to show how the form works with the created validations
export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });
  const login = useLogin();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const response = await login.mutateAsync({ email, password });
      if (response.status === 200) {
        toast.success("Successfully signed in!");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <AuthInnerLayout>
      <div className="flex flex-col items-center justify-between w-full">
        <h1 className="font-poly mb-[60px] mt-[20px] md:mt-[71px] md:mb-[122px] text-4xl font-bold text-[#000625]">Welcome Back</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-16">
          <div className="space-y-2">
            <label htmlFor="email" className="font-dm-sans block text-[#121212]">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 flex items-center left-3">
                <UserIcon className="h-5 w-5 text-[#666666]" />
              </div>
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your Email Address"
                className="w-full rounded-md border border-[#cccccc] bg-transparent py-3 pl-10 pr-3 text-[#121212] focus:border-[#013237] focus:outline-none"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-[#121212]">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-[#013237] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 flex items-center left-3">
                <UserIcon className="h-5 w-5 text-[#666666]" />
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your Password"
                className="w-full rounded-md border border-[#cccccc] bg-transparent py-3 pl-10 pr-3 text-[#121212] focus:border-[#013237] focus:outline-none"
                disabled={isSubmitting}
              />
            </div>
            {errors.password && <span className="block text-red-500">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || login.isLoading}
            className="w-full text-xl font-poly rounded-md bg-[linear-gradient(274.96deg,_#1E3A8A_-12.07%,_#0A1854_36.94%,_#000625_85.96%)] hover:opacity-80 py-4 text-center font-bold text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting || login.isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="flex flex-col items-center justify-start flex-1 w-full mt-5">
          <p className="">
            Don't have an account?
            <Link to="/signup" className="inline ml-1 font-bold text-[#013237] hover:text-[#000625]">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </AuthInnerLayout>
  );
}
