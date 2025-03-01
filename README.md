# dmi-shield-frontend
User management, Integrated Dashboards, Upload of documents


## Getting Started

### Installation

1. Clone the repo
    ```sh
    git clone git@github.com:CENTERS-FOR-INTERNATIONAL-PROGRAMS/dmi-shield-frontend.git
    ```
2. Create `config` directory in src/app directory
3. Create `config.ts` file in config directory
4. Create a .env.test file to reference the port. Refer to the environment/.env.example
5. Create a shareable docker volume for static files
 For Test Environment
    ```sh
     docker volume create shield_volume
    ```
6. Install Docker and Run the application
 For Test Environment
    ```sh
     docker compose -p test --env-file .\environment\.env.test up -d
    ```
 For Production Environment
     ```sh
     docker compose -p prod --env-file .\environment\.env.prod up -d
    ```
# Config.ts Example
  ```sh
    export const config = {
      FILE_PATH: "",
      API_ENDPOINT: "https://localhost/api/v1/",
      SUMMARIZED_IFRAME_SOURCES: [],
      SUPERSET: {
        DOMAIN: '<Superset Domain>',
        API_ENDPOINT: "<Superset API Endpoint>",
        API_PROVIDER: "db",
        USER_ADMINISTRATOR: {
            USERNAME: "",
            PASSWORD: ""
        },
        USER_GUEST: {
            USERNAME: "guest",
        },
        DASHBOARDS: [],
      }
};
  ```


