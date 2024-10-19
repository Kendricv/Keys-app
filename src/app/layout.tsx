// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import './ui/globals.css';
import '@mantine/charts/styles.css';

import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core';

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
};

const theme = createTheme({
  primaryColor: 'violet',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">{children}</MantineProvider>
      </body>
    </html>
  );
}