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
}
