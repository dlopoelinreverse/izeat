import "reflect-metadata";
import express from "express";
import http from "http";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import DataBase from "./data-base";
import schema from "./schema";

const port = process.env.BACKEND_PORT || 4001;
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(",") ?? [];

schema.then(async (builtSchema) => {
  await DataBase.initialize();

  const app = express();
  const httpServer = http.createServer(app);

  // WebSocket server pour les subscriptions GraphQL
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema: builtSchema }, wsServer);

  const server = new ApolloServer({
    schema: builtSchema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  const corsConfig = { origin: allowedOrigins, credentials: true };

  app.use(cors(corsConfig));

  const context = async ({
    req,
    res,
  }: {
    req: express.Request;
    res: express.Response;
  }) => ({ req, res });

  app.use(express.json(), expressMiddleware(server, { context }));

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
  console.log(`🔌 WebSocket subscriptions ready at ws://localhost:${port}/graphql`);
});
