import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Link, useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/auth";

const PageLayout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logoutUser();
    navigate("/sign-in");
  };
  return (
    <main className="auth">
      <section className="size-full glassmorphism px-24 flex-center">
        <div className="flex bg-white/70 backdrop-blur-2xl flex-col border border-light-100 rounded-[20px] py-10 px-7 w-full shadow-2xl">
          <header className="flex items-center gap-1.5 justify-center">
            <Link to="/">
              <img
                src="/assets/icons/explorama.png"
                className="size-[50px]"
                alt="logo"
              />
            </Link>
            <h1 className="p-28-bold text-gray-700">Explorama</h1>
          </header>
          <article className="mt-9 mb-[30px] flex flex-col gap-3">
            <h2 className="text-4xl font-semibold text-dark-200 text-center">
              Ready to <span className="text-blue-600">Explore</span> the World
              with the <span className="text-blue-600">Power</span> of AI?
            </h2>
            <p className="text-xl text-center text-gray-600 !leading-7 pt-2">
              Plan unforgettable journeys in just a few clicks with intelligent,
              personalized itineraries tailored to your preferences by our AI
              companion. Discover trips curated by others, and manage all your
              travel plans in one convenient place. Whether you're dreaming of a
              weekend escape or a global pink — we're here to make your trip{" "}
              <span className="text-pink-600 text-2xl font-semibold">
                {" "}
                Smarter
              </span>
              ,
              <span className="text-pink-600 text-2xl font-semibold">
                {" "}
                Faster
              </span>
              , and
              <span className="text-pink-600 text-2xl font-semibold">
                {" "}
                Better
              </span>
              .
            </p>
          </article>
          <div className="flex flex-col items-center justify-center">
            <ButtonComponent
              className="button-class !h-11 !w-[350px]"
              iconCss="e-search-icon"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              <span className="p-18-semibold text-white">
                Go to Dashboard<span className="pl-2">→</span>
              </span>
            </ButtonComponent>
            <ButtonComponent
              className="!bg-red-600 !px-4 !rounded-lg !flex !items-center !justify-center !gap-1.5 !shadow-none hover:!scale-105 !duration-200 !transition-transform !h-11 !w-[200px] !mt-7"
              iconCss="e-search-icon"
              type="button"
              onClick={handleLogout}
            >
              <span className="p-18-semibold text-white pr-5">
                <span className="pr-2">←</span>Sign out
              </span>
            </ButtonComponent>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PageLayout;
