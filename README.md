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
4. Create a .env file to reference the port. Refer to the .env.example
4. Install Docker and Run the application
    ```sh
    docker compose up
    ```

# Config.ts Example
  ```sh
    export const config = {
      FILE_PATH: "",
      API_ENDPOINT: "https://localhost/api/v1/",
      SUMMARIZED_IFRAME_SOURCES: [],
      IFBS_IFRAME_SOURCES: {
        SARI: "",
        IFBS: "",
        MORTAlITY: "",
      },
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
      }
};
  ```


