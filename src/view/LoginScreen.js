import React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Dialog, Portal, Surface, Text, TextInput} from 'react-native-paper';
import {Image, ImageBackground, StyleSheet, View} from 'react-native';
import background from '../assets/backround.png';
import logo from '../assets/logo_white.png';
import {colors} from '../style/colors';
import {API} from '../http/API';

class LoginScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errorModalVisible: false,
            errorMessage: 'Unknown error',
        };
    }

    componentDidMount = async () => {
        const t = await AsyncStorage.getItem('@token');
        if (t) {
            this.props.navigation.replace('Main');
        }
    };

    onLogin = async () => {
        const {username, password} = this.state;
        const api = new API();

        await api.Login(username, password)
            .then(async (resp) => {
                try {
                    await AsyncStorage.setItem('@token', resp['srv_token']);
                } catch (e) {
                    console.log(e);
                    await AsyncStorage.setItem('@token', '');
                    this.setState({errorMessage: 'Fatal error, try again later'});
                    this.showErrorDialog();
                }

                this.props.navigation.push('Main');
            }).catch(async (err) => {
                console.log(err.response.data);
                this.setState({errorMessage: 'Invalid credentials'});
                await AsyncStorage.setItem('@token', '');
                this.showErrorDialog();
            });
    };

    showErrorDialog = () => this.setState({errorModalVisible: true});
    hideErrorDialog = () => this.setState({errorModalVisible: false});

    render() {
        return (
            <View style={styles.container}>
                <Portal>
                    <Dialog visible={this.state.errorModalVisible} onDismiss={this.hideErrorDialog}>
                        <Dialog.Title>Error</Dialog.Title>
                        <Dialog.Content>
                            <Text>{this.state.errorMessage}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.hideErrorDialog}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <ImageBackground source={background} style={styles.bg}>
                    <Image source={logo} style={styles.logo}/>
                    <Surface style={styles.surface}>
                        <Text style={styles.title}>Log in</Text>
                        <TextInput
                            style={styles.input}
                            label="Username"
                            value={this.state.username}
                            onChangeText={username => this.setState({username})}
                        />
                        <TextInput
                            style={styles.input}
                            label="Password"
                            value={this.state.password}
                            onChangeText={password => this.setState({password})}
                        />
                    </Surface>
                    <Button mode="contained" style={styles.button} color={colors.white}
                            onPress={() => this.onLogin()}>
                        Log in
                    </Button>
                    <Text style={styles.text}>Forgot your password?</Text>
                </ImageBackground>
            </View>
        );
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    button: {
        padding: 5,
        marginLeft: '20%',
        marginRight: '20%',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    logo: {
        margin: '10%',
    },
    input: {
        margin: 10,
    },
    surface: {
        padding: 10,
        elevation: 4,
        margin: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    title: {
        fontSize: 28,
        margin: 15,
        color: colors.white,
        textAlign: 'center',
    },
    text: {
        marginTop: 15,
        color: colors.white,
        textAlign: 'center',
    },
});

