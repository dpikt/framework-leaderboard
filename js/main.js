var m = require('./mithril+extensions.js');
var SortableTable = require('./sortable-table.js');
var Repo = require('./repo.js');

/* MAIN COMPONENT */
var Main = {

  viewmodel: {
    newRepoName: m.prop(''),   // Text for the "Add repo" form
    messageText: m.prop(''),   // Text for flash message
    flashing: m.prop(false),   // Whether flash message is visible
  },

  controller: function () {
    var self = this;
    var vm = Main.viewmodel;
    // Here's where we store our repo objects
    self.repos = m.prop([
      new Repo('angular/angular'), 
      new Repo('facebook/react'), 
      new Repo('emberjs/ember.js'), 
      new Repo('vuejs/vue'),
    ]);
    // Repo actions
    self.deleteRepo = function (toDelete) {
      self.repos(self.repos().filter(function (repo) {
        return (repo.name() != toDelete.name());
      }));
    };
    self.addRepo = function (name) {
      // Let's check if it's real first
      m.request({ method: 'GET', url: 'https://api.github.com/repos/' + name }).then(function (res) {
        self.repos(self.repos().concat([new Repo(name)]));
        vm.newRepoName('');
      }).catch(function (e) {
        self.flashMessage('Repository not found.');
      });
    };
    self.fetchRepoData = function () {
      self.repos().map(function (repo) {
        repo.fetchData();
      });
    };
    self.flashMessage = function (message) {
      vm.messageText(message);
      vm.flashing(true);
      setTimeout(function () {
        vm.flashing(false);
      }, 2000);
    };
    // Refresh data every 5 seconds
    setInterval(self.fetchRepoData, 5000);
  },

  view: function (ctrl) {
    var vm = Main.viewmodel;
    return m('div.container', [
      m('h2.title', 'Framework Leaderboard'),
      // Our main table
      m(SortableTable, {
        data: ctrl.repos,
        columns: [
          {name: 'Name', prop: 'name'},
          {name: 'Stars', prop: 'stars'},
          {name: 'Forks', prop: 'forks'},
          {name: 'Commits This Week', prop: 'commits'},
        ],
        href: 'url',
        sortBy: 'stars',
        onDelete: function (repo) {
          ctrl.deleteRepo(repo);
        }
      }),
      // "Add repo" form
      m('form.row', {
        onsubmit: function (e) {
          e.preventDefault();
          if (vm.newRepoName().length) ctrl.addRepo(vm.newRepoName());
        }
      }, [
        m('input.nine.columns', {
          type: 'text',
          placeholder: 'E.g. lhorie/mithril.js',
          oninput: m.withAttr('value', vm.newRepoName),
          value: vm.newRepoName()
        }),
        m('button.three.columns', 'Add Repo')
      ]),
      m('p.flash-message', { 
        class: vm.flashing() ? 'flashing' : '',
      }, vm.messageText())
    ]);
  },
};

m.mount(document.body, Main);
