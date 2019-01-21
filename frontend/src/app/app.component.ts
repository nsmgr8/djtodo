import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { TasksService } from './services/tasks.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        public tasksService: TasksService,
        private router: Router
    ) {
        this.tasksService.whoami().subscribe();
    }

    logout() {
        this.tasksService.logout().subscribe(
            () => this.router.navigate(['/login'])
        );
    }
}
