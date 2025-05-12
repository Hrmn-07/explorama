// minute 1:41:40
import { Header, StatsCard, TripCard } from "components";
import { dashboardStats, user, allTrips } from "~/constants";

const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } =
  dashboardStats;

const Dashboard = () => {
  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome, ${user?.name ?? "Guest"}`}
        description="Track popular destination and trending activity here"
      />
      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            headerTitle="Total Users"
            total={totalUsers}
            lastMonthCount={usersJoined.lastMonth}
            currentMonthCount={usersJoined.currentMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={totalTrips}
            lastMonthCount={tripsCreated.lastMonth}
            currentMonthCount={tripsCreated.currentMonth}
          />
          <StatsCard
            headerTitle="Current Active Users"
            total={userRole.total}
            lastMonthCount={userRole.lastMonth}
            currentMonthCount={userRole.currentMonth}
          />
        </div>
      </section>
      <section className="container">
        <h1 className="text-2xl font-semibold text-dark-100">Created Trips</h1>
        <div className="trip-grid">
          {allTrips
            .slice(0, 4)
            .map(({ id, name, imageUrls, tags, itinerary, estimatedPrice }) => (
              <TripCard
                key={id}
                id={id.toString()}
                name={name}
                imageUrl={imageUrls[0]}
                location={itinerary?.[0]?.location ?? ""}
                tags={tags}
                price={estimatedPrice}
              />
            ))}
        </div>
      </section>
      {/* @ts-ignore */}
      <TripCard />
    </main>
  );
};

export default Dashboard;
