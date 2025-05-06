import React from "react";
import { FaTimes, FaDownload, FaShareAlt, FaExchangeAlt } from "react-icons/fa";

const TicketModal = ({ isOpen, onClose, event, ticket }) => {
  if (!isOpen || !event || !ticket) return null;

  // Mock ticket holder and QR code
  const ticketHolder = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com"
  };
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TicketID-" + ticket.id;

  // Prevent modal close when clicking inside the modal content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4" onClick={onClose}>
      <div 
        className="bg-[#181c3a] rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-fadeIn" 
        onClick={handleContentClick}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white text-xl sm:text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          <FaTimes />
        </button>
        {/* Event & Ticket Info */}
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 pr-8">{event.eventName}</h2>
        <div className="text-gray-400 mb-4 text-sm sm:text-base">
          <div>{new Date(event.eventDate).toLocaleString()}</div>
          <div>{event.location}</div>
        </div>
        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-1">{ticket.type}</h3>
          <ul className="text-gray-300 text-xs sm:text-sm mb-2 list-disc list-inside space-y-1">
            {ticket.description && ticket.description.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </div>
        {/* Ticket Holder & QR */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8 bg-[#202346] rounded-xl p-4 border border-[#23264a]">
          <div className="flex-1 w-full text-center sm:text-left">
            <div className="text-xs sm:text-sm text-gray-400 mb-1">Ticket Holder</div>
            <div className="text-white font-semibold">{ticketHolder.name}</div>
            <div className="text-gray-400 text-xs">{ticketHolder.email}</div>
          </div>
          <div className="flex flex-col items-center">
            <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-gray-700 bg-white" />
          </div>
        </div>
        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full mt-2">
          <button className="flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white px-2 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition">
            <FaDownload className="sm:mr-1" /> <span className="hidden sm:inline">Download</span>
          </button>
          <button className="flex items-center justify-center gap-1 sm:gap-2 bg-[#23264a] hover:bg-blue-600 text-white px-2 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition">
            <FaExchangeAlt className="sm:mr-1" /> <span className="hidden sm:inline">Transfer</span>
          </button>
          <button className="flex items-center justify-center gap-1 sm:gap-2 bg-[#23264a] hover:bg-blue-600 text-white px-2 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition">
            <FaShareAlt className="sm:mr-1" /> <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketModal; 