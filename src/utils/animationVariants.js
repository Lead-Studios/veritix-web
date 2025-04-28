export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  export const iconHoverVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "#7959fa33",
      transition: {
        duration: 0.2
      }
    }
  };

  export const buttonVariants = {
    hover: { 
      scale: 1.03,
    },
    tap: { 
      scale: 0.97
    },
    disabled: {
      opacity: 0.6
    }
  };