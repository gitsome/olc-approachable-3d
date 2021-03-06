# Approachable & Progressive 3D Content Development and Delivery for Education

This repository hosts code used to setup and demonstrate cross-platform delivery of 3D content that is integrated with an LMS and is simple to author and deliver.

## Solution

This demo hopes to provide 3D content to students that accomplishes the following:

- Provides engaging and effective educational experiences
- Provides institutions with simple implementation guidelines
- Provide a real world example of a feasible implementation that can be assessed for effectiveness in modern in-person, hybrid, and online delivery situations.

## Architecture

Heroku Node.JS Application

## Libraries / Frameworks Used

This demo stands up a `Node.js` server running as a Heroku app. The `Node.js` can be replaced easily with whatever LTI friendly technology you see fit.

### LTI Tool Provider

- [Node.js](https://nodejs.org/en/)
- [Passport](http://www.passportjs.org/)
- [Passport LTI Strategy](http://www.passportjs.org/packages/passport-lti/)


### Content Authoring

- [react-three-fiber](https://github.com/react-spring/react-three-fiber)

## Getting Started

The following instructions should help you get this demo up and running and integrated with an LTI compliant LMS. If you run into issues please contact ***John David Martin*** by email [jmartin@unicon](jmartin@unicon.net).

### Install Node.js

You will need to install `Node.js` in order to run the scripts that setup the environment and allow you to develop new 3D content.

[Install Node.js](https://nodejs.org/en/download/)

### Install Yarn

`Yarn` is a modern package manager for `JavaScript` packages that is managed by `Facebook`. Install it by going to this link:

[Install Yarn](https://yarnpkg.com/lang/en/docs/install)

### Run the App Locally

You can run the server locally which will also serve up the UI.

### Install Heroku

To run this demo you will need to install Heroku and create an account.

https://devcenter.heroku.com/articles/heroku-cli


## Install Dependencies

This project will need to pull down some dependencies in order to setup the AWS ECS server and integrate with your LMS. From the root of this repository run:

```bash
yarn install
```

## Create the Heroku App

```bash
yarn run create
```

### Tail the Heroku Logs

Heroku docs can be [viewed here](https://devcenter.heroku.com/articles/heroku-cli-commands).

```bash
heroku logs -a olc-approachable-3d -t
```

### Deploy a Change to Heroku

```bash
git push heroku master
```

## Set Some ENV Variables

```bash
heroku config:set consumerKey=123456789
heroku config:set consumerSecret=<your secret>
```

See [Heroku Config Vars Documentation](https://devcenter.heroku.com/articles/config-vars)

## Authoring Content


