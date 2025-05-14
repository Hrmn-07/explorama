import { Header } from "components";
import {
  ColumnsDirective,
  GridComponent,
  ColumnDirective,
} from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "~/lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/users";

export const loader = async () => {
  const { users, total } = await getAllUsers(10, 0);
  return { users, total };
};

const Users = ({ loaderData }: Route.ComponentProps) => {
  const { users } = loaderData;

  return (
    <main className="all-users wrapper">
      <Header
        title="Manage Users"
        description="Filter, search, and manage user profiles here"
      />
      <GridComponent dataSource={users} gridLines="None">
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
            field="email"
            headerText="Email"
            width={200}
            textAlign="Left"
          />
          <ColumnDirective
            field="joinedAt"
            headerText="Date Joined"
            width={120}
            textAlign="Left"
            template={({ joinedAt }: { joinedAt: string }) =>
              formatDate(joinedAt)
            }
          />
          <ColumnDirective
            field="status"
            headerText="Status"
            width={100}
            textAlign="Left"
            template={({ status }: UserData) => (
              <article
                className={cn(
                  "status-column",
                  status === "user" ? "bg-green-100" : "bg-blue-100"
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    status === "user" ? "bg-green-500" : "bg-blue-500"
                  )}
                />
                <div>
                  <h3
                    className={cn(
                      "text-xs font-medium",
                      status === "user" ? "text-green-600" : "text-blue-600"
                    )}
                  >
                    {status}
                  </h3>
                </div>
              </article>
            )}
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  );
};

export default Users;
