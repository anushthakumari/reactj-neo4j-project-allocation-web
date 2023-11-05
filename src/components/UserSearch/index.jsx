import React, { useState } from "react";
import { useReadCypher } from "use-neo4j";

import "./UserSearch.css";

const query = `MATCH (user:User)-[:HAS_ROLE]->(role:Role {role_id: 1})
RETURN user {.*, password: null} AS user`;

const UserSearch = ({ onSelect }) => {
	const [search, setSearch] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [activeSuggestion, setActiveSuggestion] = useState(0);

	const { loading, error, records } = useReadCypher(query);

	const suggestions = [];

	if (records) {
		records.forEach((record) => {
			const user = record.get("user");
			suggestions.push(user);
		});
	} else {
		suggestions.length = 0;
	}

	const onSearchChange = (e) => {
		const userInput = e.currentTarget.value;
		setSearch(userInput);

		const filtered = suggestions.filter(
			(suggestion) =>
				suggestion.full_name.toLowerCase().indexOf(userInput.toLowerCase()) > -1
		);

		setFilteredUsers(filtered);
	};

	const onClick = (index) => {
		setActiveSuggestion(index);
		setSearch(filteredUsers[index].full_name);
		onSelect?.(filteredUsers[index]);
	};

	if (loading) {
		return <h1>Loading...</h1>;
	}

	if (error) {
		return (
			<h1 className="text-red-500">
				Something went wrong while fetching user details.
			</h1>
		);
	}

	return (
		<div className="relative">
			<div className="UserSearch absolute">
				<div className="input-group">
					<input
						type="text"
						className="input-group input"
						placeholder="Search for a user"
						value={search}
						onChange={onSearchChange}
					/>
				</div>
				{filteredUsers.length > 0 && (
					<ul className="suggestions-list">
						{filteredUsers.map((suggestion, index) => (
							<li
								key={index}
								className={`suggestion-item ${
									index === activeSuggestion ? "bg-gray-200" : ""
								}`}
								onClick={() => onClick(index)}>
								<div>{suggestion.name}</div>
								<div>{suggestion.email}</div>
								<div>{suggestion.age}</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default UserSearch;
