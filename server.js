require("dotenv").config(); // .env 파일에서 정보 읽어오기
import express from "express";
import loggger from "morgan";
import { typeDefs, resolvers } from "./schema";
import { ApolloServer } from "apollo-server-express";
import { getUser } from "./users/users.utils";

async function startApolloServer(typeDefs, resolvers) {
  const PORT = process.env.PORT;
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      return {
        loggedInUser: await getUser(req.headers.token),
      }
    }
  });

  await server.start();
  const app = express();
  app.use(loggger("tiny"));
  app.use("/static", express.static("uploads")); // 이 uploads 폴더를 static이라는 URL에 올리기
  server.applyMiddleware({ app }); // Apollo Server한테 "이제 너 우리 Server랑 함께 작동해"
  // app.use(logger("tiny"))는 applyMiddleware 앞에 두어야 함
  await new Promise(resolve => app.listen({ port: PORT }, resolve));
  console.log(`✅ Server is running on http://localhost:4000${server.graphqlPath} 🚀`)
}

startApolloServer(typeDefs, resolvers)