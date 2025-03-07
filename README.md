# ProductReq

ProductReq is a Next.js application that allows users to browse brands and products, and make requests for specific products. The application is built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Project Structure

The project follows a standard Next.js App Router structure:

- `src/app`: Contains the main application routes and pages
- `src/components`: Reusable UI components
- `src/lib`: Utility functions and data services
- `src/types`: TypeScript type definitions
- `src/utils`: Helper functions and utilities

## Features

### Current Features

- Browse brands and products
- View detailed brand and product information
- Search for brands and products
- Make requests for specific products
- Responsive design for mobile and desktop
- Dark mode support

### Upcoming Features

- User authentication with Clerk
- User dashboard for managing requests
- Admin dashboard for managing brands, products, and requests
- Analytics and reporting
- Notification system

## Development

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in the required environment variables
4. Start the development server: `npm run dev`

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `NEXT_PUBLIC_APP_URL`: The URL of your application

For authentication (upcoming):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key

### Database Schema

The application uses Supabase as its database. The current schema includes:

- `brands`: Information about brands
- `products`: Information about products, linked to brands

Future schema updates will include:
- User profiles and preferences
- Request management
- Role-based access control

## Documentation

- [Database Implementation Checklist](DATABASE_IMPLEMENTATION_CHECKLIST.md): Tracks the progress of database implementation
- [Product Requirements Document](PRODUCT_REQUIREMENTS_DOCUMENT.md): Detailed requirements for authentication and dashboard features
- [Frontend Improvements Roadmap](FRONTEND_IMPROVEMENTS_ROADMAP.md): Planned improvements for the frontend

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
