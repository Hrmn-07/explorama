// minute 5:14:40
import { Header, StatsCard, TripCard } from "components";
import { getAllUsers, getUser } from "~/appwrite/auth";
import { dashboardStats, allTrips } from "~/constants";
import type { Route } from "./+types/dashboard";
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";

const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } =
  dashboardStats;

export const clientLoader = async () => {
  const [
    user,
    dashboardStats,
    trips,
    userGrowth,
    tripsByTravelStyle,
    allUsers,
  ] = await Promise.all([
    await getUser(),
    await getUsersAndTripsStats(),
    await getAllTrips(4, 0),
    await getUserGrowthPerDay(),
    await getTripsByTravelStyle(),
    await getAllUsers(4, 0),
  ]);

  const allTrips = trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
    id: $id,
    ...parseTripData(tripDetail),
    imageUrls: imageUrls ?? [],
  }));

  return { user, dashboardStats, allTrips };
};

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
  const user = loaderData.user as User | null;
  const { dashboardStats } = loaderData;

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
            total={dashboardStats.totalUsers}
            lastMonthCount={dashboardStats.usersJoined.lastMonth}
            currentMonthCount={dashboardStats.usersJoined.currentMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={dashboardStats.totalTrips}
            lastMonthCount={dashboardStats.tripsCreated.lastMonth}
            currentMonthCount={dashboardStats.tripsCreated.currentMonth}
          />
          <StatsCard
            headerTitle="Current Active Users"
            total={dashboardStats.userRole.total}
            lastMonthCount={dashboardStats.userRole.lastMonth}
            currentMonthCount={dashboardStats.userRole.currentMonth}
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
