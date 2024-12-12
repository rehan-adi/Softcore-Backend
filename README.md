# Softcore - Social Media Backend Application

## Overview
This is the backend of a social media application, built with modern web technologies. It handles user authentication, post management, caching, and more.

---

## Features
- **Authentication**: User Signup, signin, and logout.
- **Post Management**: Create, update, delete, and retrieve posts.
- **Commenting System**: Add and view comments on posts.
- **Likes**: Like and unlike posts.
- **Profiles**: User profile creation and management.
- **Search Functionality**: Search for posts or users.
- **Follow System**: Follow and unfollow users.
- **Payment Integration**: Payment handling and processing.
- **File Uploads**: Manage media uploads using a dedicated `/uploads` directory.
- **Security Enhancements**:
  - Helmet for setting secure HTTP headers.
  - MongoSanitize to prevent NoSQL injection attacks.
  - Rate limiting to prevent abuse.
  - HPP to protect against HTTP parameter pollution.
- **CORS**: Configured for secure cross-origin requests.
- **Error Handling**: Centralized middleware for managing errors.
- **Static File Serving**: Serve static files for user uploads.

---

## Tech Stack
- **Node.js** with **Express**: Backend framework
- **TypeScript**: Typed JavaScript for robust development
- **MongoDB** with **Mongoose**: NoSQL database
- **Redis Cloud**: Caching mechanism
- **bcrypt**: For hashing passwords
- **JWT**: Authentication
- **Cloudinary**: For media uploads
- **Docker**: Containerized setup (optional)
- **Prettier**: Code formatting
- **Postman**: API testing

---

## Prerequisites
Ensure the following are installed on your system:
- **Node.js** (v18 or later)
- **pnpm** (Preferred package manager)
- **MongoDB** (can use cloud)
- **Redis Cloud** account
- **Git**
- **Docker** (optional, for containerized setup)

---

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rehan-adi/Softcore-Backend
   cd Softcore-Backend
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3333
   MONGO_URI="your_mongodb_connection_string"
   appName="YourAppName"
   DB_NAME="your_database_name"
   CORS_ORIGIN="your_frontend_url"
   JWT_SECRET="your_secret_key"

   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"

   CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
   CLOUDINARY_API_KEY="your_cloudinary_api_key"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

   REDIS_URL="your_redis_cloud_url"
   ```

4. **Start the server**:
   ```bash
   pnpm run dev
   ```

5. **Testing the APIs**:
   Use [Postman](https://www.postman.com/) or an alternative tool to test the APIs. Import the provided `postman_collection.json` file for pre-configured requests.

---

## Directory Structure
```
.
├── src
│   ├── config
│   ├── controllers
│   ├── db
│   ├── interfaces
│   ├── lib
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── utils
│   ├── validations
│   ├── app.ts
│   └── server.ts
├── types
├── uploads
├── .dockerignore
├── .env.sample
├── .gitignore
├── .prettierignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── package.json
├── pnpm-lock.yaml
├── README.md
└── tsconfig.json

```

---

## Docker Setup (using Docker Compose)

This project is configured to run with Docker Compose for easy setup and management. Note: If you prefer to run the app directly without Docker, skip this section and proceed with the standard setup.

### 1. Start the application

To build and start the application, run the following command:

```bash
docker-compose up
```

This will automatically build the images (if needed) and start the containers based on the configuration in the docker-compose.yml file.

### 2. Stop the application

To stop the running containers, use the following command:

```bash
docker-compose down
```

This command will stop and remove all containers defined in the docker-compose.yml file. It will also remove the networks created by Docker Compose, but it will not delete your data volumes unless you explicitly specify --volumes

---

## Available Scripts
- `pnpm run dev`: Starts the development server.
- `pnpm run build`: Builds the production-ready code.
- `pnpm run start`: Starts the built application.
- `pnpm run format`: Formats the codebase using Prettier.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Author
- **[Rehan]**
- GitHub: [rehan-adi](https://github.com/rehan-adi)
- Twitter: [Rehan_Coder](https://x.com/Rehan_Coder)

---

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

---

## Acknowledgements
- [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing
- [Express](https://expressjs.com/) for server setup
- [Redis Cloud](https://redis.com/) for caching
- [Cloudinary](https://cloudinary.com/) for media handling

