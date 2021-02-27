import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Title} from 'react-native-paper';
import {API} from '../../http/API';
import PropTypes from 'prop-types';

class ApplicationOperationsManagement extends React.Component {
    constructor(props) {
        super(props);

        this.api = new API();

        this.state = {};
    }

    render() {
        return (
            <View style={styles.container}>
                <Title>Application Operations Management</Title>
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
});

