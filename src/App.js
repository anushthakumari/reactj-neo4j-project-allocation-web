import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useReadCypher } from "use-neo4j";

import Register from "./pages/Register";
import Login from "./pages/Login";
import SupLogin from "./pages/supervisor/Login";
import AdminLogin from "./pages/admin/Login";

const router = createBrowserRouter([
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

function App() {
	const { result } = useReadCypher("MATCH (e:Employee) RETURN e");

	const movies = result?.records?.map((row) => row.get("e").properties);

	console.log(movies);

	return (
		<div>
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
