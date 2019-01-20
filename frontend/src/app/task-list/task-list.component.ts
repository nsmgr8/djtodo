import { Component, OnInit } from '@angular/core';

import { tap, switchMap } from 'rxjs/operators';

import { TasksService } from '../services/tasks.service';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
    tasks = [];
    users;

    constructor(
        private tasksService: TasksService
    ) { }

    ngOnInit() {
        this.getTasks();
    }

    getTasks() {
        this.tasksService.getUsers().pipe(
            tap(data => this.setUsers(data)),
            switchMap(() => this.tasksService.getTasks())
        ).subscribe(
            data => this.setTasks(data),
            error => this.onError(error)
        );
    }

    setUsers(data) {
        const users = {};
        data.forEach(x => {
            users[x.pk] = x;
        });
        this.users = users;
    }

    setTasks(data) {
        this.tasks = data;
    }

    onError(error) {
        console.log(error);
    }
}
