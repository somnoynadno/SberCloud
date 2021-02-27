import React from 'react';

import {AppRegistry} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {name as appName} from './src/app.json';
import App from './src/App';
import {colors} from './src/style/colors';

const theme = {
    ...DefaultTheme,
    roundness: 14,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.black,
        accent: colors.green,
        background: colors.white,
    },
};

export default function Main() {
    return (
        <PaperProvider theme={theme}>
            <App/>
        </PaperProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);
