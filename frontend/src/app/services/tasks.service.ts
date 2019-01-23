import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    api_root = environment.production ? '/api/' : '//localhost:8000/api/';
    currentUser;

    constructor(
        private http: HttpClient
    ) { }

    api_url(path) {
        return `${this.api_root}${path}/`;
    }

    get(path, options = {}) {
        const url = this.api_url(path);
        return this.http.get(url, options);
    }

    getTask(pk) {
        return this.get(`tasks/${pk}`);
    }

    getTasks(params) {
        return this.get('tasks', {params});
    }

    getUsers() {
        return this.get('users');
    }

    login(creds) {
        const url = this.api_url('login');
        return this.http.post(url, creds);
    }

    logout() {
        const url = this.api_url('logout');
        return this.http.post(url, {}).pipe(
            tap(() => this.currentUser = {})
        );
    }

    createTask(data) {
        const url = this.api_url('tasks');
        return this.http.post(url, data);
    }

    updateTask(data) {
        const url = this.api_url(`tasks/${data.pk}`);
        return this.http.put(url, data);
    }

    markDone(task) {
        const url = this.api_url(`tasks/${task.pk}/mark_done`);
        return this.http.post(url, {status: true});
    }

    deleteTask(task) {
        const url = this.api_url(`tasks/${task.pk}`);
        return this.http.delete(url);
    }

    whoami() {
        return this.get('whoami').pipe(
            tap(user => {
                this.currentUser = user;
            })
        );
    }
}
