import { Outlet } from 'react-router-dom';
import { ThemeProviderWrapper } from './contexts/theme-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProviderWrapper>
        <Outlet />
      </ThemeProviderWrapper>
    </QueryClientProvider>
  );
}

export default App;
