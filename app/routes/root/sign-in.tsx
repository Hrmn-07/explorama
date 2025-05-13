import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Link, redirect } from "react-router";
import { googleLogin } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (user.$id) return redirect("/");
  } catch (error) {
    console.log("error fetching user:", error);
  }
}

const SignIn = () => {
  return (
    <main className="auth">
      <section className="size-full glassmorphism px-6 flex-center">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/">
              <img
                src="/assets/icons/logo.svg"
                className="size-[30px]"
                alt="logo"
              />
            </Link>
            <h1 className="p-28-bold text-gray-700">Explorama</h1>
          </header>
          <article>
            <h2 className="p-28-semibold text-blue-700 text-center">
              Begin Your Next Adventure!
            </h2>
            <p className="p-18-regular text-center text-gray-100 !leading-7 pt-2">
              Connect with Google to organize your trips, track user activity,
              and utilize AI to plan your journeys.
            </p>
          </article>
          <ButtonComponent
            className="button-class !h-11 !w-full"
            iconCss="e-search-icon"
            type="button"
            onClick={googleLogin}
          >
            <img
              src="/assets/icons/google.svg"
              alt="google"
              className="size-5"
            />
            <span className="p-18-semibold text-white">
              Sign in with Google
            </span>
          </ButtonComponent>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
