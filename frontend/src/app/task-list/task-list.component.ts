import { Component, OnInit } from '@angular/core';

import { TasksService } from '../services/tasks.service';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

    constructor(
        private tasksService: TasksService
    ) { }

    ngOnInit() {
        this.getTasks();
    }

    getTasks() {
        this.tasksService.getTasks()
            .subscribe(
                data => this.setTasks(data),
                error => this.onError(error)
            );
    }

    setTasks(data) {
        console.log(data);
    }

    onError(error) {
        console.log(error);
    }
}
