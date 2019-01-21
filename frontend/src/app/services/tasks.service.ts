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

    getTasks() {
        return this.get('tasks');
    }

    getUsers() {
        return this.get('users');
    }

    login(creds) {
        const url = this.api_url('login');
        return this.http.post(url, creds);
    }

    createTask(data) {
        const url = this.api_url('tasks');
        return this.http.post(url, data);
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
