function requestHandler(req, res) {
  console.log(req.method, req.url, req.headers["host"]);
  if (req.url === "/") {
    res.end("Welcome to Expense Tracker Home");
    return;
  } else if (req.url === "/transactions") {
    if (req.method === "POST") {
      const chunks = [];
      let body = "";
      req.on("data", (chunk) => {
        chunks.push(chunk);
      });
      req.on("end", () => {
        body = Buffer.concat(chunks).toString("utf8");
        const params = new URLSearchParams(body);
        const amount = params.get("amount");
        const category = params.get("category");
        console.log(`Amount: ${amount}, Category:${category}`);
        res.end("Transaction Received");
      });
    } else {
      res.end("Transaction List");
    }
    return;
  } else if (req.url === "/budgets") {
    res.end("Monthly Budgets");
    return;
  } else if (req.url === "/old-transactions") {
    res.statusCode = 302;
    res.setHeader("location", "/transactions");
    res.end();
    return;
  } else if (req.url === "/add-transaction") {
    res.setHeader("Content-Type", "text/html");
    res.write(
      '<form action="/transactions" method="POST"><input type="number" name="amount"/><input type="text" name="category"/><button type="submit">Save</button></form>',
    );
    res.end();
    return;
  } else {
    res.statusCode = 404;
    res.end("Page Not Found");
    return;
  }
}
module.exports = requestHandler;
