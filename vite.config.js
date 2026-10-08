import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({ base: "/image-compression-preview/", build: { sourcemap: false }, plugins: [react()] });
