# Blog Application

A full-stack blog platform built with Spring Boot, React, PostgreSQL, and MinIO. The app supports rich post creation, media uploads, comments, saved posts, public author profiles, role-based admin tooling, and a polished responsive UI.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Local Setup](#local-setup)
- [Media Storage](#media-storage)
- [Roles](#roles)
- [Useful Commands](#useful-commands)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)

## Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Security
- JWT authentication
- Spring Data JPA / Hibernate
- PostgreSQL
- MinIO Java SDK
- Thumbnailator
- MapStruct
- Lombok
- Maven

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Context API
- TipTap rich text editor
- React Select
- Fetch API

### Infrastructure

- PostgreSQL database
- MinIO object storage
- Docker Compose for local MinIO

## Features

### Authentication and Authorization

- JWT-based login with stateless backend sessions.
- Role-based access control for `USER`, `ADMIN`, and `SUPERADMIN`.
- Protected backend endpoints through Spring Security.
- Protected frontend routes using React Router and `AuthContext`.
- Admin-only screens and superadmin-only role management actions.
- BCrypt password hashing.

### Posts

- Create, edit, delete, and view posts.
- Rich text editor powered by TipTap.
- Inline images inside post content.
- Cover image upload with generated thumbnail.
- Category assignment with multi-select UI.
- Search posts by title/content.
- Category pages with category stats and related category links.
- Polished post details page with author block, reading time, cover image, and comments.

### Media

- Dedicated media layer for upload behavior.
- MinIO-backed object storage instead of writing uploads into the project root.
- Separate upload flows for:
  - post cover images
  - post thumbnails
  - profile avatars
  - rich text editor images
- Image validation and compression-oriented upload flow.
- Multipart upload size configured in Spring.

### Bookmarks / Saved Posts

- Authenticated users can save and unsave posts.
- Saved posts page works like a personal reading library.
- Saved count, local search, sorting, and empty states.

### Comments

- Create comments and replies.
- Edit and delete comments.
- Like comments.
- Nested replies with improved UI.
- Author avatars and public profile links.

### Profiles

- Private profile page for the logged-in user.
- Public profile page for authors/users.
- Profile avatar upload and removal.
- Editable bio.
- Profile tabs for posts, saved posts, and about.
- Shared profile header design across private and public profiles.

### Admin

- Admin dashboard.
- Manage users.
- Manage posts.
- Moderate posts.
- Promote users to admin.
- Superadmin can add/promote admins.
- Cleaner admin tables with filters, badges, row actions, and mobile-friendly layouts.

### Frontend UI

- Responsive app shell and navbar.
- Shared UI components:
  - `Button`
  - `Badge`
  - `PageHeader`
  - `SectionCard`
  - `StatCard`
  - `Tabs`
  - `EmptyState`
  - `ErrorState`
  - `GridSkeleton`
- Improved home feed, category pages, saved posts, profile pages, post details, comments, and create/edit post flow.

## Architecture

The project uses a feature-oriented backend and a modular React frontend.

### Backend Architecture

The backend is organized by feature. Each feature owns its own package structure, usually including:

- `entity`
- `model` / DTOs
- `mapper`
- `repository`
- `service`
- `controller`

The common request flow is:

```text
Controller -> Service -> Repository -> Entity
            -> Mapper -> Response DTO
```

Important backend parts:

- Spring Security config for endpoint protection.
- JWT filter for token extraction and authentication.
- Feature services for business logic.
- MapStruct mappers for entity/DTO conversion.
- JPA entities and repositories for persistence.
- Global exception handling.
- MinIO media service for object storage.

### Frontend Architecture

The frontend is a React SPA using route-level pages and reusable components.

Key folders:

- `src/pages` - route-level screens.
- `src/components` - shared UI and feature components.
- `src/services` - API clients per feature.
- `src/context` - authentication state.
- `src/utils` - shared helpers like `apiFetch` and rich text helpers.

Frontend data flow:

```text
Page -> service function -> backend API
Page -> shared/feature components -> UI
```

Authentication state is stored in `AuthContext` and persisted with `localStorage`.

## Local Setup

### Prerequisites

- Java 21
- Maven
- Node.js and npm
- PostgreSQL
- Docker Desktop, for MinIO

### 1. Start MinIO

From the project root:

```bash
docker compose up
```

MinIO endpoints:

- API: `http://localhost:9000`
- Console: `http://localhost:9001`

Default local credentials:

```text
minioadmin / minioadmin
```

Create a bucket named:

```text
blog-media
```

For local public image URLs, the app expects:

```properties
storage.minio.public-url=http://localhost:9000/blog-media
```

### 2. Configure PostgreSQL

Create a database named:

```text
blogdb
```

Then update backend database credentials in:

```text
api/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/blogdb
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Run the Backend

```bash
cd api
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

### 4. Run the Frontend

```bash
cd ui
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Media Storage

Uploads are stored in MinIO, not in the project root. The backend handles media through a dedicated media layer and stores public object URLs on posts/users where needed.

Configured local properties:

```properties
storage.minio.endpoint=http://localhost:9000
storage.minio.access-key=minioadmin
storage.minio.secret-key=minioadmin
storage.minio.bucket=blog-media
storage.minio.public-url=http://localhost:9000/blog-media

spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=12MB
```

## Roles

### USER

- Read posts.
- Create posts.
- Edit/delete own posts.
- Comment and reply.
- Save posts.
- Edit own profile.

### ADMIN

- Access admin dashboard.
- Manage users.
- Moderate/manage posts.

### SUPERADMIN

- All admin permissions.
- Promote users/admins.
- Add more admins.

## Useful Commands

Backend:

```bash
cd api
mvn spring-boot:run
```

Frontend:

```bash
cd ui
npm run dev
```

Frontend production build:

```bash
cd ui
npm run build
```

MinIO:

```bash
docker compose up
```

## Screenshots

Existing screenshots are stored in:

```text
uploads/screenshots/
```

Current examples:

![Home Page](uploads/screenshots/home_page.png)
![Home Page 2](uploads/screenshots/home_page2.png)
![Post Details](uploads/screenshots/post_details.png)
![Login Page](uploads/screenshots/login_page.png)

## Future Improvements

- Backend tests for services, controllers, security, and media flows.
- Frontend smoke/component tests.
- Pagination or infinite scrolling across feeds, saved posts, comments, and admin tables.
- Draft, published, archived, and scheduled post states.
- Notifications for comments, replies, and moderation events.
- Refresh token flow.
- Email verification and password reset completion.
- Production deployment profile and full-stack Docker setup.
- Better audit trail for admin moderation actions.
- Dedicated settings page for profile, avatar, security, and account management.
