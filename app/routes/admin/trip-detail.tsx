import type { LoaderFunctionArgs } from "react-router";
import { getTripById } from "~/appwrite/trips";
import { cn, parseTripData } from "~/lib/utils";
import type { Route } from "./+types/trip-detail";
import { Header, InfoPill } from "components";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { tripId } = params;

  if (!tripId) throw new Error("Please provide a trip id!");

  return await getTripById(tripId);
};

const TripDetail = ({ loaderData }: Route.ComponentProps) => {
  const imageUrls = loaderData?.imageUrls || [];
  const tripData = parseTripData(loaderData?.tripDetail);

  const {
    name,
    duration,
    itinerary,
    travelStyle,
    groupType,
    budget,
    interests,
    estimatedPrice,
    description,
    bestTimeToVisit,
    weatherInfo,
    country,
  } = tripData || {};

  const pillData = [
    { text: travelStyle, bg: "!bg-purple-100 !text-purple-500" },
    { text: groupType, bg: "!bg-blue-100 !text-blue-500" },
    { text: budget, bg: "!bg-green-100 !text-green-700" },
    { text: interests, bg: "!bg-orange-100 !text-orange-500" },
  ];

  const timeAndWeatherInfo = [
    { title: "Perfect Time to Visit:", items: bestTimeToVisit },
    { title: "Weather Info:", items: weatherInfo },
  ];

  return (
    <main className="travel-detail wrapper">
      <div className="flex">
        <Header
          title="Trip Detail"
          description="View your AI planned trip details"
        />
        <div className="flex items-center pr-7">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-base font-medium text-gray-400 hover:text-blue-600 transition-colors whitespace-nowrap gap-2 cursor-pointer"
          >
            <span>←</span> Back to Trips
          </button>
        </div>
      </div>
      <section className="container wrapper-md">
        {/* article main title */}
        <header className="text-4xl font-semibold text-dark-100">
          {name}
          <div className="flex items-center gap-7">
            <InfoPill
              text={`${duration} day plan`}
              image="/assets/icons/calendar.svg"
            />
            <InfoPill
              text={
                itinerary
                  ?.slice(0, 5)
                  .map((item) => item.location)
                  .join(", ") || ""
              }
              image="/assets/icons/location-mark.svg"
            />
          </div>
        </header>
        {/* article images */}
        <section className="gallery">
          {imageUrls.map((url: string, index: number) => (
            <img
              src={url}
              key={index}
              className={cn(
                "w-full rounded-xl object-cover",
                index === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]"
              )}
            />
          ))}
        </section>
        {/* category pill */}
        <section className="flex gap-3 md:gap-5 items-center flex-wrap">
          <ChipListComponent id="travel-chip">
            <ChipsDirective>
              {pillData.map((pill, index) => (
                <ChipDirective
                  key={index}
                  text={pill.text}
                  cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>
          {/* rating */}
          <ul className="flex gap-1 items-center">
            {Array(5)
              .fill("null")
              .map((_, index) => (
                <li key={index}>
                  <img
                    src="/assets/icons/star.svg"
                    alt="stars"
                    className="size-[17px]"
                  />
                </li>
              ))}
            <li>
              <ChipListComponent>
                <ChipsDirective>
                  <ChipDirective
                    text="4.8/5"
                    cssClass="!bg-orange-100 !text-yellow-600"
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </section>
        {/* article title and price */}
        <section className="title">
          <article>
            <h3 className="text-2xl font-semibold">
              {duration}-Day {country} {travelStyle} Trip
            </h3>
            <p className="text-2xl">
              {budget}, {groupType} and {interests}
            </p>
          </article>
          <h2 className="text-green-800 font-semibold pr-5">
            {estimatedPrice}
          </h2>
        </section>
        {/* article description */}
        <p className="text-sm md:text-lg font-normal text-dark-400">
          {description}
        </p>
        {/* article itinerary */}
        <ul className="itinerary">
          {itinerary?.map((dayPlan: DayPlan, index: number) => (
            <li key={index}>
              <span className="block h-[2px] w-full bg-gray-300" />
              <h3 className="text-xl text-blue-800">
                Day {dayPlan.day}: {dayPlan.location}
              </h3>
              <ul className="mt-2">
                {dayPlan.activities.map((activity, index: number) => (
                  <li key={index} className="flex flex-col mb-3">
                    <span className="flex-shring-0 p-18-semibold pl-2">
                      {activity.time}:
                    </span>
                    <p className="flex-grow pl-2 text-lg">
                      {activity.description}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {timeAndWeatherInfo.map((section) => (
          <section key={section.title} className="visit">
            <div>
              <span className="block h-[2px] w-full bg-gray-300" />
              <h3>{section.title}</h3>
              <ul>
                {section.items?.map((item) => (
                  <li key={item}>
                    <p className="flex-grow">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </section>
    </main>
  );
};

export default TripDetail;
