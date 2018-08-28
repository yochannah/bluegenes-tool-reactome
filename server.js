//this is a quick server to allow proxying for the reactome pathway viewer -
// unfortunately without the proxy config the reactome viewer can't work.

const handler = require('serve-handler');
const http = require('http');

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/zeit/serve-handler#options
  return handler(request, response, {"redirects":[{"source" : "/reactome", "destination" : "https://reactome.org"}]});
})

server.listen(3000, () => {
  console.log('Running at http://localhost:3000');
});
