import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('Page rendering error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold text-[#172033] mb-3">This page could not load</h1>
            <p className="text-[#64748B] mb-6">Something went wrong while rendering this page. Return home and try again.</p>
            <Link to="/" onClick={() => this.setState({ hasError: false })}>
              <Button>Return Home</Button>
            </Link>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}