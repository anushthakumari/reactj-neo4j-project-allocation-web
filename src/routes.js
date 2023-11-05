import { createBrowserRouter } from "react-router-dom";

//user
import Login from "./pages/Login";
import UserHome from "./pages/Home";

//supervisior
import SupHome from "./pages/supervisor/Home";

//Admin
import AdminHome from "./pages/admin/Home";

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
		element: <SupHome />,
	},
]);

export const adminRouter = createBrowserRouter([
	{
		path: "/",
		element: <AdminHome />,
	},
]);
