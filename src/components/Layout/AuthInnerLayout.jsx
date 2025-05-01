import { NavLink } from 'react-router-dom';
import { ArrowRightIcon } from '../../icons/ArrowRightIcon';

const AuthInnerLayout = ({ children, isLeft = false }) => {
  return (
    <div
      className={`relative flex items-start justify-between w-full min-h-full gap-6 px-8 py-8 mx-auto overflow-hidden ${
        isLeft ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Left Section - Login Form */}
      <div className="flex w-full h-full md:w-1/2 ">{children}</div>
      {/* Right Section - Image */}
      <div className="relative flex-grow-0 hidden w-1/2 h-full rounded-3xl md:block">
        {/* Background Image */}
        <img
          src={'/Images/sign_asset_1.svg'}
          alt="Veritixlogo"
          className="object-cover w-full h-full rounded-3xl signin-img"
        />
        <div className="absolute inset-0 z-0 flex flex-col w-full h-full px-10 rounded-3xl py-9">
          <div className="flex items-center justify-between w-full">
            <img
              src={'/veritix_logo.svg'}
              alt="Veritixlogo"
              className="w-16 h-8"
            />
            <NavLink
              to="/"
              className="rounded-3xl font-poly flex justify-between items-center gap-4 text-2xl text-[#013237] bg-[#E7FDFF] py-3 px-6"
            >
              Back
              <ArrowRightIcon />
            </NavLink>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 gap-5 mt-10 mb-0">
            <h1 className="text-[56px] leading-[56px] font-medium text-center text-white">
              Start Your Event Journey 🚀
            </h1>
            <p className="text-xl font-light text-center text-white">
              Sign up to unlock NFT tickets, crypto rewards, and exclusive
              access. Your adventure in live events and Web3 begins here!
            </p>
          </div>
        </div>
      </div>
      <img
        src={'/Images/sign_asset_2.svg'}
        alt="Veritixlogo"
        className={`absolute bottom-0  hidden md:block ${
          isLeft ? 'left-1/2 -translate-x-2/3' : 'right-0  translate-x-16'
        }`}
      />
    </div>
  );
};

export default AuthInnerLayout;
