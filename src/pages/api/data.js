import { Database } from "/src/lib/sensor_data";

// For SSE
const INTERVAL = 50; //ms
const ID = "sensor1";

export default function handler(req, res) {
  const db = new Database();

  if (req.method == "POST") {
    const value = req.body.value;
    // console.log(`received: ${value}`);
    db.appendData(value);
    res.headers = [
      {
        key: "Keep-Alive",
        value: false,
      },
    ];
    return res.status(200).end();
  }

  if (req.method == "GET") {
    // For any other verb, just treat as GET
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // Keep sending SSE on a timer
    setInterval(() => {
      sendSSE(res, ID, db.getData());
    }, INTERVAL);

    // Send initial SSE
    return sendSSE(res, ID, db.getData());
  }
}

/**
 * Sends SSE to browser.
 * @param res Response object
 * @param id Optional, used to identify a specific event source
 * @param data The payload that will be sent (available on the SSE `data` prop
 *             as a JSON encoded string).
 */
function sendSSE(res, id, value) {
  if (value > -1) {
    console.log(`sending value: ${value}`);
  }
  res.write("id: " + id + "\n");
  res.write("data: " + value.toString() + "\n");
  res.write("\n");
  res.flush();
}
