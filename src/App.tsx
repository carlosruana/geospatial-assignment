import { Workflows } from './views/Workflows/Workflows';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';
import { Layout } from './components/Layout';
import { ReactFlowProvider } from '@xyflow/react';
const App = () => {
     return (
          <ThemeProvider theme={theme}>
               <CssBaseline />
               <Layout>
                    {/* ReactFlowProvider is required for the Flow component to work with
               screenToFlowPosition to drag and drop and other features
               https://reactflow.dev/learn/troubleshooting#001
               https://xyflow.dev/docs/react-flow-provider */}
                    <ReactFlowProvider>
                         <Workflows />
                    </ReactFlowProvider>
               </Layout>
          </ThemeProvider>
     );
};

export default App;
