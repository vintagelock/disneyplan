import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, DEFAULT_THEME, MantineProvider, mergeMantineTheme } from '@mantine/core';
import { DatesProvider, DATES_PROVIDER_DEFAULT_SETTINGS } from '@mantine/dates';
import { Notifications } from '@mantine/notifications';

import './index.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import DisneyTripPlanner from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';

const myTheme = createTheme({
  colors: {
    // Add your color
    sepia: [
      '#F4ECD8',
      '#EAD8B7',
      '#DFC29A',
      '#D4AC7E',
      '#C99862',
      '#BD8447',
      '#B2702D',
      '#A55C15',
      '#924908',
      '#7A3704',
    ],
    // or replace default theme color
    blue: [
      '#ecf4ff',
      '#dce4f5',
      '#b9c7e2',
      '#94a8d0',
      '#748dc0',
      '#5f7cb7',
      '#5474b4',
      '#44639f',
      '#3a5890',
      '#2c4b80',
    ],

    purple: [
      '#f6eeff',
      '#e7d9f7',
      '#cab1ea',
      '#ad86dd',
      '#9462d2',
      '#854bcb',
      '#7d3fc9',
      '#6b31b2',
      '#5f2ba0',
      '#52238d',
    ],
  },

  primaryColor: 'purple',
  primaryShade: { dark: 9, light: 1 },
  defaultRadius: 'sm',
  fontFamily: 'Inter, system-ui, sans-serif',
});

const mergedTheme = mergeMantineTheme(DEFAULT_THEME, myTheme);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <MantineProvider theme={mergedTheme} defaultColorScheme="dark">
        <DatesProvider settings={DATES_PROVIDER_DEFAULT_SETTINGS}>
          <Notifications />
          <DisneyTripPlanner />
        </DatesProvider>
      </MantineProvider>
    </ErrorBoundary>
  </StrictMode>,
);
