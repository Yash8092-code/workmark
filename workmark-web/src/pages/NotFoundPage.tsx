import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#2563EB] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-[#172033] mb-4">Page Not Found</h2>
        <p className="text-[#64748B] text-lg mb-8 max-w-md mx-auto">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg">
            <HomeIcon className="h-5 w-5 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
