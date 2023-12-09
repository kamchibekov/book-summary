import * as http from "http";
import path from "path";
import fs from "fs";

const server = http.createServer((req, res) => {
  const url = req.url == "/" ? "/index.html" : req.url;
  let filePath = path.join(path.resolve(), url);
  try {
    const stat = fs.statSync(filePath);
  } catch (error) {
    filePath = path.join(path.resolve(), "public" + url);
  }

  const ext = path.extname(filePath);

  let contentType;

  if (!ext) {
    contentType = "text/html";
    filePath = path.join(path.resolve(), "public/index.html");
  } else
    switch (ext) {
      case ".html":
        contentType = "text/html";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".js":
        contentType = "text/javascript";
        break;
      default:
        contentType = "text/plain";
        break;
    }

  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
