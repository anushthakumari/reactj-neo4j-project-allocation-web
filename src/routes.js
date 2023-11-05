import { createBrowserRouter } from "react-router-dom";

//user
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserHome from "./pages/Home";

//supervisior
import SupLogin from "./pages/supervisor/Login";
import SupHome from "./pages/supervisor/Home";

//Admin
import AdminLogin from "./pages/admin/Login";
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
	{
		path: "/register",
		element: <Register />,
	},
	{
		path: "/sup-login",
		element: <SupLogin />,
	},
	{
		path: "/admin/login",
		element: <AdminLogin />,
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
