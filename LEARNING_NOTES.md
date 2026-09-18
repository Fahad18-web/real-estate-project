# Learning Notes — EstatePulse

These notes summarize the main concepts, architectural decisions, and practical lessons from the EstatePulse real-estate marketplace project.

## 1. Project Overview

EstatePulse is a full-stack real-estate marketplace built with the MERN stack:

- **MongoDB** stores users, properties, bookings, reviews, and saved properties.
- **Express.js** provides the REST API.
- **React** powers the client application.
- **Node.js** runs the backend server.

The application also demonstrates authentication, role-based authorization, image uploads, maps, search and filtering, appointments, reviews, and deployment configuration.

## 2. Architecture

The project is divided into two applications:

```text
backend/
  config/       Database and Cloudinary configuration
  controllers/  Request-handling and business logic
  middleware/   Authentication, validation, uploads, and errors
  models/       Mongoose schemas
  routes/       API route definitions
  utils/        Shared response, error, and token helpers

frontend/
  src/
    app/        Redux store setup
    components/ Reusable UI components
    features/   Feature-specific state and API logic
    hooks/      Reusable React hooks
    pages/      Route-level screens
    utils/      Frontend helpers
```

This separation keeps HTTP concerns, business logic, persistence, and presentation code easier to maintain.

## 3. Backend Lessons

### Controllers and routes have different responsibilities

- **Routes** define the HTTP method, URL, middleware, and controller to execute.
- **Controllers** validate the request context, call models or services, and build the response.
- **Models** describe the data structure and database behavior.

Keeping these responsibilities separate makes individual parts easier to test and replace.

### Middleware creates reusable request pipelines

Important middleware responsibilities include:

1. Reading and verifying authentication tokens.
2. Checking whether a user has the required role.
3. Validating request bodies and parameters.
4. Handling multipart image uploads.
5. Forwarding errors to one centralized error handler.

A typical protected request can be understood as:

```text
Request
  → authentication middleware
  → role middleware
  → validation middleware
  → controller
  → centralized error handler, if needed
```

### Consistent API responses reduce frontend complexity

The project uses shared `ApiError` and `ApiResponse` utilities. A consistent response shape means frontend code does not need a different error-parsing strategy for every endpoint.

A useful API response should make the following clear:

- Whether the request succeeded.
- A human-readable message.
- The returned data.
- Optional pagination or metadata.

## 4. Authentication and Authorization

### Dual-token authentication

The application uses two JWTs with different purposes:

- A short-lived **access token** is used for normal API requests.
- A longer-lived **refresh token** is stored in an `httpOnly` cookie and is used to obtain a new access token.

This design limits the impact of an exposed access token while avoiding frequent user logins.

### Token refresh flow

The expected flow is:

1. The user logs in.
2. The server issues an access token and refresh token.
3. The frontend sends the access token with protected requests.
4. If the access token expires, the API returns `401 Unauthorized`.
5. The client calls the refresh endpoint using the refresh-token cookie.
6. The client retries the original request with the new access token.
7. If refreshing fails, the user is logged out.

### Role-based access control

The application distinguishes between:

- **User:** Can browse properties, save favorites, book viewings, and review properties.
- **Agent:** Can create and manage owned listings and manage viewing requests.
- **Admin:** Has elevated management permissions.

Authentication answers **who the user is**. Authorization answers **what that user is allowed to do**. These should remain separate checks.

## 5. Data Modeling Concepts

The main entities are:

- `User`
- `Property`
- `Booking`
- `Review`
- `SavedProperty`

Relationships should be considered carefully. For example:

- A property belongs to an agent.
- A booking connects a user, property, and agent.
- A review connects a user and property.
- A saved property connects a user and property.

When designing a schema, consider ownership, deletion behavior, indexes, validation, and whether related data should be embedded or referenced.

## 6. Property Search and Filtering

Property search combines multiple optional filters, such as:

- City
- Sale or rent purpose
- Property type
- Price range
- Bedrooms and bathrooms
- Text search
- Pagination

A good filtering implementation should:

1. Build the database query only from filters that are present.
2. Validate numeric values before querying.
3. Use pagination rather than returning every property.
4. Return metadata such as the current page and total results.
5. Add database indexes for commonly searched fields when needed.

## 7. Appointments, Reviews, and Favorites

### Viewing appointments

A booking workflow has several state transitions, such as:

```text
requested → confirmed → completed
requested → cancelled
```

State transitions should be validated on the server. The frontend should not be trusted to enforce business rules by itself.

### Reviews and aggregate values

When a review is added, edited, or removed, the property's aggregate values must stay accurate:

- `avgRating`
- `totalReviews`

This is a useful example of denormalized data: aggregate values improve read performance, but they require careful updates whenever source records change.

### Saved properties

Favorites demonstrate a common full-stack synchronization problem. The UI should update quickly for good user experience, while the server remains the source of truth. RTK Query cache invalidation or optimistic updates can help keep the two states synchronized.

## 8. Frontend Lessons

### Feature-based organization

The frontend groups code by product feature, such as authentication, properties, bookings, and reviews. This is often easier to scale than organizing everything only by file type.

A feature can contain:

- API endpoints.
- Redux state.
- Components.
- Validation schemas.
- Feature-specific hooks.

### RTK Query

RTK Query helps manage server state by providing:

- Request lifecycle handling.
- Loading and error states.
- Request caching.
- Cache invalidation after mutations.
- Generated React hooks.

Server data should generally remain in RTK Query, while local UI state can remain in regular React state or Redux slices.

### Form validation

React Hook Form manages form interaction efficiently, while Zod provides declarative validation. Client-side validation improves the user experience, but every important rule must also be checked on the backend.

### Routing and reusable components

React Router maps URLs to pages. Shared layout components are useful for navigation, authentication-aware UI, and consistent page structure. Reusable property cards, filters, buttons, dialogs, and form fields reduce duplication.

## 9. File Uploads and Cloud Storage

Image uploads are handled through Multer and Cloudinary.

Important upload lessons:

- Validate file type and size.
- Limit the number of uploaded files.
- Do not trust client-provided filenames or MIME types alone.
- Store hosted image URLs rather than large image binaries in MongoDB.
- Handle partial upload failures carefully.
- Remove unused Cloudinary assets when a listing is deleted or images are replaced.

## 10. Security Checklist

When extending the project, keep these practices in mind:

- Never commit real environment variables or secrets.
- Use strong, separate secrets for access and refresh tokens.
- Keep refresh tokens in secure `httpOnly` cookies.
- Configure `sameSite` and `secure` cookie settings appropriately for deployment.
- Hash passwords with a slow password-hashing algorithm such as bcrypt.
- Validate and sanitize user input on the server.
- Use rate limiting on authentication endpoints.
- Restrict CORS to trusted frontend origins.
- Use Helmet to set safer HTTP headers.
- Check ownership before allowing updates or deletions.
- Avoid returning passwords, token secrets, or other sensitive fields.

## 11. Local Development Workflow

A practical development sequence is:

1. Start MongoDB or connect to MongoDB Atlas.
2. Configure `backend/.env` and `frontend/.env`.
3. Start the backend on port `5000`.
4. Start the frontend on port `5173`.
5. Test public property browsing first.
6. Test registration and login.
7. Test protected routes with each role.
8. Test image uploads, bookings, reviews, and saved properties.
9. Check browser and server logs when diagnosing failures.

Useful debugging questions include:

- Is the request reaching the backend?
- Is the API base URL correct?
- Is the access token being sent?
- Is the refresh-token cookie being included?
- Is the current user authorized for the operation?
- Did validation reject the request?
- Did the database query match the expected records?

## 12. Deployment Lessons

The backend and frontend can be deployed separately:

- The backend can run as a Render web service with `backend` as the root directory.
- The frontend can be deployed to Vercel with `frontend` as the root directory.

Deployment configuration must update:

- Production API URL.
- Allowed CORS origin.
- Cookie security settings.
- MongoDB network access.
- Cloudinary credentials.
- Production environment variables.

A successful local setup does not guarantee a successful production setup because domains, HTTPS, cookies, and environment variables behave differently in production.

## 13. Suggested Learning Exercises

1. Add sorting by newest listing, price, and rating.
2. Add server-side pagination controls to the property list.
3. Add automated tests for authentication and property ownership.
4. Add an admin dashboard for managing users and listings.
5. Add email notifications for booking status changes.
6. Add a property comparison feature.
7. Add database indexes and measure search performance.
8. Add image deletion when a listing is removed.
9. Add audit logs for sensitive admin actions.
10. Add an accessibility review for keyboard navigation and color contrast.

## 14. Main Takeaways

- Separate routing, middleware, controllers, models, and UI concerns.
- Treat authentication and authorization as different responsibilities.
- Keep the server authoritative for permissions and business rules.
- Use consistent API responses and centralized error handling.
- Design database relationships around ownership and access patterns.
- Use caching and invalidation deliberately for server state.
- Validate data on both the client and the server.
- Plan deployment, security, and environment configuration early.
