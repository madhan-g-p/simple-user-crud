flowchart TD
    %% Front-end Layer
    subgraph "Front-end (React SPA)"
        direction TB
        FE_Pages["Pages<br/>- Login<br/>- Signup<br/>- Dashboard<br/>- VerifyAuth"]:::frontend
        AuthStore["AuthStore (State Management)"]:::frontend
        APIClient["API Client Module"]:::frontend
        AppEntry["App Entry Point<br/>(App.js, index.js)"]:::frontend
    end

    %% API Layer
    subgraph "API Gateway (Express)"
        direction TB
        App["Express App<br/>(app.js)"]:::backend
        Routes["Route Definitions<br/>(Routes.js)"]:::backend
        Endpoints["Endpoints<br/>POST /v1/auth/login<br/>POST /v1/auth/signup<br/>GET /v1/users"]:::backend
    end

    %% Middleware Layer
    subgraph "Middleware"
        direction TB
        AuthMiddleware["Auth Middleware<br/>(JWT/Token Checks)"]:::backend
    end

    %% Business Logic Layer
    subgraph "Business Logic (v1 Controllers)"
        direction TB
        subgraph "Authentication Controller"
            AuthController["index.js"]:::backend
            AuthSQL["sqlConstants.js"]:::backend
        end
        subgraph "Users Controller"
            UsersController["index.js"]:::backend
            UsersSQL["sqlConstants.js"]:::backend
        end
    end

    %% Utilities
    subgraph "Utilities"
        direction TB
        Helper["helperFunctions.js"]:::backend
        Validator["validatorSchemas.js"]:::backend
    end

    %% Data Access Layer
    subgraph "Data Access Layer"
        direction TB
        DBConn["PostgreSQL Client Pool<br/>(db.js)"]:::backend
    end

    %% Database
    subgraph "Database"
        direction TB
        Postgres["PostgreSQL"]:::db
        SchemaScript["schema_backup.sql"]:::db
        SeedScript["user_data.sql"]:::db
    end

    %% Configuration & Packages
    subgraph "Configuration"
        direction TB
        Env[".env"]:::config
        BE_Pkg["back-end/package.json"]:::config
        FE_Pkg["front-end/package.json"]:::config
    end

    %% Connections
    FE_Pages -->|"uses"| AuthStore
    AuthStore -->|"calls"| APIClient
    APIClient -->|"HTTP(S) Requests"| App
    App -->|"mounts"| Routes
    Routes -->|"routes to"| Endpoints
    Endpoints -->|"passes through"| AuthMiddleware
    AuthMiddleware -->|"invokes"| AuthController
    AuthMiddleware -->|"invokes"| UsersController
    AuthController -->|"uses"| Helper
    AuthController -->|"uses"| Validator
    UsersController -->|"uses"| Helper
    UsersController -->|"uses"| Validator
    Helper -->|"calls"| DBConn
    Validator -->|"validates then calls"| DBConn
    DBConn -->|"queries"| Postgres
    Postgres -->|"returns results"| DBConn
    DBConn -->|"returns data"| AuthController
    DBConn -->|"returns data"| UsersController

    %% Click Events - Front-end
    click FE_Pages "https://github.com/madhan-g-p/simple-user-crud/tree/main/front-end/src/pages"
    click AuthStore "https://github.com/madhan-g-p/simple-user-crud/blob/main/front-end/src/AuthStore/store.js"
    click APIClient "https://github.com/madhan-g-p/simple-user-crud/blob/main/front-end/src/API/api.js"
    click AppEntry "https://github.com/madhan-g-p/simple-user-crud/blob/main/front-end/src/App.js"
    click AppEntry "https://github.com/madhan-g-p/simple-user-crud/blob/main/front-end/src/index.js"

    click FE_Pages "https://github.com/madhan-g-p/simple-user-crud/blob/main/front-end/src/pages/Login.jsx"
    click FE_Pages "https://github.com/madhan-g-p/simple-user-crud/blob/main/front-end/src/pages/Signup.jsx"
    click FE_Pages "https://github.com/madhan-g-p/simple-user-crud/blob/main/front-end/src/pages/Dashboard.jsx"
    click FE_Pages "https://github.com/madhan-g-p/simple-user-crud/blob/main/front-end/src/pages/VerifyAuth.jsx"

    click App "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/app.js"
    click Routes "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/Routes.js"

    click AuthMiddleware "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/middlewares/Authentication_Authorization.js"

    click AuthController "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/v1/Authentication/index.js"
    click AuthSQL "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/v1/Authentication/sqlConstants.js"
    click UsersController "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/v1/Users/index.js"
    click UsersSQL "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/v1/Users/sqlConstants.js"

    click Helper "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/utilities/helperFunctions.js"
    click Validator "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/utilities/validatorSchemas.js"

    click DBConn "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/dbConnection/db.js"

    click SchemaScript "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/postgres_scripts/schema_backup.sql"
    click SeedScript "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/postgres_scripts/users/user_data.sql"

    click Env "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/.env"
    click BE_Pkg "https://github.com/madhan-g-p/simple-user-crud/blob/main/back-end/package.json"
    click FE_Pkg "https://github.com/madhan-g-p/simple-user-crud/blob/main/front-end/package.json"

    %% Styles
    classDef frontend fill:#D0E8FF,stroke:#0366D6,color:#0366D6;
    classDef backend fill:#E0F8E0,stroke:#28A745,color:#28A745;
    classDef db fill:#FFE5B4,stroke:#FF8C00,color:#FF8C00;
    classDef config fill:#F0F0F0,stroke:#A0A0A0,color:#606060;
