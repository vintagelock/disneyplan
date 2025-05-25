import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Container, Text, Button, Paper } from '@mantine/core';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Container
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            padding: '1rem',
          }}
        >
          <Paper shadow="xs" p="md" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
            <Text size="xl" fw={700} mb="md">
              Something went wrong
            </Text>
            <Text c="dimmed" mb="xl">
              {this.state.error?.message}
            </Text>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
