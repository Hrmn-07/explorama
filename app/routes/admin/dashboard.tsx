import { Header, StatsCard, TripCard } from "components";
import { getAllUsers, getUser } from "~/appwrite/auth";
import type { Route } from "./+types/dashboard";
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData } from "~/lib/utils";
import {
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import {
  ColumnsDirective,
  GridComponent,
  ColumnDirective,
} from "@syncfusion/ej2-react-grids";
import { tripXAxis, tripyAxis, userXAxis, userYAxis } from "~/constants";
import { useNavigate } from "react-router";

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
    await getAllTrips(6, 0),
    await getUserGrowthPerDay(),
    await getTripsByTravelStyle(),
    await getAllUsers(6, 0),
  ]);

  const allTrips = trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
    id: $id,
    ...parseTripData(tripDetail),
    imageUrls: imageUrls ?? [],
  }));

  const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
    imageUrl: user.imageUrl,
    name: user.name,
    count: user.itineraryCount ?? Math.floor(Math.random() * 10),
  }));

  return {
    user,
    dashboardStats,
    allTrips,
    userGrowth,
    tripsByTravelStyle,
    allUsers: mappedUsers,
  };
};

const Dashboard = ({ loaderData }: Route.ComponentProps) => {
  const user = loaderData.user as User | null;
  const { dashboardStats, allTrips, userGrowth, tripsByTravelStyle, allUsers } =
    loaderData;

  const navigate = useNavigate();

  const trips = allTrips.map((trip) => ({
    imageUrl: trip.imageUrls[0],
    name: trip.name,
    interest: trip.interests,
  }));

  const userListAndTrips = [
    {
      title: "Latest users signed up",
      dataSource: allUsers,
      field: "count",
      headerText: "Trips Created",
    },
    {
      title: "Trips trends and interests",
      dataSource: trips,
      field: "interest",
      headerText: "Interests",
    },
  ];

  return (
    <main className="dashboard wrapper">
      <div className="flex">
        <Header
          title={`Welcome, ${user?.name ?? "Guest"}`}
          description="Track popular destination and trending activity here"
        />
        <div className="flex items-center pr-7">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-base font-medium text-gray-400 hover:text-blue-600 transition-colors whitespace-nowrap gap-2 cursor-pointer"
          >
            <span>←</span> Back to Landing
          </button>
        </div>
      </div>

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
          {allTrips.map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id.toString()}
              name={trip.name!}
              imageUrl={trip.imageUrls[0]}
              location={trip.itinerary?.[0]?.location ?? ""}
              tags={[trip.interests!, trip.travelStyle!]}
              price={trip.estimatedPrice!}
            />
          ))}
        </div>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-10">
        <ChartComponent
          id="chart-1"
          primaryXAxis={userXAxis}
          primaryYAxis={userYAxis}
          title="User Growth"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="Column"
              name="Column"
              columnWidth={0.5}
              cornerRadius={{ topLeft: 5, topRight: 5 }}
            />
            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="SplineArea"
              name="Wave"
              fill="rgba(71, 132, 238, 0.3)"
              border={{ width: 2, color: "#4784EE" }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
        {/* second chart */}
        <ChartComponent
          id="chart-2"
          primaryXAxis={tripXAxis}
          primaryYAxis={tripyAxis}
          title="Trips Trend"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={tripsByTravelStyle}
              xName="travelStyle"
              yName="count"
              type="Column"
              name="day"
              columnWidth={0.5}
              cornerRadius={{ topLeft: 5, topRight: 5 }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </section>
      <section className="user-trip wrapper">
        {userListAndTrips.map(
          ({ title, dataSource, field, headerText }, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-dark-100">{title}</h3>
              <GridComponent dataSource={dataSource}>
                <ColumnsDirective>
                  <ColumnDirective
                    field="name"
                    headerText="Name"
                    width={200}
                    textAlign="Left"
                    template={(props: UserData) => (
                      <div className="flex items-center gap-1.5 px-4">
                        <img
                          src={props.imageUrl}
                          alt="user"
                          className="rounded-full size-8 aspect-square"
                          referrerPolicy="no-referrer"
                        />
                        <span>{props.name}</span>
                      </div>
                    )}
                  />
                  <ColumnDirective
                    field={field}
                    headerText={headerText}
                    width={150}
                    textAlign="Left"
                  />
                </ColumnsDirective>
              </GridComponent>
            </div>
          )
        )}
      </section>
    </main>
  );
};

export default Dashboard;
