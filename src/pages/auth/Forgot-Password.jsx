import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '../../utils/authValidators';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthInnerLayout from '../../components/Layout/AuthInnerLayout';
import InputComponent from '../../components/Input';
import { FiMail } from 'react-icons/fi';
import { useForgotPassword } from '../../hooks/auth';

export default function ForgotForm() {
  const forgotPassword = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const navigate = useNavigate();
  const onSubmit = (data) => {
    try {
      const { email } = data;
      // const response = forgotPassword.mutateAsync(email);
      navigate('/reset-password');
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.dismiss()
      console.error('Forgot password error:', error);
      toast.error('Forgot password failed. Please try again.');
    }
  };

  return (
    <AuthInnerLayout>
      <div className="flex flex-col items-center justify-between w-full">
        <div className=" mb-[60px] mt-[20px] md:mt-[71px] md:mb-[122px] text-center">
          <h1 className="font-poly text-4xl font-bold text-[#000625]">
            Forgot Password
          </h1>
          <p className="text-sm font-light text-center text-black/40">
            No worries, we'll help you reset it and get you back to your events
            in no time.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-16">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="font-dm-sans block text-[#121212]"
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
                placeholder="Enter your registred email address"
                register={register}
              />
            </div>
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={forgotPassword.isPending}
            className="w-full text-xl font-poly rounded-md bg-[linear-gradient(274.96deg,_#1E3A8A_-12.07%,_#0A1854_36.94%,_#000625_85.96%)] hover:opacity-80 py-4 text-center font-bold text-white transition-colors "
          >
            Send Magic Link
          </button>
        </form>

        <div className="flex flex-col items-center justify-start flex-1 w-full mt-5"></div>
      </div>
    </AuthInnerLayout>
  );
}
