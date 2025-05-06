import React, { useState } from "react";
import TicketCard from "./TicketCard";
import TicketModal from "./TicketModal";
import { FaCheckCircle } from "react-icons/fa";
import { ticketsByEventId, organizersByEventId, eventsById } from '../../data/events';

const TicketList = ({ eventId }) => {
  const ticketData = ticketsByEventId[eventId] || [];
  const organizer = organizersByEventId[eventId];
  const eventInfo = eventsById[eventId];
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  return (
    <div className="mt-12 w-full">
      {/* Title Bar */}
      <div className="rounded-t-2xl bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
        <h2 className="text-lg font-semibold text-white tracking-wide">Ticket Options</h2>
      </div>
      {/* Ticket Box */}
      <div className="bg-[#0a0e21] rounded-b-2xl rounded-tr-2xl p-4 md:p-10 border border-[#23264a] w-full">
        {ticketData.length === 0 ? (
          <p className="text-gray-400">No tickets available.</p>
        ) : (
          ticketData.map(ticket => (
            <TicketCard key={ticket.id} {...ticket} onClick={() => handleTicketClick(ticket)} />
          ))
        )}
        {/* Connect Wallet Button */}
        <div className="flex justify-center mt-10 mb-10">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-semibold py-3 px-24 rounded-lg text-base shadow-lg transition-all">
            Connect Wallet to Purchase
          </button>
        </div>
        {/* Extra Info Section */}
        <div className="text-gray-300 text-sm space-y-2 mb-12">
          <p>All tickets are minted as unique NFTs on the Ethereum blockchain — secure, verifiable, and yours to own</p>
          <p>Tickets are fully transferable and resellable via our official marketplace or any compatible platform</p>
          <p>Gas fees are not included in the listed prices and may vary at checkout</p>
          <p>Gain exclusive digital collectibles and perks with select ticket tiers</p>
        </div>
        {/* Organizer Section */}
        {organizer && (
          <div className="flex flex-col md:flex-row md:items-center gap-4 bg-[#15172b] rounded-xl px-4 py-4 md:px-6 md:py-5 mb-4 border border-[#23264a] shadow-sm">
            <div className="flex-1">
              <div className="font-semibold text-white text-base mb-1">Event Organizer</div>
              <div className="text-gray-300 text-sm font-medium mb-0.5">{organizer.name}</div>
              <div className="text-gray-400 text-xs mb-1">{organizer.description}</div>
            </div>
            {organizer.verified && (
              <div className="flex items-center md:justify-end mt-2 md:mt-0">
                <FaCheckCircle className="text-green-400 mr-1 text-lg" />
                <span className="text-green-400 text-xs font-semibold">Verified Organizer</span>
              </div>
            )}
          </div>
        )}
      </div>
      <TicketModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        event={eventInfo}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default TicketList; 