import { useAuthState } from "../contexts/AuthProvider";

/**
 * @description returns auth state, if no user then returns null
 * @returns {{ full_name, email, role_id } || null}
 */
const useAuth = () => {
	const { user } = useAuthState();

	return user;
};

export default useAuth;
