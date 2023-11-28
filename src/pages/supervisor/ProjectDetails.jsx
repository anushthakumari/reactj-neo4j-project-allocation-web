import React, { useState } from "react";
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

const has_user_requested_query = `MATCH (user:User {user_id: $user_id})-[:REQUEST_TO]->(project:Project {project_id: $project_id})
RETURN COUNT(user) > 0 AS hasRequested
`;

const requested_users_query = `
MATCH (user:User)-[:REQUEST_TO]->(project:Project {project_id: $project_id})
RETURN user
`;

const accept_request_query = `MATCH (user:User {user_id: 'your_user_id'})-[request:REQUEST_TO]->(project:Project {project_id: 'your_project_id'})
DELETE request
CREATE (user)-[:ASSIGNED_TO]->(project)
RETURN user, project
`;

const ProjectDetails = () => {
	const { projectid } = useParams();

	const [isRequesting, setisRequesting] = useState(false);

	const user = useAuth();

	const { loading, error, first } = useReadCypher(project_query, {
		project_id: projectid,
	});

	const fetch_assign_users = useReadCypher(user_query, {
		project_id: projectid,
	});

	const is_user_has_requested_q_res = useReadCypher(has_user_requested_query, {
		project_id: projectid,
		user_id: user.user_id,
	});

	const requested_users_res = useReadCypher(requested_users_query, {
		project_id: projectid,
	});

	const [assign_user, assign_query_state] = useLazyWriteCypher(assign_query);
	const [request_to_join, request_query_state] = useLazyWriteCypher(
		request_project_query
	);

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

	if (is_user_has_requested_q_res.first) {
		is_request_pending = is_user_has_requested_q_res.first.get("hasRequested");
	}

	if (requested_users_res.records) {
		pending_users = requested_users_res.records.map(
			(row) => row.get("user").properties
		);
	}

	let is_user_assigned =
		assigned_users.findIndex((v) => v.user_id === user.user_id) > -1;
	let is_candidate = user.role_id === 1;

	if (first) {
		projectDetails = first.get("project").properties;
		createdByDetails = first.get("user").properties;
	}

	let is_user_is_creator = createdByDetails.user_id === user.user_id;

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

	const handleRequest = () => {
		setisRequesting(true);
		request_to_join({ user_id: user.user_id, project_id: projectid })
			.then(() => {
				alert("Request has been sent!");
				is_user_has_requested_q_res.run({
					project_id: projectid,
					user_id: user.user_id,
				});
			})
			.catch(() => {
				alert("Requesting has been failed!");
			})
			.finally((e) => {
				setisRequesting(false);
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
								class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
								disabled={is_request_pending || isRequesting}>
								{isRequesting
									? "Loading..."
									: is_request_pending
									? "Pending"
									: "Request to join"}
							</button>
						) : null}
					</div>

					{is_user_is_creator ? (
						<div class="bg-white p-8 rounded shadow flex flex-col gap-2">
							<h2 class="text-2xl font-bold mb-4">Pending Requets</h2>
							{pending_users.map((v) => (
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
						</div>
					) : null}
				</div>
			</div>
		</Layout>
	);
};

export default ProjectDetails;
