import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // proxy: {
    //   "/user": {
    //     target: "http://121.174.150.125:8000",
    //     // target: "http://localhost:8000",
    //     secure: false,
    //   },
    //   "/main": {
    //     target: "http://121.174.150.125:8000",
    //     // target: "http://localhost:8000",
    //     secure: false,
    //   },
    // },
  },
});
