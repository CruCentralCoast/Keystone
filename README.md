# Slocru Keystone
This is a rewrite of the Cru Central Coast website, using [`keystone.js`](http://keystonejs.com), among other things.

In this project, [Jade](http://jade-lang.com/) is used for HTML templating and [Stylus](https://learnboost.github.io/stylus/) is used for CSS templating.

# Notes to Capstone class

First of all, please keep all work within the `capstone` branch. This will make it easier to quantify and group the work the class did, and allow for selective merging into `master` later.

There are a number of things that need to happen with this project in order for the mobile app to be able to access the data. First of all, there are some missing data models, such as those for Resources and Community Groups.

In addition, while the admin console allows for manual input and management of this data using a web UI, there is no way to access it outside of this interface, which is why a REST API is needed. For resources on how to build this, see [this gist](https://gist.github.com/JedWatson/9741171). [This project](https://github.com/danielpquinn/keystone-rest) may also be helpful.

For more information, see the [KeystoneJS Documentation](http://keystonejs.com/docs/getting-started/), specifically the section on [project structure](http://keystonejs.com/docs/getting-started/#gettingstarted-projectstructure) so you can get oriented in the code base.

The KeystoneJS github [wiki](https://github.com/keystonejs/keystone/wiki/) has even more information. I'd suggest checking out the [Keystone API](https://github.com/keystonejs/keystone/wiki/Keystone-API#listarg).

## Database access

You will need to obtain read access to the Cru database in order to work with the data through keystone. This will be a URI you will get from your professor.
Add the `MONGO_URI=mongodb://<username>:<password>@<database_url>` line to your `.env` file so keystone can access it. This file is not to be committed to version control (it is already in the `.gitignore` in this repo).

## Troubleshooting

You will need mongodb and node.js installed as descibed in the getting started guide. Since you are in development, you will want to set the environment variable `export NODE_ENV=development`, this will cause keystone to load additional environment variables from a `.env` file in the project root, so you can just define them there. Some things that are required are `COOKIE_SECRET` and `MONGO_URI`. again, consult the configuration section of the docs.

### Project Goals
- initialize the `keystone.js` admin panel and wire it up to all of our databases, so that the web team and certain staff can have access.
- Migrate backend and frontend code from PHP to make this all possible, of course
