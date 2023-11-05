import { RouterProvider } from "react-router-dom";

import { userRouter, adminRouter, supRouter, authRouter } from "./routes";
import useAuth from "./hooks/useAuth";
import roles from "./constants/roles";

function App() {
	const user = useAuth();

	if (!user) {
		return <RouterProvider router={authRouter} />;
	}

	if (user.role_id === roles.USER) {
		return <RouterProvider router={userRouter} />;
	}

	if (user.role_id === roles.ADMIN) {
		return <RouterProvider router={adminRouter} />;
	}

	if (user.role_id === roles.SUPERVISIOR) {
		return <RouterProvider router={supRouter} />;
	}

	return <center>NO PAGE FOUND!!</center>;
}

export default App;
