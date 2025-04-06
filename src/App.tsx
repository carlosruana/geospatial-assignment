import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './styles/theme';

function App() {
     return (
          <ThemeProvider theme={theme}>
               <CssBaseline />
               <div className="app">{/* ReactFlow and Deck.gl components will go here */}</div>
          </ThemeProvider>
     );
}

export default App;
