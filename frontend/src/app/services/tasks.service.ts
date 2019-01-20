import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    api_root = environment.production ? '/api/' : '//localhost:8000/api/';

    constructor(
        private http: HttpClient
    ) { }

    get(path, options = {}) {
        return this.http.get(`${this.api_root}${path}/`, options);
    }

    getTasks() {
        return this.get('tasks');
    }
}
