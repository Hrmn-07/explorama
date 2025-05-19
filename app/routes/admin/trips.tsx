import { Header } from "components";

const Trips = () => {
  return (
    <div>
      <main className="all-users wrapper">
        <Header
          title="Trips"
          description="Create and view your AI generated Journeys"
          ctaText="Create AI Trips"
          ctaUrl="/trips/create"
        />
      </main>
    </div>
  );
};

export default Trips;
