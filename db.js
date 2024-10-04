import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "project",
  password: "123456",
  port: 5432,
});

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database successfully.");
  } catch (error) {
    console.error("Connection to database failed:", error);
  }
};

export { client, connectToDatabase };
