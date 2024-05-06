import server from "./server";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
