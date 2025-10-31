import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// Custom plugin to transform import paths
function transformImportPaths(appName: string) {
  const clientlibBase = `/etc.clientlibs/${appName}/clientlibs/clientlib-shared`;

  return {
    name: "transform-import-paths",
    generateBundle(options, bundle) {
      // Transform import statements in each chunk
      Object.keys(bundle).forEach((fileName) => {
        const chunk = bundle[fileName];
        if (chunk.type === "chunk" && chunk.code) {
          // Get the directory of the current chunk relative to the output directory
          const chunkDir = fileName.split("/").slice(0, -1).join("/");
          // Calculate relative path from chunk to clientlib base
          const relativeToBase = chunkDir ? chunkDir : "";
          const clientlibPath = `${clientlibBase}${relativeToBase ? `/${relativeToBase}/` : "/"}`;

          // Replace relative imports with absolute AEM clientlib paths
          chunk.code = chunk.code.replace(
            /from\s+["']\.\/([^"']+)["']/g,
            `from "${clientlibPath}$1"`,
          );

          // Also handle dynamic imports
          chunk.code = chunk.code.replace(
            /import\s*\(\s*["']\.\/([^"']+)["']\s*\)/g,
            `import("${clientlibPath}$1")`,
          );
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [
      preact(),
      ...(isProduction ? [transformImportPaths("pichat")] : []),
    ],
    define: {
      // Define environment variables
      "process.env.NODE_ENV": JSON.stringify(mode),
      "process.env.CHROMATIC": true,
    },
    build: isProduction
      ? {
          manifest: true,
          rollupOptions: {
            output: {
              chunkFileNames: "resources/[name]-[hash].js",
              assetFileNames: "resources/[name]-[hash][extname]",
            },
          },
          lib: {
            entry: {
              chatbot: "src/components/chat/index.jsx",
              config: "src/config/index.jsx",
            },
            name: "AEM Pichat",
            formats: ["es"],
          },
        }
      : undefined,
    server: {
      proxy: {
        "/bin": {
          target: "http://localhost:4502",
          secure: false,
          auth: "admin:admin",
        },
      },
    },
  };
});
