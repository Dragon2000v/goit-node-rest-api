# REST API Documentation

This documentation provides steps to test your REST API using Postman. Ensure
your server is running on port 3000 before testing.

## Endpoints

1. **User Registration**
   - **Method:** POST
   - **URL:** `http://localhost:3000/users/register`
   - **Request Body:**
     - Enable `raw` and select JSON, then paste the following JSON:
     ```json
     {
       "email": "test@example.com",
       "password": "yourpassword"
     }
     ```

2. **User Login**
   - **Method:** POST
   - **URL:** `http://localhost:3000/users/login`
   - **Request Body:**
     - Enable `raw` and select JSON, then paste the following JSON:
     ```json
     {
       "email": "test@example.com",
       "password": "yourpassword"
     }
     ```

3. **Get Current User**
   - **Method:** GET
   - **URL:** `http://localhost:3000/users/current`
   - **Headers:**
     - `Authorization: Bearer <your_token>` (replace `<your_token>` with the token obtained from the login response)

4. **Update Subscription**
   - **Method:** PATCH
   - **URL:** `http://localhost:3000/users/subscription`
   - **Headers:**
     - `Authorization: Bearer <your_token>`
   - **Request Body:**
     - Enable `raw` and select JSON, then paste the following JSON:
     ```json
     {
       "subscription": "pro"
     }
     ```

5. **User Logout**
   - **Method:** POST
   - **URL:** `http://localhost:3000/users/logout`
   - **Headers:**
     - `Authorization: Bearer <your_token>`
