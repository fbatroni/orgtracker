# OrgTracker

A backend api service in node.js that serves two endpoints for an organization tracker.


## Purpose
Provides a set of APIs that will allow us to track and search certain information for an organization.


## Dependencies
- Docker
Download docker, from the official site (recommended)
once is downloaded make sure the docker daemon is running.

- Redis database - used for session/cache management (runs locally in docker)
- Postgres database - used for storing orgs (runs locally in docker)

## List of available endpoints

|        	| Path                   	    |
|--------	|------------------------	    |
| get   	| /health                	    |
| post   	| /api/v1/organization/new    | # creates a new organization
| post   	| /api/v1/organization/search | # searches for an organization*

*search requires the following JSON payload
```json
{
    "orgname": "Test Org1"
}
```
*search requests are cached in redis for subsequent requests

`curl http://localhost:9191/<endpoint>`


## Local development/Getting Started


### Dependencies

#### Install Node (v12.4.0)
It's important that you use this version consistently to prevent package-lock.json churn.

Simple version:
[Download and install](https://nodejs.org/download/release/v10.16.0/)

NVM version:
* Install NVM [Install instructions](https://github.com/creationix/nvm#install-script).
* Open a terminal into the root directory of the project
* Install the version of node and use it with `nvm install & nvm use`.
* Verify the version matches the version in the .nvmrc file with `node --v`.
* You can set the Default version to use globally with `nvm alias default <version>`.


#### Project Layout
The project is laid out in the following way:
- `src`: Project root
  - `api`: Routes, controllers and services (versioned routes)
   - `config`: Any required configuration variables
  - `lib`: Helper libraries
    - `models`: Sequelize data models
  - `middleware`: Connect-style express middleware
- `test`: Jest/Supertest tests
- `scripts`: Local utilities i.e. docker container management


#### Postgres Database

```sql
-- Table: public.organizations

-- DROP TABLE public.organizations;

CREATE TABLE public.organizations
(
    id integer NOT NULL DEFAULT nextval('organizations_id_seq'::regclass),
    orgname character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "startDate" timestamp with time zone NOT NULL,
    "numberOfEmployees" integer NOT NULL,
    "isPublic" boolean NOT NULL DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT organizations_pkey PRIMARY KEY (id),
    CONSTRAINT organizations_orgname_key UNIQUE (orgname)

)

TABLESPACE pg_default;

ALTER TABLE public.organizations
    OWNER to postgres;
```

#### Installing and running

1. Install
```sh
npm install
npm run local (runs redis and postgres database via docker (start and stop using redis_start and redis_stop scripts))
```

#### Tooling
- Nodemon - auto-restarts modified javascript files in local development (install it globally)
- Jest/SuperTest for testing API endpoints
- Linting (eslint and prettier) - `npm run lint` - linting is also ran automatically is pre-commit hook (lint-staged)
- Redis commander - GUI for viewing local redis instance data (optional)








