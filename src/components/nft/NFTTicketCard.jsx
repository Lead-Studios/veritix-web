import React from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
  .flip-card {
    background-color: transparent;
    width: 350px;
    height: 240px;
    perspective: 1000px;
    color: white;
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }

  .flip-card-front,
  .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border-radius: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    box-sizing: border-box;
  }

  .flip-card-back {
    transform: rotateY(180deg);
  }

  .vip-badge {
    position: absolute;
    top: 18px;
    right: 18px;
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #333;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .event-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    text-align: left;
  }

  .event-name {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
    color: white;
  }

  .event-details {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 6px;
  }

  .price-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 18px;
  }

  .price {
    font-size: 18px;
    font-weight: bold;
    color: #ffd700;
  }

  .eth-logo {
    width: 24px;
    height: 24px;
  }

  .decorative-svg {
    position: absolute;
    bottom: 12px;
    right: 12px;
    opacity: 0.3;
  }
`;

const NFTTicketCard = () => {
  return (
    <StyledWrapper>
      <div className="flip-card">
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <div className="vip-badge">VIP Access</div>
            <div className="event-info">
              <div className="event-name">Veritix</div>
              <div className="event-details">Oct 25, 2025 • New York</div>
              <div className="event-details">On-Chain</div>
            </div>
            <div className="price-section">
              <div className="price">0.15 ETH</div>
              <svg className="eth-logo" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25l-6.25-3.75z"
                  fill="#ffd700"
                />
              </svg>
            </div>
            <svg
              className="decorative-svg"
              width="45"
              height="45"
              viewBox="0 0 100 100"
              fill="none"
            >
              <path
                d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80C33.4315 80 20 66.5685 20 50Z"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.3"
              />
              <path
                d="M30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50C70 61.0457 61.0457 70 50 70C38.9543 70 30 61.0457 30 50Z"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.3"
              />
            </svg>
          </div>
          <div className="flip-card-back">
            <div className="vip-badge">VIP Access</div>
            <div className="event-info">
              <div className="event-name">Veritix</div>
              <div className="event-details">Oct 25, 2025 • New York</div>
              <div className="event-details">On-Chain</div>
            </div>
            <div className="price-section">
              <div className="price">0.15 ETH</div>
              <svg className="eth-logo" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 1.75l-6.25 10.5L12 16l6.25-3.75L12 1.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25l-6.25-3.75z"
                  fill="#ffd700"
                />
              </svg>
            </div>
            <svg
              className="decorative-svg"
              width="45"
              height="45"
              viewBox="0 0 100 100"
              fill="none"
            >
              <path
                d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80C33.4315 80 20 66.5685 20 50Z"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.3"
              />
              <path
                d="M30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50C70 61.0457 61.0457 70 50 70C38.9543 70 30 61.0457 30 50Z"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default NFTTicketCard;
