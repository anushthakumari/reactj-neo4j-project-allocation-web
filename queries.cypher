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