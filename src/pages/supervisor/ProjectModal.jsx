import React, { useState, useEffect } from "react";
import { useLazyWriteCypher } from "use-neo4j";
import { uid } from "uid";

import useAuth from "../../hooks/useAuth";

const c_query = `MATCH (user:User {user_id: $user_id})
CREATE (user)-[:CREATED]->(project:Project {
    project_id: $project_id,
    title: $title,
    description: $description,
    creation_date: timestamp(),
    asset_link: $asset_link
})
`;

const ProjectModal = ({ open, setOpen, defaultState, isEdit, onSave }) => {
	const user = useAuth();

	const [formSate, setformSate] = useState({
		title: "",
		description: "",
		asset_link: "",
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

		const title = formSate.title.trim();
		const description = formSate.description.trim();
		const asset_link = formSate.asset_link.trim();

		const project_id = uid();

		run({
			title,
			description,
			asset_link,
			project_id,
			user_id: user.user_id,
		}).then((e) => {
			alert("Saved Successfully!");
			setOpen(false);
			onSave({ user_id: user.user_id });
		});
	};

	if (error) {
		console.log(error);
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
							Project
						</h3>
						<div>
							<label
								htmlFor="title"
								className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
								Title
							</label>
							<input
								type="text"
								name="title"
								id="title"
								className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
								placeholder="tile"
								required=""
								value={formSate.title}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label
								htmlFor="desc"
								className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
								Description
							</label>
							<input
								type="text"
								name="description"
								id="desc"
								className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
								placeholder="description..."
								required=""
								value={formSate.description}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label
								for="asset_link"
								className="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300">
								Assest Link
							</label>
							<input
								type="url"
								name="asset_link"
								id="asset_link"
								placeholder="www.studymaterial.link/path/to/file"
								className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
								required=""
								value={formSate.asset_link}
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

export default ProjectModal;
