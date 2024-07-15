# A simple Reddit clone
## Running in dev environment
1. Install necessary tools:
  - [Docker](https://www.docker.com/) - container management
  - [Docker Compose](https://docs.docker.com/compose/install/) - containers defenition
  - [Pkl](https://pkl-lang.org/index.html) - configuration
  - [LocalStack](https://docs.localstack.cloud/getting-started/installation/) - local AWS services
  - [pnpm](https://pnpm.io/) - package management
2. Install/Build dependencies
  - Run `pnpm i` in the root directory of the project
  - Change the directory to `<project_root>/packages/common`, then run: `pnpm build`
3. Evaluate the default development configuration for API:
  - Run `pnpm pkl:eval` in the root directory of the project
4. Start the necessary services
  - Run `make start_services` in the root directory of the project
  - If there are not enough permissions, run `sudo make start_services` (for linux & macos)
5. Start the API
  - Change the directory to `<project_root>/apps/api`
  - Run `pnpm start:dev` to start the backend server
  - If there are not enough permissions, run `sudo pnpm start:dev` (for linux & macos)
  - It will run on port `8080` unless the `PORT` environment variable is set
6. Start the web app
  - Change the directory to `<project_root>/apps/web`
  - Run `pnpm start` to start the web app development server
  - It will run on port `4200`
## Running in production
Not implemented yet
