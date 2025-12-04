import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4001/graphql", // ou l'URL de ton API
  documents: "graphql/**/*.gql", // tes fichiers .graphql
  generates: {
    "graphql/__generated__/graphql.ts": {
      // dossier pour les types générés
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
    },
  },
  ignoreNoDocuments: true,
};

export default config;
