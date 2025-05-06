import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// This component will scroll the window to the top when the route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top with smooth behavior
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [pathname]);

  return null; // This component doesn't render anything
}

export default ScrollToTop; 