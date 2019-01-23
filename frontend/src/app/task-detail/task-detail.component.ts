import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap, tap } from 'rxjs/operators';
import { ToasterService } from 'angular2-toaster';

import { TasksService } from '../services/tasks.service';

@Component({
    selector: 'app-task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
    task;
    users = {};
    current_user = {};

    constructor(
        private tasksService: TasksService,
        private route: ActivatedRoute,
        private router: Router,
        private toaster: ToasterService
    ) { }

    ngOnInit() {
        this.tasksService.whoami()
            .subscribe(user => this.current_user = user);
        this.route.params.pipe(
            switchMap(params => this.getTask(params)),
            tap(data => this.setTask(data)),
            switchMap(() => this.tasksService.getUsers())
        ).subscribe(
            data => this.setUsers(data),
            () => this.onError('Could not get the Task')
        );
    }

    getTask({pk}: any) {
        return this.tasksService.getTask(pk);
    }

    setTask(data) {
        this.task = data;
    }

    setUsers(data) {
        const users = {};
        data.forEach(x => {
            users[x.pk] = x;
        });
        this.users = users;
    }

    markDone() {
        this.tasksService.markDone(this.task).subscribe(
            data => this.update(data),
            () => this.onError('Could not mark "Done"')
        );
    }

    update(task) {
        this.task = task;
    }

    deleteTask() {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasksService.deleteTask(this.task)
                .subscribe(
                    () => {
                        this.router.navigate(['/tasks']);
                        this.toaster.pop('success', 'Task deleted');
                    },
                    () => this.onError('Counld not delete the task')
                );
        }
    }

    onError(body) {
        this.toaster.pop({type: 'error', title: 'ERROR', body});
    }
}
