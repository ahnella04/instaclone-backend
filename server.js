require("dotenv").config(); // .env 파일에서 정보 읽어오기
import express from "express";
import loggger from "morgan";
import { typeDefs, resolvers } from "./schema";
import { ApolloServer } from "apollo-server-express";
import { getUser } from "./users/users.utils";
import { grapqlUploadExpress } from "graphql-upload";

const PORT = process.env.PORT;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // uploads: false,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
    }
  }
})

server.start();
const app = express();
app.use(loggger("tiny"));
// app.use(grapqlUploadExpress());
app.use("/static", express.static("uploads")); // 이 uploads 폴더를 static이라는 URL에 올리기
server.applyMiddleware({ app }); // Apollo Server한테 "이제 너 우리 Server랑 함께 작동해"
// app.use(logger("tiny"))는 applyMiddleware 앞에 두어야 함
await new Promise(resolve => app.listen({ port: PORT }, resolve));
console.log(`✅ Server is running on http://localhost:4000${server.graphqlPath} 🚀`)



// require("dotenv").config();
// import http from "http";
// import express from "express";
// import logger from "morgan";
// import { ApolloServer } from "apollo-server-express";
// import { typeDefs, resolvers } from "./schema";
// import { getUser } from "./users/users.utils";

// const PORT = process.env.PORT;
// const apollo = new ApolloServer({
//   resolvers,
//   typeDefs,
//   context: async (ctx) => {
//     if (ctx.req) {
//       return {
//         loggedInUser: await getUser(ctx.req.headers.token),
//       };
//     } else {
//       const {
//         connection: { context },
//       } = ctx;
//       return {
//         loggedInUser: context.loggedInUser,
//       };
//     }
//   },
//   subscriptions: {
//     onConnect: async ({ token }) => {
//       if (!token) {
//         throw new Error("You can't listen.");
//       }
//       const loggedInUser = await getUser(token);
//       return {
//         loggedInUser,
//       };
//     },
//   },
// });

// const app = express();
// app.use(logger("dev"));
// apollo.applyMiddleware({ app });
// app.use("/static", express.static("uploads"));

// const httpServer = http.createServer(app);
// apollo.installSubscriptionHandlers(httpServer);

// httpServer.listen(PORT, () => {
//   console.log(`🚀Server is running on http://localhost:${PORT} ✅`);
// })