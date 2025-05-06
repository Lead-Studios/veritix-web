import React from "react";

const EventDetailTabContent = ({ tab, event }) => {
  if (!event) return null;

  if (tab === "about") {
    const about = event.about;
    if (!about) return <div className="mt-8 text-gray-400">No about info available.</div>;
    return (
      <div className="mt-8">
        <p className="text-gray-200 mb-6">{about.intro}</p>
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-2">What to expect:</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {about.expectations?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <p className="text-gray-200">{about.outro}</p>
      </div>
    );
  }

  if (tab === "schedule") {
    if (!event.schedule) return <div className="mt-8 text-gray-400">No schedule available.</div>;
    return (
      <div className="mt-8">
        {event.schedule.map((day, idx) => (
          <div key={idx} className="mb-8">
            <h3 className="text-white font-semibold mb-2">{day.day} <span className="text-gray-400 font-normal">({day.date})</span></h3>
            <ul className="text-gray-300 space-y-1">
              {day.events?.map((e, i) => (
                <li key={i} className="flex items-center">
                  <span className="inline-block w-24 text-blue-400 font-mono">{e.time}</span>
                  <span>{e.activity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (tab === "performers") {
    if (!event.performers) return <div className="mt-8 text-gray-400">No performers listed.</div>;
    return (
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {event.performers.map((p, idx) => (
          <div key={idx} className="flex flex-col items-center bg-[#181c3a] rounded-xl p-6 shadow border border-[#23264a]">
            <img src={p.image} alt={p.name} className="w-24 h-24 rounded-full object-cover mb-4 bg-gray-700" />
            <div className="text-white font-semibold text-lg mb-1">{p.name}</div>
            <div className="text-gray-400 text-sm">{p.role}</div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default EventDetailTabContent; 