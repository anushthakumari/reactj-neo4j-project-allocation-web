import React from "react";
import { useReadCypher } from "use-neo4j";
import { Link } from "react-router-dom";

import Layout from "../../layouts/Layout";

const query = `MATCH (project:Project)<-[:CREATED]-(user:User)
RETURN project, user`;

const ProjectList = () => {
	const { loading, error, records } = useReadCypher(query);

	let data = [];

	if (records) {
		records.forEach((record) => {
			const project = record.get("project").properties;
			const createdByDetails = record.get("user").properties;
			data.push({ ...project, ...createdByDetails });
		});
	} else {
		data = [];
	}

	if (error) {
		console.log(error);
		alert("something went wrong!");
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
										All projects
									</h3>
								</div>
							</div>
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
											Project ID
										</th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											Title
										</th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											Description
										</th>

										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											Created By
										</th>
										<th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
											Details
										</th>
									</tr>
								</thead>

								<tbody>
									{!data.length ? (
										<tr>
											<td colSpan={4}>
												<center className="text-lg">No Data Found!</center>
											</td>
										</tr>
									) : (
										""
									)}
									{data.map((v) => (
										<tr key={v.project_id}>
											<th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
												{v.project_id}
											</th>

											<td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
												{v.title}
											</td>
											<td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
												{v.description}
											</td>
											<td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
												{v.full_name}
											</td>
											<td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
												<Link
													to={"/project/" + v.project_id}
													className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
													type="button">
													See Details
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</section>
		</Layout>
	);
};

export default ProjectList;
