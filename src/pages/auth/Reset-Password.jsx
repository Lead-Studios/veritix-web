import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { resetPasswordSchema } from '../../utils/authValidators';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useResetPassword } from '../../hooks/auth';
import AuthInnerLayout from '../../components/Layout/AuthInnerLayout';
import InputComponent from '../../components/Input';
import { FiMail } from 'react-icons/fi';

export default function PasswordReset() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });
  const resetPassword = useResetPassword();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    try {
      const response = resetPassword.mutateAsync(data);
      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Password reset failed. Please try again.');
    }
  };

  return (
    <AuthInnerLayout>
      <div className="flex flex-col items-center justify-between w-full">
        <div className=" mb-[60px] mt-[20px] md:mt-[71px] md:mb-[122px]">
          <h1 className="font-poly text-4xl font-bold text-[#000625]">
            Create a New Password
          </h1>
          <p className="text-sm font-light text-center text-black/40">
            Make it strong, make it secure. 🔒
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-16">
          <div className="space-y-2">
            <label
              htmlFor="new_password"
              className="font-dm-sans block text-[#121212]"
            >
              New Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <InputComponent
                id="new_password"
                className=""
                label="New Address"
                type="password"
                placeholder="***********"
                register={register}
              />
            </div>
            {errors.new_password && (
              <span className="text-red-500">
                {errors.new_password.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="confirm_password"
              className="font-dm-sans block text-[#121212]"
            >
              Confirm Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <InputComponent
                id="confirm_password"
                className=""
                label="Confirm Password"
                type="password"
                placeholder="***********"
                register={register}
              />
            </div>
            {errors.email && (
              <span className="text-red-500">
                {errors.confirm_password.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full text-xl font-poly rounded-md bg-[linear-gradient(274.96deg,_#1E3A8A_-12.07%,_#0A1854_36.94%,_#000625_85.96%)] hover:opacity-80 py-4 text-center font-bold text-white transition-colors "
          >
            Reset Password
          </button>
        </form>

        <div className="flex flex-col items-center justify-start flex-1 w-full mt-5"></div>
      </div>
    </AuthInnerLayout>
  );
}
