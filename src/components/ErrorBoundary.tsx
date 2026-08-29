import * as React from 'react';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Platform caught error in boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          onClick={this.handleReset}
          className="min-h-screen w-full flex items-center justify-start bg-white px-8 sm:px-16 md:px-24 select-none cursor-pointer"
          title="Click to reload application"
        >
          <p className="text-[#60a5fa] text-sm sm:text-base font-normal tracking-normal">
            my app is not loading, there is a white screen. lets fix this.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
