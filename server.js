require("dotenv").config(); // .env 파일에서 정보 읽어오기
import http from "http";
import express from "express";
import loggger from "morgan";
import { typeDefs, resolvers } from "./schema";
import { ApolloServer } from "apollo-server-express";
import { getUser } from "./users/users.utils";
import { graphqlUploadExpress } from "graphql-upload";

// console.log(pubsub)

async function startApolloServer(typeDefs, resolvers) {
  const PORT = process.env.PORT;
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    uploads: false,
    context: async (ctx) => {
      if (ctx.req) {
        return {
          loggedInUser: await getUser(ctx.req.headers.token),
        } // 웹소켓에서 loggedInUser에 접근할 수 있음
      } else {
        // console.log(ctx)
        const { connection: { context } } = ctx;
        return {
          loggedInUser: context.loggedInUser
        }
      }
    },
    subscriptions: {
      onConnect: async ({ token }) => {
        // console.log(params) ===> token
        if (!token) {
          throw new Error("You can't listen.")
        } // 이 경우는 모든 subscriptions이 private해야 한다는 것을 뜻함
        const loggedInUser = await getUser(token)
        // console.log(user)
        return {
          loggedInUser
        }
      } // onConnect는 이뤄지는 순간에 우리에게 HTTP headers를 줌
    }
  });

  await server.start();
  const app = express();
  app.use(graphqlUploadExpress());
  app.use(loggger("tiny"));
  server.applyMiddleware({ app }); // Apollo Server한테 "이제 너 우리 Server랑 함께 작동해"
  app.use("/static", express.static("uploads"))

  const httpServer = http.createServer(app);
  server.installSubscriptionHandlers(httpServer)

  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`✅ Server is running on http://localhost:${server.graphqlPath} 🚀`)
}

startApolloServer(typeDefs, resolvers)

