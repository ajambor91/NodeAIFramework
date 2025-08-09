# Node.js Test Framework By AI

This project is a simplified, custom-built Node.js framework in TypeScript, created for testing and demonstration purposes with the **Roo Code** extension for Visual Studio Code, powered by the **Gemini Pro** agent.

The primary goal of this project is to showcase the capabilities of AI-assisted development in a real-world scenario, including code generation, refactoring, documentation, and testing.

**Note:** The author intentionally did not write or debug any line of code manually. The entire project was created and managed by the AI agent through natural language commands.

## Core Features

*   **TypeScript**: The entire framework is written in TypeScript, providing strong typing and modern language features.
*   **MongoDB Support**: Includes a basic ORM for connecting to a MongoDB database.
*   **JWT Authentication**: Built-in support for JSON Web Token-based security.
*   **Dependency Injection**: A custom DI container for managing services, repositories, and controllers.
*   **Custom Router**: A simple router to handle HTTP requests.

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm

### Installation & Running

1.  Clone the repository and install the dependencies:
    ```bash
    git clone <repository_url>
    cd <project_directory>
    npm install
    ```

2.  Start the application:
    ```bash
    npm start
    ```
    The server will be running at `http://localhost:3000`.

### Running Tests

You can run tests and generate coverage reports using the following commands:

*   **Run all tests:**
    ```bash
    npm test
    ```

*   **Generate coverage report for `src`:**
    ```bash
    npm run coverage:src
    ```

*   **Generate coverage report for `lib`:**
    ```bash
    npm run coverage:lib
    ```

## Project Structure

The project is divided into two main parts:

*   `lib/`: Contains the core framework logic (DI container, router, security, etc.).
*   `src/`: Contains the application-specific logic (controllers, services, repositories).

## Documentation & Reports

You can find detailed documentation and test coverage reports via the links below:

*   **Application Documentation (`src`)**: [./docs/src/index.html](./docs/src/index.html)
*   **Framework Documentation (`lib`)**: [./docs/lib/index.html](./docs/lib/index.html)
*   **Application Test Coverage (`src`)**: [./reports/index.html](./reports/index.html)
*   **Framework Test Coverage (`lib`)**: [./reports-lib/index.html](./reports-lib/index.html)

### Test Coverage Summary

| Scope      | Statements | Branches | Functions | Lines    |
|------------|------------|----------|-----------|----------|
| **`src`**  | 55.38%     | 19.64%   | 53.26%    | 51.65%   |
| **`lib`**  | 81.09%     | 67.7%    | 88.4%     | 79.24%   |

---
*This project was developed with the assistance of Roo Code and Gemini Pro.*