import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Text, Dialog, Portal , DataTable, IconButton, Title} from 'react-native-paper';
import {API} from '../../http/API';
import PropTypes from 'prop-types';
import {colors} from '../../style/colors';
import moment from 'moment';

class CloudTraceService extends React.Component {
    constructor(props) {
        super(props);

        this.api = new API();

        this.state = {
            events: [],
            showDetails: false,
            details: "",
        };
    }

    componentDidMount = async () => {
        await this.setEventList(this.props.selectedProject.id);
    };

    componentWillReceiveProps = async (nextProps: Readonly<P>, nextContext) => {
        await this.setEventList(nextProps.selectedProject.id);
    };

    setEventList = (projectID) => {
        return this.api.CloudTraceQuery(projectID)
            .then((resp) => {
                console.log(resp);
                this.setState({events: resp});
            }).catch((err) => {
                console.log(err.response.data);
                this.setState({events: []});
            });
    };

    getDetails = async (traceID) => {
        this.setState({details: ""});
        await this.api.CloudTraceDetails(this.props.selectedProject.id, traceID)
            .then((resp) => {
                console.log(resp);
                this.setState({details: resp});
            })
            .catch((err) => {
                console.log(err.response.data);
            })
        this.showDialog();
    }

    showDialog = () => this.setState({showDetails: true});

    hideDialog = () => this.setState({showDetails: false});

    render() {
        return (
            <View style={styles.container}>
                <Title>Cloud Trace Service</Title>
                <Portal>
                    <Dialog visible={this.state.showDetails} onDismiss={this.hideDialog}>
                        <Dialog.Title>Details</Dialog.Title>
                        <Dialog.Content>
                            <Text>{this.state.details}</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={this.hideDialog}>Close</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
                <ScrollView>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Name</DataTable.Title>
                            <DataTable.Title>Resource</DataTable.Title>
                            <DataTable.Title>Status</DataTable.Title>
                            <DataTable.Title>Time</DataTable.Title>
                            <DataTable.Title>Details</DataTable.Title>
                        </DataTable.Header>

                        {this.state.events.map((e, i) => {
                            return <DataTable.Row key={"tr-" + i}>
                                <DataTable.Cell>{e['Trace Name']}</DataTable.Cell>
                                <DataTable.Cell>{e['Resource Type']}</DataTable.Cell>
                                <DataTable.Cell>{e['Trace Status']}</DataTable.Cell>
                                <DataTable.Cell>{moment(e['Operation Time']).format("MM:HH")}</DataTable.Cell>
                                <DataTable.Cell>{<IconButton
                                    icon="eye"
                                    color={colors.green}
                                    size={20}
                                    onPress={() => this.getDetails(e["Id"])}
                                />}</DataTable.Cell>
                            </DataTable.Row>;
                        })}
                    </DataTable>
                </ScrollView>
            </View>
        );
    }
}

CloudTraceService.PropTypes = {
    selectedProject: PropTypes.object.isRequired,
};

export default CloudTraceService;

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});

