# Application setup
* Run `npm install` and post install script will create
* Run `npm run dev-setup` which will initialize docker container, create database and run migrations
* Run `npm run start` to start application

# Additional configuration
Additionally app can be configured through environment variables or `.env` file. 
Please check `src/config.ts` file for supported options.

# Authorization
Real authentication s not implemented. Store owner is identified by isOwner flag on user table (in test data owner should have id 1).
Each developer company must have user account associated with it.
To make a request as user please specify `x-user-id` request header.
To make request as a developer `x-developer-id` header containing company id must be specified additionally.

# API endpoints
* GET `/apps` - see app list (if user is specified, additionally `installed` field will be shown) 
* GET `/apps/:id` - see app details 
* GET `/developer/apps` - see apps created by developer (identified by `x-user-id` and `x-developer-id`)
* POST `/developer/apps` - create new app
* PUT `/developer/apps/:id` - update app details
* PUT `/developer/apps/:id/publish` - publish app
* PUT `/developer/apps/:id/unpublish` - unpublish (remove) app
* GET `/developer/stats` - get total money earned
* GET `/user/apps` - get list of installed apps for user identified by `x-user-id`
* PUT `/user/apps/:id/install` - install app for user identified by `x-user-id`
* PUT `/user/apps/:id/uninstall` - uninstall app  for user identified by `x-user-id`
* GET `/user/stats` - see total amount paid for user identified by `x-user-id`
* GET `/owner/stats` - see total money received by store owner
