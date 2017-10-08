**Build Status**  
Master: [![CircleCI](https://circleci.com/gh/CruCentralCoast/Keystone/tree/master.svg?style=svg)](https://circleci.com/gh/CruCentralCoast/Keystone/tree/master)
Dev: [![CircleCI](https://circleci.com/gh/CruCentralCoast/Keystone/tree/dev.svg?style=svg)](https://circleci.com/gh/CruCentralCoast/Keystone/tree/dev)

# Slocru Keystone
This is a rewrite of the Cru Central Coast website, using [`keystone.js`](http://keystonejs.com), among other things.

In this project, [Jade](http://jadelang.net/) is used for HTML templating and [Stylus](https://learnboost.github.io/stylus/) is used for CSS templating.

# Getting Started
A quick guide to getting the project running for development can be found in our [wiki](https://github.com/CruCentralCoast/Keystone/wiki/Getting-Started-with-Keystone-Dev). A guide of helpful information that is applicable to all of our project can be found [here](https://github.com/CruCentralCoast/Keystone/wiki/Guides-and-Things-to-Know).

# Notes to Developers

***IMPORTANT***: If you need to store some sort of constant, whether it's an API key, or anything else, do not store it in source control. You should also not create any files (outside of special keystone directories) or assume any knowledge of the filesystem. This node app is designed to run without filesystem access, using microservices and middleware to store information. 

Store constants in a local `.env` file on your machine in the root directory. The app looks for this file and loads constants from it, they are then accessible at `process.env.CONSTANT_NAME`. Otherwise it loads constants from environment variables you define, on heroku these key value pairs are able to be set in the app settings.

---

First of all, please keep all work within branches that are specific to the issue you are working on (e.g. `feature\Continuous-Integration` or `bugfix\user-api-returns-wrong-data`. This will make it easier for the lead developers to review code, and allow for selective merging into `master` later.

While the admin console allows for manual input and management of data using a web UI, there is no way to access it outside of this interface, which is why a REST API is needed. For resources on how to build this, see [this gist](https://gist.github.com/JedWatson/9741171). [This project](https://github.com/danielpquinn/keystone-rest) may also be helpful.

For more information, see the [KeystoneJS Documentation](http://keystonejs.com/docs/getting-started/), specifically the section on [project structure](http://keystonejs.com/docs/getting-started/#gettingstarted-projectstructure) so you can get oriented in the code base.

The KeystoneJS github [wiki](https://github.com/keystonejs/keystone/wiki/) has even more information. I'd suggest checking out the [Keystone API](https://github.com/keystonejs/keystone/wiki/Keystone-API#listarg).

## Database access

You will need to obtain read access to the Cru database in order to work with the data through keystone. This will be a URI you will get from a lead developer.
Add the `MONGO_URI=mongodb://<username>:<password>@<database_url>` line to your `.env` file so keystone can access it. This file is not to be committed to version control (it is already in the `.gitignore` in this repo).

## Troubleshooting

You will need mongodb and node.js installed as descibed in the getting started guide. Since you are in development, you will want to set the environment variable `export NODE_ENV=development`, this will cause keystone to load additional environment variables from a `.env` file in the project root, so you can just define them there. Some things that are required are `COOKIE_SECRET` and `MONGO_URI`. again, consult the configuration section of the docs.
