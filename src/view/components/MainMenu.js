import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import PropTypes from 'prop-types';

class MainMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext): boolean {
        return true;
    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.selectedProject ?
                    <Picker
                        style={styles.picker}
                        selectedValue={this.props.selectedProject.id}
                        onValueChange={(itemValue, itemIndex) =>
                            this.props.selectProjectCallback(itemIndex)
                        }>
                        {
                            this.props.projects.map((elem, i) => {
                                return <Picker.Item key={i} label={elem.name} value={elem.id}/>;
                            })
                        }
                    </Picker>
                    :
                    <View/>
                }

                <View style={styles.menu}>
                    {
                        this.props.services.map((s, i) => {
                            return <Image onClick={(i) => this.props.selectServiceCallback(i)}
                                          style={styles.menuItem} source={s.source} key={i}/>;
                        })
                    }
                </View>
            </View>
        );
    }
}

MainMenu.propTypes = {
    projects: PropTypes.array.isRequired,
    selectedProject: PropTypes.object.isRequired,
    selectProjectCallback: PropTypes.func.isRequired,

    services: PropTypes.array.isRequired,
    selectedService: PropTypes.object.isRequired,
    selectServiceCallback: PropTypes.func.isRequired,
};

export default MainMenu;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        minHeight: 70,
    },
    picker: {
        width: 150,
    },
    menu: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: '10%',
    },
    menuItem: {
        margin: 8,
    },
});

