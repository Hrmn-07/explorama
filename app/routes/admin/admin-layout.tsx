import { Outlet, redirect } from "react-router";
import { Navigation } from "components";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { account } from "~/appwrite/client";
import { getExistingUser, storeUserData } from "~/appwrite/auth";

export async function clientLoader() {
  try {
    const user = await account.get();
    if (!user.$id) return redirect("/sign-in");

    // check if user is admin. if not, redirect to home page
    const existingUser = await getExistingUser(user.$id);
    if (existingUser?.status === "user") return redirect("/");

    return existingUser?.$id ? existingUser : await storeUserData();
  } catch (error) {
    console.log("error loading client:", error);
    return redirect("/sign-in");
  }
}

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="w-full max-w-[230px] hidden lg:block">
        <SidebarComponent width={230} enableGestures={false}>
          <Navigation />
        </SidebarComponent>
      </aside>

      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
};

export default AdminLayout;
