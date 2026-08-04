import http from "http";
import app from "./app.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 8003;

server.listen(PORT, () => {
    console.log(`Employee Service is running on port ${PORT}`);
});

export default server;