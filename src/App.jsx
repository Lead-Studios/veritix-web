import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
import Events from "./pages/Events";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Help from "./pages/Help";
import LandingLayout from "./components/Layout/LandingLayout";
import AuthLayout from "./components/Layout/AuthLayout";
import SignInForm from "./pages/auth/SignIn";
import SignUpForm from "./pages/auth/SignUp";
import CategoryDetail from "./pages/CategoryDetail";
import CreateTicket from "./pages/Create-Ticket";
import ForgotForm from "./pages/auth/Forgot-Password";
import PasswordReset from "./pages/auth/Reset-Password";
import EventDetail from "./components/events/EventDetail";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();
// Add this import
import { AuthProvider } from "./hooks/auth";

// Wrap your app with AuthProvider
function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <>
          <ScrollToTop />
          <Routes>
            {/* Landing pages with Navbar */}
            <Route element={<LandingLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Events />} />
              <Route path="/how-it-works" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/help" element={<Help />} />
              <Route path="/category/:id" element={<CategoryDetail />} />
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/event/:eventId" element={<EventDetail />} />
            </Route>
            {/* Auth pages without Navbar */}
            <Route element={<AuthLayout />}>
              <Route path="/signin" element={<SignInForm />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/forgot-password" element={<ForgotForm />} />
              <Route path="/reset-password" element={<PasswordReset />} />
            </Route>
          </Routes>
        </>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
