const express = require("express");
const parkingController = require("./src/controllers/parkingController"); // ✅ fix the path as needed

const app = express();

app.use(express.json());
app.use("/api/parking", parkingController);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
