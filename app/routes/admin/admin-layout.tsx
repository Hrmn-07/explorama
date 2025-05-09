import { Outlet } from "react-router";
import { Navigation } from "components";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";

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
