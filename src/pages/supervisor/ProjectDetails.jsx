import React from "react";
import { useParams } from "react-router-dom";
import { useReadCypher, useLazyWriteCypher } from "use-neo4j";

import Layout from "../../layouts/Layout";
import UserSearch from "../../components/UserSearch";

const project_query = `MATCH (project:Project {project_id: $project_id})<-[:CREATED]-(user:User)
RETURN project, user
`;

const assign_query = `MATCH (user:User {user_id: $user_id}), (project:Project {project_id: $project_id})
MERGE (user)-[:ASSIGNED_TO]->(project)
`;

const user_query = `MATCH (project:Project {project_id: $project_id})<-[:ASSIGNED_TO]-(user:User)
RETURN user
`;

const ProjectDetails = () => {
	const { projectid } = useParams();

	const { loading, error, first } = useReadCypher(project_query, {
		project_id: projectid,
	});

	const fetch_assign_users = useReadCypher(user_query, {
		project_id: projectid,
	});

	const [assign_user, assign_query_state] = useLazyWriteCypher(assign_query);

	let createdByDetails = {};
	let projectDetails = {};
	let assigned_users = [];

	if (fetch_assign_users.records) {
		assigned_users = fetch_assign_users.records.map(
			(row) => row.get("user").properties
		);
	} else {
		assigned_users = [];
	}

	if (first) {
		projectDetails = first.get("project").properties;
		createdByDetails = first.get("user").properties;
	}

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
						<p class="mb-4">Created By: {createdByDetails.full_name}</p>
					</div>

					<div class="bg-white p-8 rounded shadow">
						<div className="flex justify-between items-center">
							<h2 class="text-2xl font-bold mb-4">Assigned Candidates</h2>

							<div>
								<p> Assign Candidates By Searching</p>
								<UserSearch onSelect={handleSelect} />
							</div>
						</div>
						<ul class="space-y-4">
							{assign_query_state.loading ? <li>Loading...</li> : ""}
							{fetch_assign_users.loading ? <li>Loading...</li> : ""}

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
										<a href="#" class="text-blue-500">
											See Details
										</a>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default ProjectDetails;
