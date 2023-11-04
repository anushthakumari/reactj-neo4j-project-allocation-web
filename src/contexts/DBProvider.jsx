import { Neo4jProvider, createDriver } from "use-neo4j";

const driver = createDriver(
	process.env.REACT_APP_NEO_SCHEME,
	process.env.REACT_APP_NEO_HOST,
	process.env.REACT_APP_NEO_PORT,
	process.env.REACT_APP_NEO_USER,
	process.env.REACT_APP_NEO_PASS
);

const DBProvider = ({ children }) => {
	return <Neo4jProvider driver={driver}>{children}</Neo4jProvider>;
};

export default DBProvider;
