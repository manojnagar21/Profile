# User Management API

This project is a Node.js, Express.js, and TypeScript based API for managing users, with MongoDB as the database and Redis for caching. The project follows an MVC structure with separate folders for models, controllers, routes, and helpers.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Validation](#validation)
- [Folder Structure](#folder-structure)
- [License](#license)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/manojnagar21/Profile.git
cd your-repo

```
2. Install the dependencies:

```bash
npm install

```

## Environment Variables

1. Create a .env file in the root directory and add the following variables:

# MongoDB
MONGODB_URI=mongodb://localhost:27017/yourdbname

# Redis
MONGODB_HOST=127.0.0.1
MONGODB_PORT=27017
MONGODB_DATABASE=profile
MONGODB_USERNAME=''
MONGODB_PASSWORD=''

# Other environment-specific variables
PORT=3000

## Running the Application

1. Build the TypeScript code:

```bash
npm run build
npm start
```

## API Endpoints

1. Create a New User
    URL: api/users
    Method: POST
    Request Body:
    ``` json
    {
        "name": "John Doe",
        "email": "john.doe@example.com"
    }
    Response:
    ``` json
    {
        "id": "user_id",
        "name": "John Doe",
        "email": "john.doe@example.com"
    }

2. Get a User by ID

    URL: api/users/:id
    Method: GET
    Response:
    ```json
    [
        {
            "id": "user_id_1",
            "name": "John Doe",
            "email": "john.doe@example.com"
        },
        {
            "id": "user_id_2",
            "name": "Jane Smith",
            "email": "jane.smith@example.com"
        }
    ]

3. Get All Users

    URL: api/users
    Method: GET
    Response:
    ```json
    [
        {
            "id": "user_id_1",
            "name": "John Doe",
            "email": "john.doe@example.com"
        },
        {
            "id": "user_id_2",
            "name": "Jane Smith",
            "email": "jane.smith@example.com"
        }
    ]

## Validation

This project uses the zod library for validation. The schemas for validating user data can be found in the src/schemas/userSchema.ts file.

## Folder Structure

```bash

/src
    /cache
        redisClient.ts
    /config
        config.ts
        data-source.ts
        ormconfig.json
    /controllers
        userController.ts
    /helpers
        cacheHelper.ts
    /libraries
        someLibrary.ts
    /models
        User.ts
    /routes
        index.ts
    /schemas
        userSchema.ts
    index.ts
    server.ts
.gitignore
.env

cache: Contains the Redis client configuration.
config: Contains configuration files for the application.
controllers: Contains the controllers for handling API requests.
helpers: Contains helper functions, including cache management.
models: Contains the database models.
routes: Contains the routing configuration.
schemas: Contains the validation schemas.
index.ts: The entry point of the application.
server.ts: Contains the server setup.
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.