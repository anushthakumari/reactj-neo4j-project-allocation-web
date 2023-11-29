import React from "react";
import { useParams } from "react-router-dom";
import { useReadCypher, useLazyWriteCypher } from "use-neo4j";

import Layout from "../../layouts/Layout";
import UserSearch from "../../components/UserSearch";

import useAuth from "../../hooks/useAuth";
import roles from "../../constants/roles";

const project_query = `MATCH (project:Project {project_id: $project_id})<-[:CREATED]-(user:User)
RETURN project, user
`;

const assign_query = `MATCH (user:User {user_id: $user_id}), (project:Project {project_id: $project_id})
MERGE (user)-[:ASSIGNED_TO]->(project)
`;

const user_query = `MATCH (project:Project {project_id: $project_id})<-[:ASSIGNED_TO]-(user:User)
RETURN user
`;

const request_project_query = `MATCH (user:User {user_id: $user_id})
MATCH (project:Project {project_id: $project_id})
MERGE (user)-[:REQUEST_TO]->(project)
RETURN user, project
`;

const requested_users_query = `
MATCH (user:User)-[:REQUEST_TO]->(project:Project {project_id: $project_id})
RETURN user
`;

const accept_request_query = `MATCH (user:User {user_id: $user_id})-[request:REQUEST_TO]->(project:Project {project_id: $project_id})
DELETE request
CREATE (user)-[:ASSIGNED_TO]->(project)
RETURN user, project
`;

const reject_request_query = `MATCH (:User {user_id: $user_id})-[request:REQUEST_TO]->(:Project {project_id: $project_id})
DELETE request
`;

const ProjectDetails = () => {
	const { projectid } = useParams();

	const user = useAuth();

	//fetch queries
	const { loading, error, first } = useReadCypher(project_query, {
		project_id: projectid,
	});

	const fetch_assign_users = useReadCypher(user_query, {
		project_id: projectid,
	});

	const requested_users_res = useReadCypher(requested_users_query, {
		project_id: projectid,
	});

	//write and update query
	const [assign_user, assign_query_state] = useLazyWriteCypher(assign_query);
	const [request_to_join, request_query_state] = useLazyWriteCypher(
		request_project_query
	);
	const [accept_request, accept_query_state] =
		useLazyWriteCypher(accept_request_query);

	const [reject_request, reject_query_state] =
		useLazyWriteCypher(reject_request_query);

	const is_candidate = user.role_id === 1;

	let createdByDetails = {};
	let projectDetails = {};
	let assigned_users = [];
	let pending_users = [];
	let is_request_pending = false;

	if (fetch_assign_users.records) {
		assigned_users = fetch_assign_users.records.map(
			(row) => row.get("user").properties
		);
	} else {
		assigned_users = [];
	}

	if (requested_users_res.records) {
		pending_users = requested_users_res.records.map(
			(row) => row.get("user").properties
		);
	}

	is_request_pending =
		pending_users.findIndex((v) => v.user_id === user.user_id) > -1;

	let is_user_assigned =
		assigned_users.findIndex((v) => v.user_id === user.user_id) > -1;

	if (first) {
		projectDetails = first.get("project").properties;
		createdByDetails = first.get("user").properties;
	}

	let is_user_is_creator = createdByDetails.user_id === user.user_id;

	//handlers
	const handleSelect = (user) => {
		assign_user({ user_id: user.user_id, project_id: projectid })
			.then(() => {
				alert("user is assigned!!");
				fetch_assign_users.run({ project_id: projectid });
			})
			.catch(() => {
				alert("Failed to assign a user!");
			});
	};

	const handleAccept = (user) => {
		accept_request({ user_id: user.user_id, project_id: projectid })
			.then(() => {
				alert("user is assigned to the project!!");
				fetch_assign_users.run({ project_id: projectid });
				requested_users_res.run({ project_id: projectid });
			})
			.catch(() => {
				alert("Failed to assign a user to the project!");
			});
	};

	const handleReject = (user) => {
		reject_request({ user_id: user.user_id, project_id: projectid })
			.then(() => {
				alert("Request is rejected!!");
				fetch_assign_users.run({ project_id: projectid });
				requested_users_res.run({ project_id: projectid });
			})
			.catch(() => {
				alert("Failed to reject!");
			});
	};

	const handleRequest = () => {
		request_to_join({ user_id: user.user_id, project_id: projectid })
			.then(() => {
				alert("Request has been sent!");
				requested_users_res.run({
					project_id: projectid,
				});
			})
			.catch(() => {
				alert("Requesting has been failed!");
			});
	};

	if (error) {
		alert("Something went wrong!!");
	}

	return (
		<Layout>
			{loading ? <center>Loading...</center> : ""}
			<div class="container mx-auto py-8">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div class="bg-white p-8 rounded shadow">
						<h1 class="text-3xl font-bold mb-4 capitalize">
							{projectDetails.title}
						</h1>
						<p class="mb-4">{projectDetails.description}</p>
						<div className="flex items-center">
							<p>Asset Link: </p>
							<a
								className="underline text-blue-500"
								target="_blank"
								rel="noreferrer"
								href={projectDetails.asset_link}>
								{projectDetails.asset_link}
							</a>
						</div>
						<p class="mb-4">
							Created By: <strong>{createdByDetails.full_name}</strong>
						</p>
					</div>

					<div class="bg-white p-8 rounded shadow flex flex-col gap-2">
						<div className="flex justify-between items-center">
							<h2 class="text-2xl font-bold mb-4">Assigned Candidates</h2>

							{user.role_id === roles.SUPERVISIOR ? (
								<div>
									<p> Assign Candidates By Searching</p>
									<UserSearch onSelect={handleSelect} />
								</div>
							) : (
								""
							)}
						</div>
						<ul class="space-y-4">
							{assign_query_state.loading || fetch_assign_users.loading ? (
								<li>Loading...</li>
							) : (
								""
							)}
							{!assigned_users.length ? <li>No Candidates Assigned!</li> : ""}

							{assigned_users.map((v) => (
								<li key={v.user_id} class="flex items-center space-x-4">
									<img
										src="https://via.placeholder.com/50"
										alt="User Avatar"
										class="w-10 h-10 rounded-full"
									/>
									<div>
										<h3 class="text-md font-semibold capitalize">
											{v.full_name}
										</h3>
									</div>
								</li>
							))}
						</ul>
						{!is_user_assigned && is_candidate ? (
							<button
								onClick={handleRequest}
								className={`bg-${
									is_request_pending ? "red" : "blue"
								}-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
								disabled={is_request_pending || request_query_state.loading}>
								{request_query_state.loading
									? "Loading..."
									: is_request_pending
									? "Request Is Pending"
									: "Request to join"}
							</button>
						) : null}
					</div>

					{is_user_is_creator ? (
						<div class="bg-white p-8 rounded shadow flex flex-col gap-2">
							<h2 class="text-2xl font-bold mb-4">Pending Requets</h2>
							<ul className="flex flex-col gap-3">
								{requested_users_res.loading ? <li>Loading...</li> : ""}
								{!pending_users.length ? <li>No Pending Requets.</li> : ""}
								{pending_users.map((v) => (
									<li
										key={v.user_id}
										className="flex justify-between space-x-4">
										<div className="flex items-center space-x-4">
											<img
												src="https://via.placeholder.com/50"
												alt="User Avatar"
												class="w-10 h-10 rounded-full"
											/>
											<div>
												<h3 class="text-md font-semibold capitalize">
													{v.full_name}
												</h3>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<button
												onClick={() => handleAccept(v)}
												className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
												disabled={accept_query_state.loading}>
												{accept_query_state.loading ? "Loading..." : "Accept"}
											</button>
											<button
												onClick={() => handleReject(v)}
												className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
												disabled={reject_query_state.loading}>
												{reject_query_state.loading ? "Loading..." : "Reject"}
											</button>
										</div>
									</li>
								))}
							</ul>
						</div>
					) : null}
				</div>
			</div>
		</Layout>
	);
};

export default ProjectDetails;
