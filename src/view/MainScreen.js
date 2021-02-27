import React from 'react';
import {StyleSheet, View} from 'react-native';
import {API} from '../http/API';
import MainMenu from './components/MainMenu';

import CES from '../assets/icons/CES';
import AOM from '../assets/icons/AOM';
import APM from '../assets/icons/APM';
import CTS from '../assets/icons/CTS';

import CES_active from '../assets/icons/CES_active';
import AOM_active from '../assets/icons/AOM_active';
import APM_active from '../assets/icons/APM_active';
import CTS_active from '../assets/icons/CTS_active';

import CloudEyeService from './services/CloudEyeService';
import CloudTraceService from './services/CloudTraceService';
import ApplicationPerformanceManagement from './services/ApplicationPerformanceManagement';
import ApplicationOperationsManagement from './services/ApplicationOperationsManagement';


const services = [
    {component: CES(), active: CES_active(), name: 'CES'},
    {component: AOM(), active: AOM_active(), name: 'AOM'},
    {component: APM(), active: APM_active(), name: 'APM'},
    {component: CTS(), active: CTS_active(), name: 'CTS'},
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
            this.setState({
                projects: resp['response'],
                selectedProject: resp['response'][0],
            });
        }).catch((err) => {
            console.log(err.response.data);
        });
    };

    selectProject = (i) => {
        this.setState({selectedProject: this.state.projects[i]});
    };

    selectService = (i) => {
        this.setState({selectedService: services[i]});
    };

    render() {
        let service = null;

        if (this.state.selectedProject) {
            switch (this.state.selectedService.name) {
                case 'CES':
                    service = <CloudEyeService navigation={this.props.navigation}
                                               selectedProject={this.state.selectedProject}/>;
                    break;
                case 'CTS':
                    service = <CloudTraceService navigation={this.props.navigation}
                                                 selectedProject={this.state.selectedProject}/>;
                    break;
                case 'APM':
                    service = <ApplicationPerformanceManagement navigation={this.props.navigation}
                                                                selectedProject={this.state.selectedProject}/>;
                    break;
                case 'AOM':
                    service = <ApplicationOperationsManagement navigation={this.props.navigation}
                                                               selectedProject={this.state.selectedProject}/>;
                    break;
                default:
                    service = <CloudEyeService navigation={this.props.navigation}
                                               selectedProject={this.state.selectedProject}/>;
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
        flex: 1,
    },
});

