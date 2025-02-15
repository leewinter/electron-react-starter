import { Outlet } from 'react-router-dom';
import { ThemeProviderWrapper } from './contexts/theme-context';

function App(): JSX.Element {
  return (
    <ThemeProviderWrapper>
      <Outlet />
    </ThemeProviderWrapper>
  );
}

export default App;
