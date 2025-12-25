import { defineConfig } from "vite";
import path from "path";

export default defineConfig(() => ({
    server: {
        host: "::",
        port: 8080,
        proxy: {
            "/api": "http://localhost:3000",
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
}));
