import styled from "styled-components";
import PropTypes from "prop-types";

const CreateEventButton = ({ href = "/create-ticket" }) => {
  return (
    <StyledWrapper>
      <a href={href}>
        <button className="button">Create Event</button>
      </a>
    </StyledWrapper>
  );
};

CreateEventButton.propTypes = {
  href: PropTypes.string,
};

const StyledWrapper = styled.div`
  .button {
    display: inline-block;
    padding: 10px 16px;
    margin: 5px;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    background-image: linear-gradient(to bottom right, #00c6ff, #0072ff);
    border: none;
    border-radius: 40px;
    box-shadow: 0px 4px 0px #0072ff;
    transition: all 0.2s ease-in-out;
    cursor: pointer;
    position: relative;
    min-height: 44px;
    white-space: nowrap;

    @media (min-width: 640px) {
      padding: 16px 36px;
      margin: 10px;
      font-size: 16px;
      min-height: 57px;
    }
  }

  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0px 6px 0px #0072ff;
  }

  .button:active {
    transform: translateY(0px);
    box-shadow: none;
    background-image: linear-gradient(to bottom right, #0072ff, #00c6ff);
  }

  .button:before,
  .button:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
  }

  .button:before {
    top: -3px;
    left: -3px;
    border-radius: 40px;
    border-top: 3px solid #fff;
    border-left: 3px solid #fff;
  }

  .button:after {
    bottom: -3px;
    right: -3px;
    border-radius: 40px;
    border-bottom: 3px solid #fff;
    border-right: 3px solid #fff;
  }
`;

export default CreateEventButton;
