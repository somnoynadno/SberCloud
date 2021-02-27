import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Divider, Subheading, Surface, Text, Title} from 'react-native-paper';
import {API} from '../../http/API';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {colors} from '../../style/colors';

class ApplicationOperationsManagement extends React.Component {
    constructor(props) {
        super(props);

        this.api = new API();

        this.state = {
            clusters: [],
        };
    }

    componentDidMount = async () => {
        await this.setClusters();
    };

    componentWillReceiveProps = async (nextProps: Readonly<P>, nextContext) => {
        await this.setClusters();
    };

    setClusters = async () => {
        return this.api.CloudContainerEngineClusters(this.props.selectedProject.id)
            .then(async (resp) => {
                let clusters = resp['clusters'];
                let promises = [];
                for (let elem of clusters) {
                    promises.push(this.api.ApplicationOperationsMetricList(elem['name'], this.props.selectedProject.id));
                }

                Promise.all(promises).then(data => {
                    let i = 0;
                    for (let d of data) {
                        if (d['metrics']) {
                            let ns = [];
                            for (let m of d['metrics']) {
                                const e = {name: m['namespace']};
                                if (!ns.find(elem => elem.name === e.name)) {
                                    ns.push(e);
                                }
                            }
                            clusters[i]['namespaces'] = ns;
                            clusters[i]['metrics'] = d['metrics'];
                        }
                        ++i;
                    }

                    this.setState({clusters});
                });
            })
            .catch((err) => {
                console.log(err.response.data);
            });
    };

    goToPanel = (item, cluster) => {
        this.props.navigation.push('ApplicationOperationsPanel', {
            selectedProject: this.props.selectedProject,
            name: item.name,
            cluster: cluster,
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Title>Application Operations Management</Title>
                <ScrollView>
                    {this.state.clusters.map((c, i) => {
                        return <Surface style={styles.cluster}>
                            <Subheading style={styles.subheading} key={i}>{`Cluster "${c.name}"`}</Subheading>
                            <Divider/>
                            {c['namespaces'].map((ns, j) => {
                                return <TouchableOpacity onPress={() => this.goToPanel(ns, c)}>
                                    <Text style={styles.namespace} key={'ns-' + j}>{ns.name}</Text>
                                </TouchableOpacity>;
                            })}
                        </Surface>;
                    })}
                </ScrollView>
            </View>
        );
    }
}

ApplicationOperationsManagement.PropTypes = {
    selectedProject: PropTypes.object.isRequired,
};

export default ApplicationOperationsManagement;

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    cluster: {
        padding: 10,
        margin: 10,
        borderRadius: 20,
    },
    namespace: {
        padding: 5,
    },
    subheading: {
        color: colors.darkGreen,
    },
});

