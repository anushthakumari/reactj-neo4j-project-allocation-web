import React, { useState } from "react";
import { useReadCypher } from "use-neo4j";

import Layout from "../../layouts/Layout";
import CreateUserModal from "./CreateUserModal";

import roles from "../../constants/roles";

const query = `MATCH (user:User)-[:HAS_ROLE]->(role:Role {role_id: 1})
RETURN user {.*, password: null} AS user`;

const UserList = () => {
	const { loading, error, records, run } = useReadCypher(query);
	const [open, setOpen] = useState(false);

	let data = [];

	if (records) {
		records.forEach((record) => {
			const user = record.get("user");
			data.push(user);
		});
	} else {
		data = [];
	}

	if (error) {
		alert("something went wrong!s");
	}

	return (
		<Layout>
			<section className="py-1 bg-blueGray-50">
				<div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
					<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
						<div className="flex justify-between rounded-t mb-0 px-4 py-3 border-0">
							<div className="flex flex-wrap items-center">
								<div className="relative w-full px-4 max-w-full flex-grow flex-1">
									<h3 className="font-semibold text-base text-blueGray-700">
										All Candidates
									</h3>
								</div>
							</div>
							<button
								onClick={() => setOpen(true)}
								className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
								type="button">
								Create User
							</button>
						</div>

						<div className="block w-full overflow-x-auto">
							{loading ? (
								<h1 className="px-4 text-center text-lg">Loading...</h1>
							) : (
								""
							)}
							<table className="items-center bg-transparent w-full border-collapse ">
								<thead>
									<tr>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											User ID
										</th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											Full Name
										</th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											Email
										</th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											Details
										</th>
									</tr>
								</thead>

								<tbody>
									{data.map((v) => (
										<tr key={v.user_id}>
											<th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
												{v.user_id}
											</th>

											<td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
												{v.full_name}
											</td>
											<td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
												{v.email}
											</td>
											<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
												<button
													className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
													type="button">
													See Details
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>
			<CreateUserModal
				open={open}
				setOpen={setOpen}
				roleId={roles.USER}
				onSave={run}
			/>
		</Layout>
	);
};

export default UserList;
