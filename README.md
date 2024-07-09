# REST API Documentation

This documentation provides steps to test your REST API using Postman. Ensure
your server is running on port 3000 before testing.

## Endpoints

### 1. GET /api/contacts

**Description:** Fetch all contacts.

**Steps:**

- Open Postman.
- Select the GET method.
- Enter URL: `http://localhost:3000/api/contacts`.
- Click the Send button.

**Expected Response:**

- Status: 200
- Body: A list of all contacts.

---

### 2. GET /api/contacts/:id

**Description:** Fetch a contact by ID.

**Steps:**

- Select the GET method.
- Enter URL: `http://localhost:3000/api/contacts/:id` (replace `:id` with a real
  contact ID, e.g., `http://localhost:3000/api/contacts/1`).
- Click the Send button.

**Expected Responses:**

- Status: 200 if the contact exists.
- Status: 404 if the contact does not exist.
- Body: Contact object or `{ "message": "Not found" }`.

---

### 3. DELETE /api/contacts/:id

**Description:** Delete a contact by ID.

**Steps:**

- Select the DELETE method.
- Enter URL: `http://localhost:3000/api/contacts/:id` (replace `:id` with a real
  contact ID, e.g., `http://localhost:3000/api/contacts/1`).
- Click the Send button.

**Expected Responses:**

- Status: 200 if the contact is deleted.
- Status: 404 if the contact does not exist.
- Body: Deleted contact object or `{ "message": "Not found" }`.

---

### 4. POST /api/contacts

**Description:** Create a new contact.

**Steps:**

- Select the POST method.
- Enter URL: `http://localhost:3000/api/contacts`.
- Go to the Body tab.
- Select `raw` and set the format to `JSON`.
- Enter the JSON object with `name`, `email`, and `phone` fields, e.g.:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "123-456-7890"
}
```

Click the Send button. Expected Responses:

Status: 201 if the data is valid and the contact is created. Status: 400 if the
data is invalid. Body: Newly created contact object or error message.

---

### 5. PUT /api/contacts/ **Description:** Update a contact by ID.

**Steps:**

- Select the PUT method.
- Enter URL: http://localhost:3000/api/contacts/:id (replace :id with a real
  contact ID, e.g., http://localhost:3000/api/contacts/1).
- Go to the Body tab.
- Select raw and set the format to JSON.
- Enter the JSON object with fields to update, e.g.: json

```json
{ "name": "Jane Doe" }
```

Click the Send button.

**Expected Responses:**

- Status: 200 if the data is valid and the contact exists.
- Status: 404 if the contact does not exist.
- Status: 400 if the data is invalid or missing.
- Body: Updated contact object or { "message": "Not found" }.

### 6. PATCH http://localhost:3000/api/contacts/:id/favorite **Description:** Update a favorite by ID.

**Steps:**

- Select the PATCH method.
- Enter URL: http://localhost:3000/api/contacts/:id/favorite (replace :id with a
  real contact ID, e.g.,
  http://localhost:3000/api/contacts/668d314dbfb27a171b555e7d/favorite).
- Go to the Body tab.
- Select raw and set the format to JSON.
- Enter the JSON object with fields to update, e.g.: json

```json
{ "favorite": "false" }
```

Click the Send button.

**Expected Responses:**

- Status: 200 if the data is valid and the contact exists.
- Status: 404 if the contact does not exist.
- Status: 400 if the data is invalid or missing.
- Body: Updated contact object or { "message": "Not found" }.

**Notes**

Make sure your server is running before testing these requests in Postman.
