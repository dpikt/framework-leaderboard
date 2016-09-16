var m = require("./mithril.min.js");

// Add function that automatically gets and sets ETags for requests
m.etagCache = {};
m.requestAndCache = function (args) {
  var tagKey = args.url;
  args.config = function(req) { 
    if (!args.forced) req.setRequestHeader('If-None-Match', m.etagCache[tagKey]);
  };
  args.extract = function(req) {
    m.etagCache[tagKey] = req.getResponseHeader('ETag');
    return req.responseText ? req.responseText : null;
  };
  return m.request(args);
};

module.exports = m;