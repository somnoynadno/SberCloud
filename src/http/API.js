import axios from 'axios';
import {apiAddress} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class API {
    constructor() {
        this.api = axios.create({
            baseURL: apiAddress,
            timeout: 8000,
            headers: {'Authorization': ''},
        });

        this.api.interceptors.request.use(async function (config) {
            if (!config.headers['Authorization']) {
                config.headers['Authorization'] = await AsyncStorage.getItem('@token');
            }
            return config;
        }, function (error) {
            return Promise.reject(error);
        });
    }

    Login(login, password) {
        return new Promise((resolve, reject) => {
            this.api.post(`/login`, {'login': login, 'password': password})
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        });
    }

    Projects() {
        return new Promise((resolve, reject) => {
            this.api.post(`/projects`)
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        });
    }

    CloudEyeMetricList(projectID) {
        return new Promise((resolve, reject) => {
            this.api.post(`/eye/metric_list`, {'project_id': projectID})
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        });
    }

    CloudEyeQuery(projectID, namespace, metric, duration = 60 * 60) {
        return new Promise((resolve, reject) => {
            this.api.post(`/eye/query`,
                {
                    'project_id': projectID,
                    'metric_name': metric,
                    'duration_sec': duration,
                    'namespace': namespace,
                },
            )
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        });
    }

    CloudTraceQuery(projectID, duration = 60 * 60 * 24) {
        return new Promise((resolve, reject) => {
            this.api.post(`/cts/overview`,
                {
                    'project_id': projectID,
                    'duration_sec': duration,
                },
            )
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        });
    }

    CloudTraceDetails(projectID, traceID, duration = 60 * 60 * 24) {
        return new Promise((resolve, reject) => {
            this.api.post(`/cts/detail`,
                {
                    'project_id': projectID,
                    'trace_id': traceID,
                    'duration_sec': duration,
                },
            )
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        });
    }

    CloudContainerEngineClusters(projectID) {
        return new Promise((resolve, reject) => {
            this.api.post(`/cce/clusters/overview`, {'project_id': projectID})
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        });
    }

    ApplicationOperationsMetricList(clusterName, projectID) {
        return new Promise((resolve, reject) => {
            this.api.post(`/aom/metric_list`,
                {
                    'cluster_name': clusterName,
                    'project_id': projectID,
                },
            )
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        });
    }

    ApplicationOperationsQuery(projectID, clusterName, namespace, metric) {
        return new Promise((resolve, reject) => {
            this.api.post(`/aom/query`,
                {
                    'project_id': projectID,
                    'cluster_name': clusterName,
                    'metric_name': metric,
                    'namespace': namespace,
                },
            )
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        });
    }
}
