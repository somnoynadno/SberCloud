import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Surface, Title} from 'react-native-paper';
import {API} from '../../http/API';
import PropTypes from 'prop-types';
import CloudEyePanel from './CloudEyePanel';
import {TouchableOpacity} from 'react-native-gesture-handler';

class CloudEyeService extends React.Component {
    constructor(props) {
        super(props);

        this.api = new API();

        this.state = {
            metricList: [],
            namespaces: [],
        };
    }

    componentDidMount = async () => {
        await this.setMetricList(this.props.selectedProject.id);
    };

    componentWillReceiveProps = async (nextProps: Readonly<P>, nextContext) => {
        await this.setMetricList(nextProps.selectedProject.id);
    };

    setMetricList = (projectID) => {
        return this.api.CloudEyeMetricList(projectID)
            .then((resp) => {
                console.log(resp);
                if (resp['metrics']) {
                    let ns = [];
                    for (let elem of resp['metrics']) {
                        const e = {id: elem['id'], name: elem['name']};
                        if (!ns.find(elem => elem.id === e.id)) {
                            ns.push(e);
                        }
                    }
                    this.setState({metricList: resp['metrics'], namespaces: ns});
                } else {
                    this.setState({metricList: [], namespaces: []});
                }
            }).catch((err) => {
                console.log(err.response.data);
            });
    };

    goToPanel = (item) => {
        this.props.navigation.push('CloudEyePanel', {
            selectedProject: this.props.selectedProject,
            name: item.name,
            namespace: item.id,
            metricList: this.state.metricList,
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Title>Cloud Eye</Title>
                <ScrollView>
                    {
                        this.state.namespaces.map((item, i) => {
                            return <Surface key={'s-' + i} style={styles.item}>
                                <TouchableOpacity onPress={() => this.goToPanel(item)}>
                                    <Title>{item.name}</Title>
                                </TouchableOpacity>
                            </Surface>;
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}

CloudEyeService.PropTypes = {
    selectedProject: PropTypes.object.isRequired,
};

export default CloudEyeService;

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    item: {
        width: 'auto',
        margin: 10,
        padding: 10,
        borderRadius: 20,
        height: 60,
    },
});

