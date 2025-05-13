import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/auth";
import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";

const Navigation = ({ handleClick }: { handleClick?: () => void }) => {
  const user = useLoaderData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/sign-in");
  };

  return (
    <section className="nav-items">
      <Link to={"/"} className="link-logo">
        <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
        <h1>Explorama</h1>
      </Link>
      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink to={href} key={id}>
              {({ isActive }: { isActive: boolean }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                  onClick={handleClick}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`group-hover:brightness-0 size-0 group-hover:invert ${
                      isActive ? "invert brightness-0" : "text-dark-200"
                    }`}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
        <footer className="nav-footer">
          <img
            src={user?.imageUrl || "/assets/images/david.webp"}
            alt={user?.name}
            referrerPolicy="no-referrer"
          />
          <article>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </article>
        </footer>
        <button
          onClick={handleLogout}
          className="cursor-pointer ml-auto flex items-center justify-center py-2"
          aria-label="Logout"
        >
          <p className="text-base px-1 text-red-600">Sign out</p>
          <img src="/assets/icons/logout.svg" alt="logout" className="size-6" />
        </button>
      </div>
    </section>
  );
};

export default Navigation;
