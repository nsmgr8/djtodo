/**
 * Wrap HTTP API interface for tasks
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

/**
 * tasks API service
 */
@Injectable({
    providedIn: 'root'
})
export class TasksService {
    // root endpoint of the HTTP API
    api_root = environment.production ? '/api/' : '//localhost:8000/api/';
    // store the current authenticated user
    currentUser;

    /**
     * constructor
     * @param http the HTTPClient service
     */
    constructor(
        private http: HttpClient
    ) { }

    /**
     * helper to get an api url by its path
     */
    api_url(path) {
        return `${this.api_root}${path}/`;
    }

    /**
     * helper to construct the HTTP GET request
     * @param path the url path relative to the api endpoint
     * @param options optional http get url parts, such as query params
     * @return http.get() observable
     */
    get(path, options = {}) {
        const url = this.api_url(path);
        return this.http.get(url, options);
    }

    /**
     * get a task info by its id
     * @param pk the task id
     * @return http.get() observable
     */
    getTask(pk) {
        return this.get(`tasks/${pk}`);
    }

    /**
     * get list of tasks available
     * @param params filter options for task list
     * @return http.get() observable
     */
    getTasks(params) {
        return this.get('tasks', {params});
    }

    /**
     * get list of available users
     * @return http.get() observable
     */
    getUsers() {
        return this.get('users');
    }

    /**
     * login to the api site
     * @param creds the user credentials to login with
     * @return http.post() observable
     */
    login(creds) {
        const url = this.api_url('login');
        return this.http.post(url, creds);
    }

    /**
     * logout from the API
     * @return http.post() observable
     */
    logout() {
        const url = this.api_url('logout');
        return this.http.post(url, {}).pipe(
            tap(() => this.currentUser = {})
        );
    }

    /**
     * create a new task with given data
     * @param data task definition
     * @return http.post() observable
     */
    createTask(data) {
        const url = this.api_url('tasks');
        return this.http.post(url, data);
    }

    /**
     * update the given task with given data
     * @param data task definition
     * @return http.post() observable
     */
    updateTask(data) {
        const url = this.api_url(`tasks/${data.pk}`);
        return this.http.put(url, data);
    }

    /**
     * mark the given task done
     * @param data task definition
     * @return http.post() observable
     */
    markDone(task) {
        const url = this.api_url(`tasks/${task.pk}/mark_done`);
        return this.http.post(url, {status: true});
    }

    /**
     * delete the given task
     * @param data task definition
     * @return http.delete() observable
     */
    deleteTask(task) {
        const url = this.api_url(`tasks/${task.pk}`);
        return this.http.delete(url);
    }

    /**
     * get the current user info
     * @return http.get() observable
     */
    whoami() {
        return this.get('whoami').pipe(
            tap(user => {
                this.currentUser = user;
            })
        );
    }
}
