var m = require('./mithril+extensions.js');

/* REPO MODEL */
var Repo = function (name) {
  var self = this;
  self.name = m.prop('');
  self.url = m.prop('');
  self.stars = m.prop(0);
  self.forks = m.prop(0);
  self.commits = m.prop(0);
  self.fetchData = function (forced) {
    // Get main repo info
    m.requestAndCache({ method: 'GET', url: 'https://api.github.com/repos/' + name, forced: forced }).then(function (res) {
      self.name(res.name);
      self.url(res.html_url);
      self.stars(res.stargazers_count);
      self.forks(res.forks);
    });
    // Get commit info (separate call)
    m.requestAndCache({ method: 'GET', url: 'https://api.github.com/repos/' + name + '/stats/participation', forced: forced }).then(function (res) {
      self.commits(res.all[res.all.length-1]);
    });
  };
  // Initial fetch
  self.fetchData(true);
};

module.exports = Repo;