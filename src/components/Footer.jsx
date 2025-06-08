// import React from "react";
import { Link } from "react-router-dom";
import { IoTicket } from "react-icons/io5";
import styled from "styled-components";

// Styled Subscribe Input Component
const SubscribeInput = () => {
  return (
    <StyledWrapper>
      <div className="input-wrapper">
        <svg
          className="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g data-name="Layer 2">
            <g data-name="inbox">
              <rect
                width={24}
                height={24}
                transform="rotate(180 12 12)"
                opacity={0}
              />
              <path d="M20.79 11.34l-3.34-6.68A3 3 0 0 0 14.76 3H9.24a3 3 0 0 0-2.69 1.66l-3.34 6.68a2 2 0 0 0-.21.9V18a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5.76a2 2 0 0 0-.21-.9zM8.34 5.55a1 1 0 0 1 .9-.55h5.52a1 1 0 0 1 .9.55L18.38 11H16a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 0-1-1H5.62z" />
            </g>
          </g>
        </svg>
        <input
          type="email"
          name="email"
          className="input"
          placeholder="info@gmail.com"
        />
        <button className="Subscribe-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={30}
            height={10}
            viewBox="0 0 38 15"
            className="arrow"
          >
            <path d="M10 7.519l-.939-.344h0l.939.344zm14.386-1.205l-.981-.192.981.192zm1.276 5.509l.537.843.148-.094.107-.139-.792-.611zm4.819-4.304l-.385-.923h0l.385.923zm7.227.707a1 1 0 0 0 0-1.414L31.343.448a1 1 0 0 0-1.414 0 1 1 0 0 0 0 1.414l5.657 5.657-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364zM1 7.519l.554.833.029-.019.094-.061.361-.23 1.277-.77c1.054-.609 2.397-1.32 3.629-1.787.617-.234 1.17-.392 1.623-.455.477-.066.707-.008.788.034.025.013.031.021.039.034a.56.56 0 0 1 .058.235c.029.327-.047.906-.39 1.842l1.878.689c.383-1.044.571-1.949.505-2.705-.072-.815-.45-1.493-1.16-1.865-.627-.329-1.358-.332-1.993-.244-.659.092-1.367.305-2.056.566-1.381.523-2.833 1.297-3.921 1.925l-1.341.808-.385.245-.104.068-.028.018c-.011.007-.011.007.543.84zm8.061-.344c-.198.54-.328 1.038-.36 1.484-.032.441.024.94.325 1.364.319.45.786.64 1.21.697.403.054.824-.001 1.21-.09.775-.179 1.694-.566 2.633-1.014l3.023-1.554c2.115-1.122 4.107-2.168 5.476-2.524.329-.086.573-.117.742-.115s.195.038.161.014c-.15-.105.085-.139-.076.685l1.963.384c.192-.98.152-2.083-.74-2.707-.405-.283-.868-.37-1.28-.376s-.849.069-1.274.179c-1.65.43-3.888 1.621-5.909 2.693l-2.948 1.517c-.92.439-1.673.743-2.221.87-.276.064-.429.065-.492.057-.043-.006.066.003.155.127.07.099.024.131.038-.063.014-.187.078-.49.243-.94l-1.878-.689zm14.343-1.053c-.361 1.844-.474 3.185-.413 4.161.059.95.294 1.72.811 2.215.567.544 1.242.546 1.664.459a2.34 2.34 0 0 0 .502-.167l.15-.076.049-.028.018-.011c.013-.008.013-.008-.524-.852l-.536-.844.019-.012c-.038.018-.064.027-.084.032-.037.008.053-.013.125.056.021.02-.151-.135-.198-.895-.046-.734.034-1.887.38-3.652l-1.963-.384zm2.257 5.701l.791.611.024-.031.08-.101.311-.377 1.093-1.213c.922-.954 2.005-1.894 2.904-2.27l-.771-1.846c-1.31.547-2.637 1.758-3.572 2.725l-1.184 1.314-.341.414-.093.117-.025.032c-.01.013-.01.013.781.624zm5.204-3.381c.989-.413 1.791-.42 2.697-.307.871.108 2.083.385 3.437.385v-2c-1.197 0-2.041-.226-3.19-.369-1.114-.139-2.297-.146-3.715.447l.771 1.846z" />
          </svg>
          Subscribe
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .input-wrapper {
    width: fit-content;
    height: 45px;
    border-radius: 20px;
    padding: 5px;
    box-sizing: content-box;
    display: flex;
    align-items: center;
    background-color: #1a1a2e;
    border: 1px solid rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
  }

  .input-wrapper:hover {
    border-color: rgba(59, 130, 246, 0.6);
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
  }

  .icon {
    width: 30px;
    fill: rgb(255, 255, 255);
    margin-left: 8px;
    transition: all 0.3s;
  }

  .input {
    max-width: 170px;
    height: 100%;
    border: none;
    outline: none;
    padding-left: 15px;
    background-color: transparent;
    color: white;
    font-size: 1em;
  }

  .input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #1a1a2e inset;
    -webkit-text-fill-color: #ffffff;
  }

  .Subscribe-btn {
    height: 100%;
    width: 95px;
    border: none;
    border-radius: 15px;
    color: rgb(0, 0, 0);
    cursor: pointer;
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    font-weight: 500;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.3s;
  }

  .arrow {
    position: absolute;
    margin-right: 150px;
    transition: all 0.3s;
    fill: white;
  }

  .input-wrapper:active .icon {
    transform: scale(1.3);
  }

  .Subscribe-btn:hover {
    color: white;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  }

  .Subscribe-btn:hover .arrow {
    margin-right: 0;
    animation: jello-vertical 0.9s both;
    transform-origin: right;
  }

  @keyframes jello-vertical {
    0% {
      transform: scale3d(1, 1, 1);
    }
    30% {
      transform: scale3d(0.75, 1.25, 1);
    }
    40% {
      transform: scale3d(1.25, 0.75, 1);
    }
    50% {
      transform: scale3d(0.85, 1.15, 1);
    }
    65% {
      transform: scale3d(1.05, 0.95, 1);
    }
    75% {
      transform: scale3d(0.95, 1.05, 1);
    }
    100% {
      transform: scale3d(1, 1, 1);
    }
  }

  .Subscribe-btn:active {
    transform: scale(0.9);
  }
`;

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#000625] via-[#0a0a2e] to-[#000625] text-[#E7FDFF] py-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-wrap gap-8">
          {/* Brand Section */}
          <div className="w-full lg:w-[320px]">
            <div className="flex items-center space-x-1 mb-6">
              <div className="relative">
                <IoTicket className="w-5 h-5 sm:w-8 sm:h-7 rotate-[80deg] text-blue-400 drop-shadow-lg" />
                <div className="absolute inset-0 w-5 h-5 sm:w-8 sm:h-7 rotate-[80deg] bg-blue-400/20 blur-sm"></div>
              </div>
              <img
                src={"/veritix_logo.svg"}
                alt="Veritix logo"
                className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-lg"
              />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-md:w-full max-lg:w-[70%] mb-6">
              Your gateway to unforgettable events—live, virtual, or in the
              metaverse. Discover, own, and trade NFT tickets, earn crypto
              rewards, and join a community of event lovers. The future of
              ticketing starts here.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-blue-600 hover:to-blue-500 transition-all duration-300 transform hover:scale-110"
              >
                <img
                  src={"/Images/x_logo.svg"}
                  alt="Twitter"
                  className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-indigo-600 hover:to-purple-500 transition-all duration-300 transform hover:scale-110"
              >
                <img
                  src={"/Images/discord_logo.svg"}
                  alt="Discord"
                  className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-blue-600 hover:to-blue-400 transition-all duration-300 transform hover:scale-110"
              >
                <img
                  src={"/Images/facebook_logo.svg"}
                  alt="Facebook"
                  className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>

          {/* Links Sections Container */}
          <div className="flex flex-1 flex-wrap gap-8 justify-between">
            {/* Quick Links */}
            <div className="max-[575px]:w-[180px] max-md:w-[160px] max-[812px]:w-[200px]">
              <h4 className="font-semibold mb-6 text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Quick Links
              </h4>
              <div className="flex flex-col space-y-3 text-sm text-gray-300">
                <Link
                  to="/attendees"
                  className="hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  Attendees
                </Link>
                <Link
                  to="/organiser"
                  className="hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  Organiser
                </Link>
                <Link
                  to="/promoters"
                  className="hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  Promoters
                </Link>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  How it Works
                </Link>
              </div>
            </div>

            {/* Plan Events */}
            <div className="max-[575px]:w-[180px] max-md:w-[160px] max-[812px]:w-[200px]">
              <h4 className="font-semibold mb-6 text-lg bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Plan Events
              </h4>
              <div className="flex flex-col space-y-3 text-sm text-gray-300">
                <Link
                  to="/create-and-setup"
                  className="hover:text-green-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  Create and Setup
                </Link>
                <Link
                  to="/sell-tickets"
                  className="hover:text-green-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  Sell Tickets
                </Link>
                <Link
                  to="/online-rsvp"
                  className="hover:text-green-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  Online RSVP
                </Link>
                <Link
                  to="/online-event"
                  className="hover:text-green-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  Online Event
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="max-[575px]:w-[180px] max-md:w-[160px] max-[812px]:w-[200px]">
              <h4 className="font-semibold mb-6 text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Legal
              </h4>
              <div className="flex flex-col space-y-3 text-sm text-gray-300">
                <Link
                  to="/privacy-policy"
                  className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/cookie-policy"
                  className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  Cookie Policy
                </Link>
                <Link
                  to="/host-events"
                  className="hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 transform"
                >
                  Host Events
                </Link>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="max-w-full md:max-w-[360px] w-full lg:max-w-[480px] min-[1180px]:max-w-[360px]">
              <h4 className="font-semibold mb-3 text-lg bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Never Miss an Event
              </h4>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                Get updates on trending events, exclusive NFT drops, and crypto
                rewards straight to your inbox.
              </p>
              <SubscribeInput />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gradient-to-r from-transparent via-blue-500/30 to-transparent">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              Copyright © {new Date().getFullYear()} Veritix. All rights
              reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link
                to="/privacy"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Terms
              </Link>
              <Link
                to="/cookies"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
