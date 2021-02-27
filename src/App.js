import React from 'react';
import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LoginScreen from './view/LoginScreen';

const Stack = createStackNavigator();

class App extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                    <Stack.Screen name="Login" component={LoginScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

export default App;
