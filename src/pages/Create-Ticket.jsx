import EventCreationForm from "../components/Create-ticket/event-creation-form";

const CreateTicket = () => {
  return (
    <main className="bg-[#070b1a] text-white">
      <div className="container mx-auto py-8 px-4">
        <EventCreationForm />
      </div>
    </main>
  );
};

export default CreateTicket;
