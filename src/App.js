import React from 'react';
import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from './view/LoginScreen';
import MainScreen from './view/MainScreen';
import CloudEyePanel from './view/services/CloudEyePanel';
import ApplicationOperationsPanel from './view/services/ApplicationOperationsPanel';

const Stack = createStackNavigator();

class App extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Login" component={LoginScreen}/>
                    <Stack.Screen name="Main" component={MainScreen}/>
                    <Stack.Screen name="CloudEyePanel" component={CloudEyePanel}/>
                    <Stack.Screen name="ApplicationOperationsPanel" component={ApplicationOperationsPanel}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default App;
