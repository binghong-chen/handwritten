// Create a new abort controller
const controller = new AbortController();

const signal = controller.signal;

// Create a request with this controller's AbortSignal object
const req = new Request("https://www.baidu.com", { signal });

// Add an event handler logging a message in case of abort
req.signal.addEventListener("abort", () => {
  console.log("abort");
});

// In case of abort, log the AbortSignal reason, if any
fetch(req)
  .then((res) => {
    console.log(res);
    res.text().then(console.log);
  })
  .catch(() => {
    if (signal.aborted) {
      if (signal.reason) {
        console.log(`Request aborted with reason: ${signal.reason}`);
      } else {
        console.log("Request aborted but no reason was given.");
      }
    } else {
      console.log("Request not aborted, but terminated abnormally.");
    }
  });

// Actually abort the request
// controller.abort("就是要终止");
