# Framework Leaderboard

A tool for comparing frontend frameworks.


Built using [Mithril](http://mithril.js.org/). Use webpack to compile:

```
	$ npm install -g webpack
	$ cd /path/to/project
	$ webpack
```

## Notes:

- Because this app is live-updating, I wanted to use a framework that would take care of redrawing the view for me. Mithril is perfect for applications like these where a larger framework isn't necessary. 

- In order to quickly compare stats for several items, a sortable table is the first thing that comes to mind. So, I decided my view would nothing more than a single table.

In order to construct this view, I created the following things:

1. A repository model object to hold repo data. This object also contains a method for refreshing data. (repo.js) 
2. A "main" component that contains references to repository objects, as well as a table component that it passes repository data to. This object also contains methods for adding and removing repositories. (main.js) 
3. An abstract sortable table component that displays given data. (sortable-table.js)


Separating the main component from the table component makes it much easier to do things like add/remove table columns if you want to display other stats.

One of the biggest challenges I faced in this project was dealing with the Github API's strict rate limiting. For an app that updates every 5 seconds, the number of allowed requests runs out quickly. I ended up using ETag headers in order to only download modified data and avoid angering the Github gods.