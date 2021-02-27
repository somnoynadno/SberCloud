import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {Subheading, Title} from 'react-native-paper';
import {API} from '../../http/API';
import {LineChart} from 'react-native-chart-kit';
import {colors} from '../../style/colors';
import moment from 'moment';
import Toast, {DURATION} from 'react-native-easy-toast';

class ApplicationOperationsPanel extends React.Component {
    constructor(props) {
        super(props);

        this.api = new API();
        this.state = {
            data: [],
        };
    }

    componentDidMount = async () => {
        await this.getMetrics();
    };

    getMetrics = async () => {
        const {name, selectedProject, cluster} = this.props.route.params;
        let data = [];
        let names = [];
        for (let m of cluster['metrics']) {
            if (m.namespace === name) {
                data.push(this.api.ApplicationOperationsQuery(selectedProject.id, cluster.name, name, m['metricName']));
                names.push(m['metricName']);
            }
        }
        Promise.all(data).then(values => {
            for (let i = 0; i < values.length; i++) {
                values[i]['metric'] = names[i];
            }
            this.setState({data: values});
        });
    };

    render() {
        return (
            <View style={styles.container}>
                <Title>
                    {this.props.route.params.name}
                </Title>

                <ScrollView>
                    {this.state.data.map((d, i) => {
                        if (d['points'].length > 0) {
                            let labels = [];
                            let times = [];
                            let data = [];
                            let unit = d['points'][0]['unit'];

                            let j = 0;
                            for (let e of d['points']) {
                                labels.push(j++);
                                times.push(moment(e['timestamp']));
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
                                        this.toast.show(`${data[e.index]} (${times[e.index].format('LLL')})`, DURATION.SHORT);
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

export default ApplicationOperationsPanel;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
});

