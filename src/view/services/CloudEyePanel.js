import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Subheading, Title} from 'react-native-paper';
import {API} from '../../http/API';
import {LineChart} from 'react-native-chart-kit';
import {colors} from '../../style/colors';
import moment from 'moment';
import Toast, {DURATION} from 'react-native-easy-toast';
import {Picker} from '@react-native-picker/picker';
import {availableTimeIntervals} from '../../config';

class CloudEyePanel extends React.Component {
    constructor(props) {
        super(props);

        this.api = new API();
        this.state = {
            data: [],
            interval: 60 * 60,
        };
    }

    componentDidMount = async () => {
        await this.getMetrics();
    };

    getMetrics = async () => {
        const {metricList, namespace, selectedProject} = this.props.route.params;
        let data = [];
        let names = [];
        for (let m of metricList) {
            if (m.id === namespace) {
                data.push(this.api.CloudEyeQuery(selectedProject.id, namespace, m['metric_name'], this.state.interval));
                names.push(m['metric_name']);
            }
        }
        Promise.all(data).then(values => {
            for (let i = 0; i < values.length; i++) {
                values[i]['metric'] = names[i];
            }
            this.setState({data: values});
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Title>
                        {this.props.route.params.name}
                    </Title>
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.interval}
                        onValueChange={async (itemValue, itemIndex) =>{
                            await this.setState({interval: itemValue});
                            await this.getMetrics();
                        }
                        }>
                        {
                            availableTimeIntervals.map((elem, i) => {
                                return <Picker.Item key={i} label={elem.label} value={elem.value}/>;
                            })
                        }
                    </Picker>
                </View>
                <ActivityIndicator animating={this.state.data === []} color={colors.green}/>
                <ScrollView>
                    {this.state.data.map((d, i) => {
                        if (d['datapoints'].length > 0) {
                            let labels = [];
                            let times = [];
                            let data = [];
                            let unit = d['datapoints'][0]['unit'];

                            let j = 0;
                            for (let e of d['datapoints']) {
                                labels.push(j++);
                                times.push(moment(e['timestamp']))
                                data.push(e['average']);
                            }

                            return <View key={'panel-' + i}>
                                <Subheading>{`${d.metric} (${unit})`}</Subheading>
                                <LineChart
                                    data={{
                                        labels: labels,
                                        datasets: [
                                            {
                                                data: data,
                                            },
                                        ],
                                    }}
                                    width={Dimensions.get('window').width - styles.container.padding * 2}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: colors.white,
                                        backgroundGradientFrom: colors.white,
                                        backgroundGradientTo: '#fafafa',
                                        color: (opacity) => colors.darkGreen + '88',
                                        labelColor: (opacity) => colors.black,
                                        style: {
                                            borderRadius: 16,
                                        },
                                        propsForDots: {
                                            r: '2',
                                            strokeWidth: '1',
                                            stroke: colors.green,
                                        },
                                    }}
                                    bezier
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16,
                                    }}
                                    onDataPointClick={(e) => {
                                        this.toast.show(`${data[e.index]} (${times[e.index].format("LLL")})`, DURATION.SHORT);
                                    }}
                                />
                            </View>;
                        } else {
                            return <Subheading>No data for this period</Subheading>;
                        }
                    })}
                </ScrollView>
                <Toast
                    ref={(toast) => this.toast = toast}
                    style={{backgroundColor: colors.silver}}
                    opacity={0.9}
                    textStyle={{color: colors.black}}
                />
            </View>
        );
    }
}

export default CloudEyePanel;

const styles = StyleSheet.create({
    container: {
        padding: 20,
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
    },
});

