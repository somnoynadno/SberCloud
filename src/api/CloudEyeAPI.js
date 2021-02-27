import axios from 'axios'
import {apiAddress} from "../config";

export class CloudEyeAPI {
    constructor(token="") {
        this.token = token;
    }

    Login(login, password) {
        return new Promise((resolve, reject) => {
            axios.post(apiAddress + `/login`, {"login": login, "password": password})
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        })
    }

    GetMetricList(projectID) {
        return new Promise((resolve, reject) => {
            axios.post(apiAddress + `/metric_list`, {"project_id": projectID})
                .then(response => resolve(response.data))
                .catch(error => reject(error));
        })
    }
}


export const cloudEyeAPI = new CloudEyeAPI();
