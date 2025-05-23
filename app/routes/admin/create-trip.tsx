import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { Header } from "components";
import type { Route } from "./+types/create-trip";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "~/lib/utils";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import React, { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

export const loader = async () => {
  // fetch countries from restcountries api

  const response = await fetch("https://restcountries.com/v3.1/all", {});

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const data = await response.json();

  return data.map((country: any) => ({
    name: country.flag + country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMaps,
  }));
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  // load country[] from loader data
  const countries = (loaderData as Country[]) || [];
  const navigate = useNavigate();

  const [formData, setformData] = useState<TripFormData>({
    country: countries[0]?.name || "",
    duration: 0,
    travelStyle: "",
    interest: "",
    budget: "",
    groupType: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (
      !formData.country ||
      !formData.duration ||
      !formData.travelStyle ||
      !formData.interest ||
      !formData.budget ||
      !formData.groupType
    ) {
      setError("Please fill the value for all fields!");
      setLoading(false);
      return;
    }
    // limit the duration for 10 days so that the AI is not overwhelmed
    if (formData.duration < 1 || formData.duration > 10) {
      setError("Duration must be between 1 and 10 days!");
      setLoading(false);
      return;
    }
    // check if user is logged in
    const user = await account.get();
    if (!user.$id) {
      console.error("You are not currently logged in!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: user.$id,
        }),
      });

      const result: CreateTripResponse = await response.json();

      if (result?.id) {
        navigate(`/trips/${result.id}`);
      } else {
        console.error("Failed creating a trip!");
      }
    } catch (error) {
      console.log("Error generating trip:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (key: keyof TripFormData, value: string | number) => {
    setformData({ ...formData, [key]: value });
  };

  // map country to text and value
  const countryData = countries.map((country) => ({
    text: country.name || "",
    value: country.value || "",
  }));

  const mapData = [
    {
      country: formData.country,
      color: "#C70039",
      coordinates:
        countries.find((c: Country) => c.name === formData.country)
          ?.coordinates || [],
    },
  ];

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Create AI Trip"
        description="Create and customize your own personalized AI journey"
      />
      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">
              Country <span className="text-red-600 text-lg">*</span>
            </label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "text", value: "value" }}
              placeholder="Select a country"
              className="combo-box"
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();

                e.updateData(
                  countries
                    .filter((country) =>
                      country.name.toLowerCase().includes(query)
                    )
                    .map((country) => ({
                      text: country.name,
                      value: country.value,
                    }))
                );
              }}
            />
          </div>
          <div>
            <label htmlFor="duration">
              Duration <span className="text-red-600 text-lg">*</span>
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              placeholder="Enter the number of days for your trip..."
              className="form-input placeholder:text-gray-100"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>
                {formatKey(key)} <span className="text-red-600 text-lg">*</span>
              </label>
              <ComboBoxComponent
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: "text", value: "value" }}
                placeholder={`Select your ${formatKey(key)}`}
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key, e.value);
                  }
                }}
                allowFiltering
                filtering={(e) => {
                  const query = e.text.toLowerCase();

                  e.updateData(
                    comboBoxItems[key]
                      .filter((item) => item.toLowerCase().includes(query))
                      .map((item) => ({
                        text: item,
                        value: item,
                      }))
                  );
                }}
                className="combo-box"
              />
            </div>
          ))}
          <div>
            <label htmlFor="location" className="text-base">
              Your destination on the world map
            </label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  dataSource={mapData}
                  shapeData={world_map}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{ colorValuePath: "color", fill: "#7393B3" }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>
          <div className="bg-gray-200 h-px w-full" />
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer className="px-6 w-full">
            <ButtonComponent
              type="submit"
              className="button-class !h-12 !w-full"
              disabled={loading}
            >
              <span className="p-16-semibold text-white">
                {loading ? "Generating your trip..." : "Generate Trip"}
              </span>
              <img
                src={`/assets/icons/${
                  loading ? "loader.svg" : "magic-star.svg"
                }`}
                alt="submit"
                className={cn("size-5", { "animate-spin": loading })}
              />
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
