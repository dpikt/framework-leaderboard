var m = require('./mithril+extensions.js');

/* SORTABLE TABLE COMPONENT */
var SortableTable = {

  viewmodel: {
    init: function (args) {
      var vm = SortableTable.viewmodel;
      vm.data = args.data || m.prop([]);        // Array of data, one item per row
      vm.columns = args.columns || m.prop([]);  // Array of columns, [{name, property}]
      vm.href = args.href || m.prop('');        // Data property of href for first column
      vm.sortingBy = m.prop(args.sortBy);       // Property to sort by
      vm.ascending = m.prop(false);             // Direction of sort
    }
  },

  controller: function(args) {
    var self = this;
    var vm = SortableTable.viewmodel;
    vm.init(args);
    self.onDelete = args.onDelete;
    self.sortByProp = function (prop) {
      // If column is already selected, reverse order
      if (vm.sortingBy() == prop) vm.ascending(!vm.ascending());
      vm.sortingBy(prop);
      vm.data().sort(function(a, b) {
        return a[prop]() > b[prop]() ? 1 : a[prop]() < b[prop]() ? -1 : 0;
      });
      // Reverse items if ascending order
      if (vm.ascending()) vm.data().reverse();
    };
    // Initial sort
    self.sortByProp(vm.sortingBy());
  },

  view: function(ctrl) {
    var vm = SortableTable.viewmodel;
    return m('table.sort-table u-full-width', {
      onclick: function (e) {
        // Callback for clicking table headers
        if (e.target.getAttribute('sortBy')) ctrl.sortByProp(e.target.getAttribute('sortBy'));
      }
    }, [
      m('thead', [
        m('tr', [
          // Populate headers
          vm.columns.map(function (column) {
            var classes = '';
            if (vm.sortingBy() == column.prop) {
              classes = 'selected';
              classes += vm.ascending() ? ' asc' : ' desc';
            }
            return m('th', {
              sortBy: column.prop,
              class: classes,
            }, column.name);
          }),
          m('th', '') // Extra th for delete button
        ])
      ]),
      m('tbody', [
        // Populate rows
        vm.data().map(function (item) {
          return m('tr', [
            // First column has href
            m('td', [
              m('a[target="_blank"]', {
                href: item[vm.href](),
              }, item[vm.columns[0].prop]()),
            ]),
            // Other columns
            vm.columns.slice(1).map(function (column) {
              return m('td', item[column.prop]());
            }),
            // Delete button
            m('td', [
              m('a.delete', {
                onclick: function (e) {
                  ctrl.onDelete(item);
                },
                href: '#'
              }, 'x')
            ])
          ]);
        })
      ])
    ]);
  },
};

module.exports = SortableTable;