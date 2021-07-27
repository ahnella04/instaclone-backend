require("dotenv").config(); // .env 파일에서 정보 읽어오기
import schema from "./schema.js";
import { ApolloServer } from "apollo-server";

const server = new ApolloServer({
  schema
});

const PORT = process.env.PORT;

server
  .listen(PORT)
  .then(() => console.log(`Server is running on http://localhost:${PORT}`));
