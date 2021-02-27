import React from 'react';
import {StyleSheet, View} from 'react-native';
import {API} from '../http/API';
import MainMenu from './components/MainMenu';

import CES from '../assets/icons/CES.png';
import AOM from '../assets/icons/AOM.png';
import APM from '../assets/icons/APM.png';
import CTS from '../assets/icons/CTS.png';
import CloudEyeService from './services/CloudEyeService';


const services = [
    {source: CES, name: 'CES'},
    {source: AOM, name: 'AOM'},
    {source: APM, name: 'APM'},
    {source: CTS, name: 'CTS'},
];

class MainScreen extends React.Component {
    constructor(props) {
        super(props);

        this.api = new API();

        this.state = {
            projects: [],
            selectedProject: null,
            services: services,
            selectedService: services[0],
        };
    }

    componentDidMount = async () => {
        this.api.Projects().then((resp) => {
            console.log(resp);
            this.setState({
                projects: resp['response'],
                selectedProject: resp['response'][0],
            });
        }).catch((err) => {
            console.log(err.response.data);
        });
    };

    selectProject = (i) => {
        console.log("changing project");
        this.setState({selectedProject: this.state.projects[i]});
    };

    selectService = (i) => {
        console.log("changing service");
        this.setState({selectedService: this.state.services[i]});
    };

    render() {
        let service = null;

        if (this.state.selectedProject) {
            switch (this.state.selectedService.name) {
                case "CES":
                    service = <CloudEyeService navigation={this.props.navigation} selectedProject={this.state.selectedProject}/>
                    break
                default:
                    service = <CloudEyeService selectedProject={this.state.selectedProject}/>
            }
        }

        return (
            <View sytyle={styles.container}>
                <MainMenu selectProjectCallback={(i) => this.selectProject(i)}
                          projects={this.state.projects}
                          selectedProject={this.state.selectedProject}
                          selectServiceCallback={(i) => this.selectService(i)}
                          services={this.state.services}
                          selectedService={this.state.selectedService}/>
                {service ? service : <View/>}
            </View>
        );
    }
}

export default MainScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

