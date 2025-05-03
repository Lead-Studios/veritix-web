"use client";

import { useState } from "react";
import MapContainer from "./map-container";
import ImageUpload from "./image-upload";
import DateTimePicker from "./date-time-picker";

export default function EventCreationForm() {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    coverImage: "",
    location: {
      type: "physical",
      venue: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      virtualRoom: "",
    },
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    tickets: [
      {
        name: "",
        price: "",
        quantity: 0,
        description: "",
        transferable: false,
        resellable: false,
        resellPrice: "",
      },
    ],
    blockchain: {
      network: "ethereum",
      royalty: 5,
    },
  });

  const handleInputChange = (field, value) => {
    setEventData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (field, value) => {
    setEventData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleTicketChange = (index, field, value) => {
    setEventData((prev) => {
      const updatedTickets = [...prev.tickets];
      updatedTickets[index] = {
        ...updatedTickets[index],
        [field]: value,
      };
      return {
        ...prev,
        tickets: updatedTickets,
      };
    });
  };

  const handleBlockchainChange = (field, value) => {
    setEventData((prev) => ({
      ...prev,
      blockchain: {
        ...prev.blockchain,
        [field]: value,
      },
    }));
  };

  const addTicketType = () => {
    setEventData((prev) => ({
      ...prev,
      tickets: [
        ...prev.tickets,
        {
          name: "",
          price: "",
          quantity: 0,
          description: "",
          transferable: false,
          resellable: false,
          resellPrice: "",
        },
      ],
    }));
  };

  const handleCreateEvent = () => {
    console.log("Event created:", eventData);
    // Here you would typically send the data to your backend
    alert("Event created successfully!");
  };

  const handleSaveAsDraft = () => {
    console.log("Event saved as draft:", eventData);
    // Here you would typically save the draft to your backend
    alert("Event saved as draft!");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <h1 className="text-[#6366f1] text-2xl font-semibold mb-2">
          Create New Event
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Fill in the details below to create your blockchain-powered event
        </p>

        <div className="space-y-8">
          {/* Step 1: Basic Information */}
          <div className="space-y-4 border border-[#1e293b] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#6366f1] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                1
              </div>
              <h2 className="text-lg font-medium">Basic Information</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="eventTitle"
                  className="block text-sm font-medium mb-1"
                >
                  Event Title
                </label>
                <input
                  id="eventTitle"
                  placeholder="Give your event a catchy title"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                  value={eventData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="eventDescription"
                  className="block text-sm font-medium mb-1"
                >
                  Event Description
                </label>
                <textarea
                  id="eventDescription"
                  placeholder="Describe your event in details"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                  value={eventData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Cover Image
                </label>
                <ImageUpload
                  value={eventData.coverImage}
                  onChange={(url) => handleInputChange("coverImage", url)}
                />
              </div>
            </div>
          </div>

          {/* Step 2: Date & Time */}
          <div className="space-y-4 border border-[#1e293b] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#6366f1] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                2
              </div>
              <h2 className="text-lg font-medium">Date & Time</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <DateTimePicker
                  type="date"
                  value={eventData.startDate}
                  onChange={(value) => handleInputChange("startDate", value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <DateTimePicker
                  type="date"
                  value={eventData.endDate}
                  onChange={(value) => handleInputChange("endDate", value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <DateTimePicker
                  type="time"
                  value={eventData.startTime}
                  onChange={(value) => handleInputChange("startTime", value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <DateTimePicker
                  type="time"
                  value={eventData.endTime}
                  onChange={(value) => handleInputChange("endTime", value)}
                />
              </div>
            </div>
          </div>

          {/* Step 3: Location */}
          <div className="space-y-4 border border-[#1e293b] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#6366f1] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                3
              </div>
              <h2 className="text-lg font-medium">Location</h2>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Event Type
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[#6366f1] h-4 w-4 border-[#6366f1]"
                    name="locationType"
                    value="physical"
                    checked={eventData.location.type === "physical"}
                    onChange={(e) =>
                      handleLocationChange("type", e.target.value)
                    }
                  />
                  <span className="ml-2 text-sm">Physical Event</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[#6366f1] h-4 w-4 border-[#6366f1]"
                    name="locationType"
                    value="online"
                    checked={eventData.location.type === "online"}
                    onChange={(e) =>
                      handleLocationChange("type", e.target.value)
                    }
                  />
                  <span className="ml-2 text-sm">Online Event</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[#6366f1] h-4 w-4 border-[#6366f1]"
                    name="locationType"
                    value="hybrid"
                    checked={eventData.location.type === "hybrid"}
                    onChange={(e) =>
                      handleLocationChange("type", e.target.value)
                    }
                  />
                  <span className="ml-2 text-sm">Hybrid Event</span>
                </label>
              </div>
            </div>

            {eventData.location.type === "online" && (
              <div>
                <label
                  htmlFor="virtualRoom"
                  className="block text-sm font-medium mb-1"
                >
                  Virtual Room
                </label>
                <input
                  id="virtualRoom"
                  placeholder="Enter virtual room name"
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                  value={eventData.location.virtualRoom}
                  onChange={(e) =>
                    handleLocationChange("virtualRoom", e.target.value)
                  }
                />
              </div>
            )}

            {(eventData.location.type === "physical" ||
              eventData.location.type === "hybrid") && (
              <>
                <div>
                  <label
                    htmlFor="venue"
                    className="block text-sm font-medium mb-1"
                  >
                    Venue
                  </label>
                  <input
                    id="venue"
                    placeholder="Enter venue name"
                    className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                    value={eventData.location.venue}
                    onChange={(e) =>
                      handleLocationChange("venue", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium mb-1"
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    placeholder="Enter full address"
                    className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                    value={eventData.location.address}
                    onChange={(e) =>
                      handleLocationChange("address", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium mb-1"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      placeholder="City"
                      className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                      value={eventData.location.city}
                      onChange={(e) =>
                        handleLocationChange("city", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium mb-1"
                    >
                      State
                    </label>
                    <input
                      id="state"
                      placeholder="State"
                      className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                      value={eventData.location.state}
                      onChange={(e) =>
                        handleLocationChange("state", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="zipCode"
                    className="block text-sm font-medium mb-1"
                  >
                    Zip Code
                  </label>
                  <input
                    id="zipCode"
                    placeholder="Zip Code"
                    className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                    value={eventData.location.zipCode}
                    onChange={(e) =>
                      handleLocationChange("zipCode", e.target.value)
                    }
                  />
                </div>

                <MapContainer />
              </>
            )}
          </div>

          {/* Step 4: Ticket Information */}
          <div className="space-y-4 border border-[#1e293b] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#6366f1] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                4
              </div>
              <h2 className="text-lg font-medium">Ticket Information</h2>
            </div>

            {eventData.tickets.map((ticket, index) => (
              <div
                key={index}
                className="space-y-4 p-4 border border-[#1e293b] rounded-lg"
              >
                <div>
                  <label
                    htmlFor={`ticketType-${index}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Ticket Type {index + 1}
                  </label>
                  <input
                    id={`ticketType-${index}`}
                    placeholder="e.g. VIP, General admission"
                    className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                    value={ticket.name}
                    onChange={(e) =>
                      handleTicketChange(index, "name", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`price-${index}`}
                      className="block text-sm font-medium mb-1"
                    >
                      Price (ETH)
                    </label>
                    <input
                      id={`price-${index}`}
                      placeholder="e.g. 0.05"
                      className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                      value={ticket.price}
                      onChange={(e) =>
                        handleTicketChange(index, "price", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`quantity-${index}`}
                      className="block text-sm font-medium mb-1"
                    >
                      Quantity Available
                    </label>
                    <input
                      id={`quantity-${index}`}
                      type="number"
                      placeholder="0"
                      className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                      value={ticket.quantity}
                      onChange={(e) =>
                        handleTicketChange(
                          index,
                          "quantity",
                          Number.parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor={`description-${index}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Description (Optional)
                  </label>
                  <input
                    id={`description-${index}`}
                    placeholder="Ticket benefits, restrictions etc."
                    className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                    value={ticket.description}
                    onChange={(e) =>
                      handleTicketChange(index, "description", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-medium">Blockchain Settings</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label
                        htmlFor={`transferable-${index}`}
                        className="text-sm"
                      >
                        Transferable
                      </label>
                      <p className="text-xs text-gray-400">
                        Allow ticket holders to transfer tickets to others
                      </p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id={`transferable-${index}`}
                        className="sr-only"
                        checked={ticket.transferable}
                        onChange={(e) =>
                          handleTicketChange(
                            index,
                            "transferable",
                            e.target.checked
                          )
                        }
                      />
                      <label
                        htmlFor={`transferable-${index}`}
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          ticket.transferable ? "bg-[#6366f1]" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                            ticket.transferable
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label
                        htmlFor={`resellable-${index}`}
                        className="text-sm"
                      >
                        Resellable
                      </label>
                      <p className="text-xs text-gray-400">
                        Allow ticket holders to resell tickets on secondary
                        market
                      </p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id={`resellable-${index}`}
                        className="sr-only"
                        checked={ticket.resellable}
                        onChange={(e) =>
                          handleTicketChange(
                            index,
                            "resellable",
                            e.target.checked
                          )
                        }
                      />
                      <label
                        htmlFor={`resellable-${index}`}
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                          ticket.resellable ? "bg-[#6366f1]" : "bg-gray-600"
                        }`}
                      >
                        <span
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                            ticket.resellable
                              ? "translate-x-4"
                              : "translate-x-0"
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  {ticket.resellable && (
                    <div>
                      <label
                        htmlFor={`resellPrice-${index}`}
                        className="block text-sm font-medium mb-1"
                      >
                        Resell Price Limit (%)
                      </label>
                      <input
                        id={`resellPrice-${index}`}
                        placeholder="e.g. 150"
                        className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                        value={ticket.resellPrice}
                        onChange={(e) =>
                          handleTicketChange(
                            index,
                            "resellPrice",
                            e.target.value
                          )
                        }
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Restrict reselling at more than X% of original price
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              className="w-full py-2 border border-[#1e293b] rounded-md hover:bg-[#1e293b] transition-colors flex items-center justify-center gap-2"
              onClick={addTicketType}
            >
              <PlusIcon className="h-4 w-4" /> Add Another Ticket Type
            </button>
          </div>

          {/* Step 5: Blockchain Setting */}
          <div className="space-y-4 border border-[#1e293b] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#6366f1] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                5
              </div>
              <h2 className="text-lg font-medium">Blockchain Setting</h2>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Select Blockchain Network
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[#6366f1] h-4 w-4 border-[#6366f1]"
                    name="blockchainNetwork"
                    value="ethereum"
                    checked={eventData.blockchain.network === "ethereum"}
                    onChange={(e) =>
                      handleBlockchainChange("network", e.target.value)
                    }
                  />
                  <span className="ml-2 text-sm">Ethereum</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[#6366f1] h-4 w-4 border-[#6366f1]"
                    name="blockchainNetwork"
                    value="polygon"
                    checked={eventData.blockchain.network === "polygon"}
                    onChange={(e) =>
                      handleBlockchainChange("network", e.target.value)
                    }
                  />
                  <span className="ml-2 text-sm">Polygon</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[#6366f1] h-4 w-4 border-[#6366f1]"
                    name="blockchainNetwork"
                    value="solana"
                    checked={eventData.blockchain.network === "solana"}
                    onChange={(e) =>
                      handleBlockchainChange("network", e.target.value)
                    }
                  />
                  <span className="ml-2 text-sm">Solana</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="treasury-address"
                  className="block text-sm font-medium"
                >
                  Treasury Address
                </label>
                <span className="text-xs text-gray-400">
                  Where funds will be sent
                </span>
              </div>
              <input
                id="treasury-address"
                placeholder="e.g. 0x..."
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">
                  Creator Royalty
                </label>
                <span className="text-xs">{eventData.blockchain.royalty}%</span>
              </div>
              <p className="text-xs text-gray-400">
                Percentage of secondary sales that goes to organizers
              </p>
              <div className="relative pt-1">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={eventData.blockchain.royalty}
                  onChange={(e) =>
                    handleBlockchainChange("royalty", Number(e.target.value))
                  }
                  className="w-full h-2 bg-[#1e293b] rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>0%</span>
                <span>10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Summary */}
      <div className="w-full lg:w-[350px]">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-lg sticky top-14">
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Event Summary</h2>

            <div className="bg-[#1e293b] rounded-md p-4 mb-6">
              {eventData.coverImage ? (
                <img
                  src={eventData.coverImage || "/placeholder.svg"}
                  alt="Event cover"
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
              ) : (
                <div className="w-full h-32 bg-[#0f172a] rounded-md mb-2 flex items-center justify-center text-gray-500">
                  No image uploaded
                </div>
              )}

              <h3 className="font-medium">
                {eventData.title || "No title yet"}
              </h3>

              <div className="space-y-6 mt-4 text-sm">
                <div className="flex flex-col gap-2 justify-between">
                  <span className="text-gray-400">Start Date</span>
                  <span>{eventData.startDate || "Not set yet"}</span>
                </div>
                <div className="flex flex-col gap-2 justify-between">
                  <span className="text-gray-400">End Date</span>
                  <span>{eventData.endDate || "Not set yet"}</span>
                </div>
                <div className="flex flex-col gap-2 justify-between">
                  <span className="text-gray-400">Location</span>
                  <span>
                    {eventData.location.venue ||
                      eventData.location.type ||
                      "Not specified"}
                  </span>
                </div>
                <div className="flex flex-col gap-2 justify-between">
                  <span className="text-gray-400">Blockchain</span>
                  <span>{eventData.blockchain.network}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                className="w-full py-2 px-4 bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-md transition-colors"
                onClick={handleCreateEvent}
              >
                Create Event
              </button>
              <button
                className="w-full py-2 px-4 border border-[#1e293b] rounded-md hover:bg-[#1e293b] transition-colors"
                onClick={handleSaveAsDraft}
              >
                Save as Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
