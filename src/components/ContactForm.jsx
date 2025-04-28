import React, { forwardRef } from 'react';

// form imports
import { useForm } from 'react-hook-form';
import { useContactForm } from '../hooks/useContactForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { contactFormSchema } from '../utils/authValidators';

// animation imports
import { motion } from 'framer-motion';
import { buttonVariants, containerVariants, itemVariants } from '../utils/animationVariants';

import { FiCircle } from 'react-icons/fi';


const ContactForm = forwardRef(({ inView }, ref) => {

    const { sendContactForm, isSubmitting, submitStatus } = useContactForm();
    const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm({
      resolver: yupResolver(contactFormSchema),
      mode: 'onTouched',
      reValidateMode: 'onChange',
      shouldFocusErrors: false,
    });

    // Function to render form fields
    const FormField = ({ type = "text", id, label, placeholder, register, errors, className = "", rows }) => {
    
    const isTextarea = type === 'textarea';
    
    return (
      <div className={`mb-4 ${className}`}>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
        
        {isTextarea ? (
          <textarea
            id={id}
            rows={rows || 6}
            placeholder={placeholder}
            className={`w-full px-3 py-2 rounded-md border ${
              errors[id] ? 'border-red-500' : 'border-blue-800'
            } bg-opacity-20 bg-blue-900 text-white placeholder-[#19297A] focus:outline-none focus:ring-1 focus:ring-blue-400`}
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(5px)"
            }}
            {...register(id)}
          />
        ) : (
          <input
            type={type}
            id={id}
            placeholder={placeholder}
            className={`w-full px-3 py-2 rounded-md border ${
              errors[id] ? 'border-red-500' : 'border-blue-800'
            } bg-opacity-20 bg-blue-900 text-white placeholder-[#19297A] focus:outline-none focus:ring-1 focus:ring-blue-400`}
            style={{
              background: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(5px)"
            }}
            {...register(id)}
          />
        )}
        
        {errors[id] && (
          <p className="mt-1 text-xs text-red-400">{errors[id].message}</p>
        )}
      </div>
    );
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
        className="p-6 lg:p-10 rounded-2xl lg:w-2/5 w-full mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        style={{
            background: "linear-gradient(135deg, rgba(21, 33, 72, 0.95) 0%, rgba(6, 16, 44, 0.95) 100%)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 3px rgba(255, 255, 255, 0.1)",
      }}
    >
      <motion.h2 
        className="text-lg font-semibold mb-2 text-white"
        variants={itemVariants}
      >
        Send us a message
      </motion.h2>
      
      <motion.p 
        className="text-gray-300 mb-6 text-sm"
        variants={itemVariants}
      >
        Fill out the form below and our team will get back to you shortly.
      </motion.p>
      
      <motion.form 
        onSubmit={handleSubmit(onSubmit)}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
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
            className="mb-4"
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <FormField
            type="textarea"
            id="message"
            label="Message"
            placeholder="Please describe your inquiry in detail..."
            register={register}
            errors={errors}
            rows={6}
            className="mb-6"
          />
        </motion.div>
        
        {submitStatus === 'success' && (
          <motion.div 
            className="p-3 mb-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-md text-green-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Your message has been sent successfully! We'll get back to you soon.
          </motion.div>
        )}
        
        {submitStatus === 'error' && (
          <motion.div 
            className="p-3 mb-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-md text-red-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Failed to send your message. Please try again later.
          </motion.div>
        )}
        
        <motion.button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full py-3 rounded-md text-white font-medium text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(90deg, #2563EB 0%, #38BDF8 100%)",
          }}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {isSubmitting ? (
            <span className='flex items-center justify-center'>
             <FiCircle className="animate-spin w-5 h-5 mx-1" />
             Processing...
            </span>
          ) : (
            'Send Message'
          )}
        </motion.button>
      </motion.form>
    </motion.div>
    )
  })
  
  export default ContactForm;