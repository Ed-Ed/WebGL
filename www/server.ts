import express from "express";
import path from "path";

const app = express();
const port = 80;

app.use(express.static(path.resolve("public")));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.listen(port, () => console.log(`\nServer listening on port ${port}\n`));
