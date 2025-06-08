// import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import TrendingCards from "./cards/TrendingCards";
import { getTrendingEvents } from "../data/events";
// import DIvSkeleton from "./skeleton/DIvSkeleton";

const DropdownButton = ({ label, options }) => {
  return (
    <StyledWrapper>
      <div className="menu">
        <div className="item">
          <a href="#" className="link">
            <span>{label}</span>
            <svg viewBox="0 0 24 24" xmlSpace="preserve">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </a>
          <div className="submenu">
            {options.map((option, index) => (
              <div key={index} className="submenu-item">
                <a href="#" className="submenu-link">
                  {option}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

DropdownButton.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const StyledWrapper = styled.div`
  .menu {
    font-size: 14px;
    line-height: 1.6;
    color: #000000;
    width: fit-content;
    display: flex;
    list-style: none;
  }

  @media (min-width: 640px) {
    .menu {
      font-size: 16px;
    }
  }

  .menu a {
    text-decoration: none;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  .menu .link {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    background: #00adff;
    color: white;
    font-weight: 500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    box-shadow: 0 4px 15px 0 rgba(0, 173, 255, 0.3);
  }

  @media (min-width: 640px) {
    .menu .link {
      gap: 8px;
      padding: 12px 24px;
      border-radius: 16px;
    }
  }

  .menu .link::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #0088cc;
    z-index: -1;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .menu .link svg {
    width: 10px;
    height: 10px;
    fill: white;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    margin-left: 2px;
  }

  @media (min-width: 640px) {
    .menu .link svg {
      width: 12px;
      height: 12px;
      margin-left: 4px;
    }
  }

  .menu .item {
    position: relative;
  }

  .menu .item .submenu {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 100%;
    border-radius: 0 0 12px 12px;
    left: 0;
    width: 100%;
    overflow: hidden;
    border: 1px solid #cccccc;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-12px);
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 9999;
    pointer-events: none;
    list-style: none;
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  @media (min-width: 640px) {
    .menu .item .submenu {
      border-radius: 0 0 16px 16px;
    }
  }

  .menu .item:hover .submenu {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
    border-top: transparent;
    border-color: #00adff;
  }

  .menu .item:hover .link {
    color: #ffffff;
    border-radius: 12px 12px 0 0;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px 0 rgba(0, 173, 255, 0.4);
  }

  @media (min-width: 640px) {
    .menu .item:hover .link {
      border-radius: 16px 16px 0 0;
    }
  }

  .menu .item:hover .link::after {
    transform: scaleX(1);
    transform-origin: right;
  }

  .menu .item:hover .link svg {
    fill: #ffffff;
    transform: rotate(-180deg);
  }

  .submenu .submenu-item {
    width: 100%;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .submenu .submenu-link {
    display: block;
    padding: 8px 16px;
    width: 100%;
    position: relative;
    text-align: center;
    transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
    color: #333;
    font-weight: 400;
    font-size: 14px;
  }

  @media (min-width: 640px) {
    .submenu .submenu-link {
      padding: 12px 24px;
      font-size: 16px;
    }
  }

  .submenu .submenu-item:last-child .submenu-link {
    border-bottom: none;
  }

  .submenu .submenu-link::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    transform: scaleX(0);
    width: 100%;
    height: 100%;
    background: #00adff;
    z-index: -1;
    transform-origin: left;
    transition: transform 0.48s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .submenu .submenu-link:hover:before {
    transform: scaleX(1);
    transform-origin: right;
  }

  .submenu .submenu-link:hover {
    color: #ffffff;
    font-weight: 500;
  }
`;

function TrendingEvent() {
  const trendingEvents = getTrendingEvents();

  return (
    <div className="h-auto w-full flex flex-col bg-[#101428] lg:px-4 py-8 lg:py-12 items-center">
      <div className="flex flex-col items-center mt-8 lg:mt-12 w-full">
        <div className="items-start max-w-[1400px] px-4 mb-10 flex-col gap-4 lg:gap-0 lg:flex-row flex w-full">
          <div className="w-full">
            <p className="text-[#E7FDFF] md:text-[28px] text-[24px] lg:text-[36px] font-semibold">
              Trending Events
            </p>
            <p className="font-normal text-sm lg:text-base text-[#E7FDFF]">
              Discover what is hot right now
            </p>
          </div>
          <div className="flex flex-wrap w-full gap-2 sm:gap-3 lg:gap-4 lg:items-end lg:justify-end">
            <DropdownButton
              label="Weekdays"
              options={[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ]}
            />
            <DropdownButton
              label="Event Type"
              options={["Concert", "Conference", "Workshop", "Festival"]}
            />
            <DropdownButton
              label="Any Category"
              options={["Music", "Technology", "Sports", "Art", "Business"]}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 xl:grid-cols-4 px-4 md:grid-cols-2 grid-cols-1 max-w-[1400px] justify-between items-center gap-8 w-full">
          {trendingEvents.map((event) => (
            <div key={event.id} className="">
              <TrendingCards
                amount={event.amount}
                title={event.title}
                type={event.type}
                time={event.time}
                color={event.color}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-20 lg:mt-24 flex flex-col items-center">
        <button className="group relative overflow-hidden bg-gradient-to-r from-[#00FFA0] to-[#00e691] text-[#013237] font-semibold lg:text-2xl md:text-lg text-base px-8 py-3 lg:px-12 lg:py-4 rounded-[50px] transition-all duration-300 ease-out transform hover:scale-105 hover:shadow-[0_10px_30px_rgba(0,255,160,0.4)] active:scale-95 border-2 border-transparent hover:border-[#00FFA0]/30 backdrop-blur-sm">
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00e691] to-[#00FFA0] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[50px]"></div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out"></div>

          {/* Button text */}
          <span className="relative z-10 flex items-center gap-2 tracking-wide">
            Explore Events
            {/* Arrow icon */}
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-[50px] opacity-0 group-hover:opacity-60 transition-opacity duration-300 bg-gradient-to-r from-[#00FFA0]/20 via-[#00FFA0]/40 to-[#00FFA0]/20 blur-xl"></div>
        </button>
      </div>
    </div>
  );
}

export default TrendingEvent;
