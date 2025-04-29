import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Help from './pages/Help';
import LandingLayout from './components/Layout/LandingLayout';
import AuthLayout from './components/Layout/AuthLayout';
import SignInForm from './pages/auth/SignIn';
import SignUpForm from './pages/auth/SignUp';

const queryClient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Landing pages with Navbar */}
          <Route element={<LandingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/upcoming-events" element={<Events />} />
            <Route path="/how-it-works" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/help" element={<Help />} />
          </Route>

          {/* Auth pages without Navbar */}
          <Route element={<AuthLayout />}>
            <Route path="/signin" element={<SignInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
