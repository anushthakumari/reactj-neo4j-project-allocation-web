//Crearing roles
CREATE (:Role {role_id: 1, role_name: 'User'})
CREATE (:Role {role_id: 2, role_name: 'Supervisor'})
CREATE (:Role {role_id: 3, role_name: 'Admin'})


// Creating the User node for John Doe with a unique user_id
CREATE (user:User {
    user_id: 'U123',  // Unique user_id
    full_name: 'John Doe',
    email: 'john@mail.com',
    password: '12345'
})


//assigning role user
MATCH (user:User {user_id: 'U123'})
MATCH (role:Role {role_id: 1})
CREATE (user)-[:HAS_ROLE]->(role)


// Creating the User node for Amy with a unique user_id
CREATE (user:User {
    user_id: 'U124',  // Unique user_id
    full_name: 'Amy Doe',
    email: 'amy@mail.com',
    password: '12345'
})


//assigning role supervisior to amy
MATCH (user:User {user_id: 'U123'})
MATCH (role:Role {role_id: 2})
CREATE (user)-[:HAS_ROLE]->(role)

// Creating the User node for admin Doe with a unique user_id
CREATE (user:User {
    user_id: 'U125',  // Unique user_id
    full_name: 'Admin Doe',
    email: 'admin@mail.com',
    password: '12345'
})


//assigning role to admin
MATCH (user:User {user_id: 'U125'})
MATCH (role:Role {role_id: 3})
CREATE (user)-[:HAS_ROLE]->(role)


/// how to assign a project
// Create a Project node with a creation_date property
MERGE (project:Project {
    project_id: 'P001',
    title: 'Project Title',
    description: 'Project Description',
    asset_link: 'https://example.com',
    creation_date: date('2023-11-06') // Date format: 'YYYY-MM-DD'
})

// Find the Supervisor by their user_id and role_id
MATCH (supervisor:User {user_id: 'S123'})-[:HAS_ROLE]->(supervisor_role:Role {role_id: 2})

// Find the Users to whom the project is to be assigned by their user_ids and role_ids (regular users)
MATCH (user:User {user_id: 'U123'})-[:HAS_ROLE]->(user_role:Role {role_id: 1})
MATCH (another_user:User {user_id: 'U456'})-[:HAS_ROLE]->(user_role)

// Create relationships to the Project node
MERGE (supervisor)-[:ASSIGNED_PROJECT]->(project)
MERGE (user)-[:WORKS_ON]->(project)
MERGE (another_user)-[:WORKS_ON]->(project)
