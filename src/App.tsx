import { Workflows } from './views/Workflows/Workflows';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';
import { Layout } from './components/Layout';

const App = () => {
     return (
          <ThemeProvider theme={theme}>
               <CssBaseline />
               <Layout>
                    <Workflows />
               </Layout>
          </ThemeProvider>
     );
};

export default App;
