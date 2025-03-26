## Description

File Drive is a cloud-based file management system that allows users to upload, organize, and manage their files efficiently. It provides essential features such as authentication, file organization, and real-time updates using Convex as the backend.

## Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS, Radix UI
- **State Management**: Convex (serverless backend)
- **Backend**: Convex functions
- **Database**: Convex Database
- **APIs Used**: Clerk for authentication

## Key Features

- **File Upload & Management**: Users can upload, rename, delete, and organize files.
- **Favorites & Trash System**: Move files to favorites or trash for better organization.
- **Authentication**: Secure user authentication via Clerk.
- **Real-time Updates**: Instant file updates using Convex backend.
- **Search & Filtering**: Users can search and filter files efficiently.
- **Intuitive UI**: Responsive and accessible interface with Radix UI.

## Overview of APIs used

### Authentication

- **Clerk API**: Handles user authentication and session management.

### File Management (Internal Convex API)

- **`POST /api/files/upload`** → Uploads a file.
- **`GET /api/files`** → Retrieves all user files.
- **`PATCH /api/files/:id`** → Renames or updates file metadata.
- **`DELETE /api/files/:id`** → Moves file to trash or deletes it permanently.

## Project Setup & Installation

```
git clone <https://github.com/yourusername/file-drive.git>
cd file-drive
npm install
npm run dev

```

## Environment Variables

Create a `.env.local` file and configure the following:

```
CONVEX_DEPLOYMENT=your_convex_deployment_site

NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CONVEX_SITE_URL=your_convex_site_url

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

```

## Challenges & Solutions

### Challenge 1: Handling Real-time Updates

**Problem**: Ensuring file updates reflect instantly without reloading.
**Solution**: Used Convex’s built-in real-time sync feature to update UI dynamically.

### Challenge 2: Secure File Uploads

**Problem**: Prevent unauthorized file uploads.
**Solution**: Integrated Clerk authentication to verify users before allowing file operations.

## Architecture & Code Structure

```
/file-drive
  ├── /convex  # Convex backend functions
  │   ├── auth.config.ts
  │   ├── files.ts
  │   ├── users.ts
  │   ├── schema.ts
  │
  ├── /src
  │   ├── /app/(dashboard)  # Main dashboard pages
  │   ├── /components  # Reusable UI components
  │   ├── /lib  # Utility functions
  │   ├── middleware.ts  # API authentication logic

```

### Explanation

- **Convex** handles database operations and API logic.
- **Next.js App Directory** follows a modular approach for pages and UI components.
- **Middleware** ensures secure API access.

## Lessons Learned

- Leveraging serverless databases like Convex simplifies backend operations.
- Clerk makes authentication seamless for modern applications.
- Real-time updates significantly improve user experience in file management systems.

## Future Improvements

- **Drag & Drop Upload**: Enhance the UI for better file uploads.
- **File Sharing**: Allow users to share files with links.
- **Version Control**: Maintain file version history.

## Deployment

- **Platform**: Vercel
- **Deployment Issues**: Initial Clerk authentication setup required proper domain configuration.

## References & Resources

- [Convex Documentation](https://docs.convex.dev/)
- [Clerk Authentication Guide](https://clerk.dev/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
