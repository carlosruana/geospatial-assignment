import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/theme';
import { Layout } from './components/Layout';
import { Flow } from './components/Flow';

function App() {
     return (
          <ThemeProvider theme={theme}>
               <CssBaseline />
               <Layout>
                    <Flow />
               </Layout>
          </ThemeProvider>
     );
}

export default App;
