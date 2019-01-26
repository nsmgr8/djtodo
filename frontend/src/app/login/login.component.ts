import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToasterService } from 'angular2-toaster';

import { TasksService } from '../services/tasks.service';

/**
 * Component for login page
 */
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

    /**
     * reference to username input element
     */
    @ViewChild('usernameInput') usernameInput;

    /*
     * Component constructor
     * @param tasksService the api service for the tasks
     * @param router angular router service
     * @param route current active route service
     * @param toaster notification balloon service
     */
    constructor(
        private tasksService: TasksService,
        private router: Router,
        private route: ActivatedRoute,
        private toaster: ToasterService
    ) { }

    /**
     * component initialisation hook
     */
    ngOnInit() {
        // store the redirect url after login
        this.route.params.subscribe(
            params => this.returnUrl = params.returnUrl || '/'
        );
    }

    /**
     * component ready hook
     */
    ngAfterViewInit() {
        // focus the username input
        this.usernameInput.nativeElement.focus();
    }

    /*
     * start login process
     */
    login() {
        this.tasksService.login(this.model)
            .subscribe(
                data => this.setUser(data),
                error => this.onError('Could not login, please use correct username and password')
            );
    }

    /**
     * set the authenticated user and redirect to desired page
     */
    setUser(user) {
        this.tasksService.currentUser = user;
        this.router.navigate([this.returnUrl]);
    }

    /**
     * notify user in case of error
     */
    onError(body) {
        this.toaster.pop({type: 'error', title: 'ERROR', body});
    }
}
