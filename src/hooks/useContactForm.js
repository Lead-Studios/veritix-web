import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const publicKey = 'your_public_key_here';
  
  useEffect(() => {
    emailjs.init(publicKey);
  }, []);

  const sendContactForm = async (formData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const serviceId = 'your_service_id_here';
      const templateId = 'your_template_id_here';
      
      await emailjs.send(serviceId, templateId, formData);
      
      toast.success('Message sent successfully!');
      setSubmitStatus('success');
      return true;
    } catch (err) {
      console.error('EmailJS Error:', err);
      const errorMessage = err.message || 'Failed to send message. Please try again.';
      setSubmitStatus('error');
      toast.dismiss()
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
      
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  return { sendContactForm, isSubmitting, submitStatus };
};