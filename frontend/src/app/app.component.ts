/**
 * main app component
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToasterConfig } from 'angular2-toaster';

import { TasksService } from './services/tasks.service';

/**
 * the main component for the app
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    /**
     * global configuration for the notification balloon
     */
    toasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-center',
        limit: 3,
    });

    /**
     * constructor
     * @param tasksService tasks api service
     * @param router navigation service
     */
    constructor(
        public tasksService: TasksService,
        private router: Router
    ) {
        this.tasksService.whoami().subscribe();
    }

    /**
     * logout the current user
     */
    logout() {
        this.tasksService.logout().subscribe(
            () => this.router.navigate(['/login'])
        );
    }
}
