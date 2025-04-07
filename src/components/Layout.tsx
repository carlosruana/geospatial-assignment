import { Box } from '@mui/material';

interface LayoutProps {
     children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
     return (
          <Box
               sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    width: '100vw',
                    overflow: 'hidden',
               }}
          >
               {children}
          </Box>
     );
};
