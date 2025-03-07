import React from 'react';

interface ServerErrorProps {
  message?: string;
}

export default function ServerError({ message = "Something went wrong with the database connection. Please try again later." }: ServerErrorProps) {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600">
            {message}
          </h2>
        </div>
      </div>
    </div>
  );
} 