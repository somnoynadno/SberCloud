import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, DataTable, Dialog, IconButton, Portal, Text, Title} from 'react-native-paper';
import {API} from '../../http/API';
import PropTypes from 'prop-types';
import {colors} from '../../style/colors';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
import {availableTimeIntervals} from '../../config';

class CloudTraceService extends React.Component {
    constructor(props) {
        super(props);

        this.api = new API();

        this.state = {
            events: [],
            showDetails: false,
            details: '',
            interval: 60 * 60,
        };
    }

    componentDidMount = async () => {
        await this.setEventList(this.props.selectedProject.id);
    };

    componentWillReceiveProps = async (nextProps: Readonly<P>, nextContext) => {
        await this.setEventList(nextProps.selectedProject.id);
    };

    setEventList = (projectID) => {
        return this.api.CloudTraceQuery(projectID, this.state.interval)
            .then((resp) => {
                console.log(resp);
                this.setState({events: resp});
            }).catch((err) => {
                console.log(err.response.data);
                this.setState({events: []});
            });
    };

    getDetails = async (traceID) => {
        this.setState({details: ''});
        await this.api.CloudTraceDetails(this.props.selectedProject.id, traceID, this.state.interval)
            .then((resp) => {
                console.log(resp);
                this.setState({details: JSON.stringify(resp)});
            })
            .catch((err) => {
                console.log(err.response.data);
            });
        this.showDialog();
    };

    showDialog = () => this.setState({showDetails: true});

    hideDialog = () => this.setState({showDetails: false});

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Title>Cloud Trace Service</Title>
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.interval}
                        onValueChange={async (itemValue, itemIndex) => {
                            await this.setState({interval: itemValue});
                            await this.setEventList(this.props.selectedProject.id);
                        }
                        }>
                        {
                            availableTimeIntervals.map((elem, i) => {
                                return <Picker.Item key={i} label={elem.label} value={elem.value}/>;
                            })
                        }
                    </Picker>
                </View>
                <Portal>
                    <Dialog style={styles.modal} visible={this.state.showDetails} onDismiss={this.hideDialog}>
                        <Dialog.Title>Details</Dialog.Title>
                        <Dialog.Content>
                            <ScrollView>
                                <Text>{this.state.details}</Text>
                            </ScrollView>
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
                            return <DataTable.Row key={'tr-' + i}>
                                <DataTable.Cell>{e['Trace Name']}</DataTable.Cell>
                                <DataTable.Cell>{e['Resource Type']}</DataTable.Cell>
                                <DataTable.Cell>{e['Trace Status']}</DataTable.Cell>
                                <DataTable.Cell>{moment(e['Operation Time']).format('MM:HH')}</DataTable.Cell>
                                <DataTable.Cell>{<IconButton
                                    icon="eye"
                                    color={colors.green}
                                    size={20}
                                    onPress={() => this.getDetails(e['Id'])}
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
    header: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 50,
        alignItems: 'center',
    },
    picker: {
        width: 100,
        alignSelf: 'flex-end',
    },
    modal: {
        marginBottom: 40,
    },
});

