import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { TasksService } from '../services/tasks.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
    model = {
        username: '',
        password: '',
    };
    returnUrl = '/';

    @ViewChild('usernameInput') usernameInput;

    constructor(
        private tasksService: TasksService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe(
            params => this.returnUrl = params.returnUrl || '/'
        );
    }

    ngAfterViewInit() {
        this.usernameInput.nativeElement.focus();
    }

    login() {
        this.tasksService.login(this.model)
            .subscribe(
                data => this.setUser(data),
                error => this.setError(error)
            );
    }

    setUser(user) {
        this.tasksService.currentUser = user;
        this.router.navigate([this.returnUrl]);
    }

    setError(error) {
        console.log(error);
    }
}
