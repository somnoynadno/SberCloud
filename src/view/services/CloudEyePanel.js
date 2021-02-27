import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {ActivityIndicator, Subheading, Title} from 'react-native-paper';
import {API} from '../../http/API';
import {LineChart} from 'react-native-chart-kit';
import {colors} from '../../style/colors';
import moment from 'moment';
import Toast, {DURATION} from 'react-native-easy-toast'

class CloudEyePanel extends React.Component {
    constructor(props) {
        super(props);

        this.api = new API();
        this.state = {
            data: [],
        };
    }

    componentDidMount = async () => {
        const {metricList, namespace, selectedProject} = this.props.route.params;
        let data = [];
        let names = [];
        for (let m of metricList) {
            if (m.id === namespace) {
                data.push(this.api.CloudEyeQuery(selectedProject.id, namespace, m['metric_name']));
                names.push(m['metric_name'])
            }
        }
        Promise.all(data).then(values => {
            for (let i = 0; i < values.length; i++) {
                values[i]['metric'] = names[i];
            }
            this.setState({data: values});
        })
    };

    render() {
        return (
            <View style={styles.container}>
                <Title>
                    {this.props.route.params.name}
                </Title>
                {/* TODO: change time periods */}
                <ActivityIndicator animating={this.state.data === []} color={colors.green} />
                <ScrollView>
                    {this.state.data.map((d, i) => {
                        if (d['datapoints'].length > 0) {
                            let labels = [];
                            let data = [];
                            let unit = d['datapoints'][0]['unit'];
                            for (let e of d['datapoints']) {
                                labels.push(moment(e['timestamp']).format("hh:mm"));
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
                                        backgroundGradientTo: "#fafafa",
                                        color: (opacity) => colors.darkGreen + "88",
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
                                        this.toast.show(`${data[e.index]} (${labels[e.index]})`, DURATION.SHORT);
                                    }}

                                />
                            </View>
                        } else return <Subheading>No data for this period</Subheading>
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
});

