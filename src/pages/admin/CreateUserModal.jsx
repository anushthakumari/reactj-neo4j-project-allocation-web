import React, { useState, useEffect } from "react";
import { useLazyWriteCypher } from "use-neo4j";
import { uid } from "uid";

const c_query = `MERGE (user:User {
    user_id: $user_id,
    full_name: $full_name,
    email: $email,
    password: $pass
})
MERGE (role:Role {role_id: $role_id})
MERGE (user)-[:HAS_ROLE]->(role)

`;

const CreateUserModal = ({
	open,
	setOpen,
	defaultState,
	isEdit,
	roleId,
	onSave,
}) => {
	const [formSate, setformSate] = useState({
		full_name: "",
		email: "",
		pass: "",
	});

	const [run, { loading, error }] = useLazyWriteCypher(c_query);

	const handleInputChange = (e) => {
		const name = e.target.name;
		const val = e.target.value;

		setformSate((prev) => {
			const d = { ...prev };
			d[name] = val;
			return d;
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const full_name = formSate.full_name.trim();
		const email = formSate.email.trim();
		const pass = formSate.pass.trim();

		if (!isEdit) {
			const user_id = uid();
			run({ full_name, email, pass, user_id, role_id: roleId }).then((e) => {
				alert("Saved Successfully!");
				setOpen(false);
				onSave();
			});
		}
	};

	if (error) {
		alert("Something went wrong!");
	}

	useEffect(() => {
		if (defaultState) {
			setformSate(defaultState);
		}
	}, [defaultState]);

	return (
		<div
			id="authentication-modal"
			aria-hidden="true"
			className={`${
				!open ? "hidden overflow-x-hidden" : ""
			} overflow-y-auto fixed h-modal md:h-full top-4 left-0 right-0 md:inset-0 z-50 justify-center items-center`}>
			<div className="relative w-full max-w-md px-4 h-full md:h-auto">
				<div className="bg-white rounded-lg shadow relative dark:bg-gray-700">
					<div className="flex justify-end p-2">
						<button
							onClick={() => setOpen(false)}
							type="button"
							className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
							data-modal-toggle="authentication-modal">
							<svg
								className="w-5 h-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"></path>
							</svg>
						</button>
					</div>
					<form
						onSubmit={handleSubmit}
						className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8"
						action="#">
						<h3 className="text-xl font-medium text-gray-900 dark:text-white">
							Student
						</h3>
						<div>
							<label
								for="full_name"
								className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
								Full Name
							</label>
							<input
								type="text"
								name="full_name"
								id="full_name"
								className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
								placeholder="name"
								required=""
								value={formSate.full_name}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label
								for="email"
								className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
								email
							</label>
							<input
								type="email"
								name="email"
								id="email"
								className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
								placeholder="name@company.com"
								required=""
								value={formSate.email}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label
								for="password"
								className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
								password
							</label>
							<input
								type="password"
								name="pass"
								id="password"
								placeholder="••••••••"
								className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
								required=""
								value={formSate.pass}
								onChange={handleInputChange}
							/>
						</div>
						<button
							type="submit"
							className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
							{loading ? "Loading..." : "Save"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CreateUserModal;
