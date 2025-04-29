import { useState } from 'react';
import PropTypes from 'prop-types';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function InputComponent({
  type,
  id,
  className = '',
  label,
  register,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <input
        type={showPassword ? 'text' : type}
        id={id}
        name={id}
        className={`pl-10 block w-full bg-[#E7FDFF] rounded-md border-[#CCCCCCCC] border p-2 focus:border-teal-500 focus:ring-teal-500 ${className}`}
        placeholder={`Enter your ${label}`}
        {...(register ? register(id) : {})}
        {...rest}
      />
      {type === 'password' && (
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
      )}
    </>
  );
}

InputComponent.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  register: PropTypes.func,
};

InputComponent.defaultProps = {
  className: '',
};
