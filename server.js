require("dotenv").config(); // .env 파일에서 정보 읽어오기
import { typeDefs, resolvers } from "./schema.js";
import { ApolloServer } from "apollo-server";
import { getUser, protectResolver } from "./users/users.utils.js";

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      protectResolver
    }
  }
});

const PORT = process.env.PORT;

server
  .listen(PORT)
  .then(() => console.log(`Server is running on http://localhost:${PORT}`));
