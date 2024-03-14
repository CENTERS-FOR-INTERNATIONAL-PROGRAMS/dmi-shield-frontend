# dmi-shield-frontend
User management, Integrated Dashboards, Upload of documents


## Getting Started

### Installation

1. Clone the repo
    ```sh
    git clone git@github.com:CENTERS-FOR-INTERNATIONAL-PROGRAMS/dmi-shield-frontend.git
    ```
2. Install NPM packages
    ```sh
    npm install
    ```
3. Create `config` directory in src/app directory
4. Create `config.ts` file in config directory
5. Run the application
    ```sh
    ng serve
    ```

# Config.ts Example
  ```
    export const config = {
COUCHDB_ALCHEMY: "https://<user_name>:<password>@host",
FILE_PATH: ""
};
  ```


