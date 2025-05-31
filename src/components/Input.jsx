import { useState } from "react";
import PropTypes from "prop-types";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function InputComponent({ type, id, className = "", label, register, isPasswordField, ...rest }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <input
        type={showPassword ? "text" : type}
        id={id}
        name={id}
        className={`pl-10 block w-full bg-transparent rounded-md border-[#CCCCCCCC] border p-2 focus:border-[#000625] focus:ring-0 focus:outline-none ${className}`}
        {...(register ? register(id) : {})}
        {...rest}
        placeholder={rest?.placeholder || `Enter your ${label}`}
      />
      {type === "password" && (
        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FiEyeOff className="text-gray-400" /> : <FiEye className="text-gray-400" />}
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
  isPasswordField: PropTypes.bool,
};

InputComponent.defaultProps = {
  className: "",
};
