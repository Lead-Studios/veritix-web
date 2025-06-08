import { forwardRef } from "react";
import PropTypes from "prop-types";

// form imports
import { useForm } from "react-hook-form";
import { useContactForm } from "../hooks/useContactForm";
import { yupResolver } from "@hookform/resolvers/yup";
import { contactFormSchema } from "../utils/authValidators";

// animation imports
import { motion } from "framer-motion";
import {
  buttonVariants,
  containerVariants,
  itemVariants,
} from "../utils/animationVariants";

import { FiCircle, FiSend } from "react-icons/fi";

const ContactForm = forwardRef(({ inView }, ref) => {
  const { sendContactForm, isSubmitting, submitStatus } = useContactForm();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(contactFormSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    shouldFocusErrors: false,
  });

  // Function to render form fields
  const FormField = ({
    type = "text",
    id,
    label,
    placeholder,
    register,
    errors,
    className = "",
    rows,
  }) => {
    const isTextarea = type === "textarea";

    return (
      <div className={`mb-6 ${className}`}>
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-200 mb-3 tracking-wide"
        >
          {label}
        </label>

        <div className="relative">
          {isTextarea ? (
            <textarea
              id={id}
              rows={rows || 6}
              placeholder={placeholder}
              className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                errors[id]
                  ? "border-red-400 focus:border-red-500 bg-red-500/5"
                  : "border-gray-600 focus:border-blue-400 hover:border-gray-500"
              } bg-slate-800/50 text-white placeholder-gray-400 focus:outline-none resize-none`}
              {...register(id)}
            />
          ) : (
            <input
              type={type}
              id={id}
              placeholder={placeholder}
              className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 ${
                errors[id]
                  ? "border-red-400 focus:border-red-500 bg-red-500/5"
                  : "border-gray-600 focus:border-blue-400 hover:border-gray-500"
              } bg-slate-800/50 text-white placeholder-gray-400 focus:outline-none`}
              {...register(id)}
            />
          )}
        </div>

        {errors[id] && (
          <motion.p
            className="mt-2 text-sm text-red-400 flex items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
            {errors[id].message}
          </motion.p>
        )}
      </div>
    );
  };

  // Add PropTypes for FormField
  FormField.propTypes = {
    type: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    register: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    className: PropTypes.string,
    rows: PropTypes.number,
  };

  // Function to handle form submission
  const onSubmit = async (data) => {
    const success = await sendContactForm(data);
    if (success) {
      reset();
    }
  };

  return (
    <motion.div
      ref={ref}
      className="relative lg:w-2/5 w-full mx-auto flex"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <div
        className="w-full p-8 lg:p-12 rounded-3xl border border-gray-700 flex flex-col"
        style={{
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 50%, rgba(51, 65, 85, 0.9) 100%)",
        }}
      >
        <motion.h2
          className="text-3xl font-bold mb-3 text-white"
          variants={itemVariants}
        >
          Send us a message
        </motion.h2>

        <motion.p
          className="text-gray-300 mb-8 text-lg leading-relaxed"
          variants={itemVariants}
        >
          Fill out the form below and our team will get back to you shortly.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          variants={containerVariants}
          className="space-y-6 flex-1 flex flex-col"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <FormField
                id="name"
                label="Name"
                placeholder="Your Name"
                register={register}
                errors={errors}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <FormField
                type="email"
                id="email"
                label="Email"
                placeholder="your.email@example.com"
                register={register}
                errors={errors}
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <FormField
              id="subject"
              label="Subject"
              placeholder="What is your inquiry about"
              register={register}
              errors={errors}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="flex-1">
            <FormField
              type="textarea"
              id="message"
              label="Message"
              placeholder="Please describe your inquiry in detail..."
              register={register}
              errors={errors}
              rows={6}
            />
          </motion.div>

          {submitStatus === "success" && (
            <motion.div
              className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl text-green-300"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                Your message has been sent successfully! We&apos;ll get back to
                you soon.
              </div>
            </motion.div>
          )}

          {submitStatus === "error" && (
            <motion.div
              className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-300"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                Failed to send your message. Please try again later.
              </div>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="relative w-full py-4 rounded-xl text-white font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
            style={{
              background:
                "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e40af 100%)",
            }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <FiCircle className="animate-spin w-5 h-5 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Send Message
                  <FiSend className="w-5 h-5 ml-2" />
                </>
              )}
            </span>
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
});

// Add display name for the forwardRef component
ContactForm.displayName = "ContactForm";

// Add PropTypes for the main component
ContactForm.propTypes = {
  inView: PropTypes.bool.isRequired,
};

export default ContactForm;
