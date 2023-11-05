import { createBrowserRouter } from "react-router-dom";

//user
import Login from "./pages/Login";
import UserHome from "./pages/Home";

//supervisior
import SupProjectList from "./pages/supervisor/ProjectList";
import SupProjectDetails from "./pages/supervisor/ProjectDetails";

//Admin
import AdminHome from "./pages/admin/Home";
import AdminUserList from "./pages/admin/UserList";
import SupUserList from "./pages/admin/SupList";

export const authRouter = createBrowserRouter([
	{
		path: "/",
		element: <Login />,
	},
	{
		path: "/login",
		element: <Login />,
	},
]);

export const userRouter = createBrowserRouter([
	{
		path: "/",
		element: <UserHome />,
	},
]);

export const supRouter = createBrowserRouter([
	{
		path: "/",
		element: <SupProjectList />,
	},
	{
		path: "/project/:projectid",
		element: <SupProjectDetails />,
	},
]);

export const adminRouter = createBrowserRouter([
	{
		path: "/",
		element: <AdminHome />,
	},
	{
		path: "/candidates",
		element: <AdminUserList />,
	},
	{
		path: "/sup-list",
		element: <SupUserList />,
	},
]);
