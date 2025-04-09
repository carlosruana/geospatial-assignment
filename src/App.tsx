import { Workflows } from './views/Workflows/Workflows';
import { CssBaseline, ThemeProvider, Box } from '@mui/material';
import { theme } from './styles/theme';
import { ReactFlowProvider } from '@xyflow/react';

const App = () => {
     return (
          <ThemeProvider theme={theme}>
               <CssBaseline />
               <Box
                    sx={{
                         display: 'flex',
                         flexDirection: 'column',
                         height: '100vh',
                         width: '100vw',
                         overflow: 'hidden',
                    }}
               >
                    {/* ReactFlowProvider is required for the Flow component to work with
               			screenToFlowPosition to drag and drop and other features
              			https://reactflow.dev/learn/troubleshooting#001
              			https://xyflow.dev/docs/react-flow-provider */}
                    <ReactFlowProvider>
                         <Workflows />
                    </ReactFlowProvider>
               </Box>
          </ThemeProvider>
     );
};

export default App;
