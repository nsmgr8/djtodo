import { Component, OnInit } from '@angular/core';

import { TasksService } from '../services/tasks.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    model = {
        username: '',
        password: '',
    };

    constructor(
        private tasksService: TasksService
    ) { }

    ngOnInit() {
    }

    login() {
        this.tasksService.login(this.model)
            .subscribe(
                data => this.setUser(data),
                error => this.setError(error)
            );
    }

    setUser(data) {
        console.log(data);
    }

    setError(error) {
        console.log(error);
    }
}
