import React from 'react';
import themes from './theme/index';

const DEFAULT_THEME = themes.light;
export const ThemeContext = React.createContext(DEFAULT_THEME);
