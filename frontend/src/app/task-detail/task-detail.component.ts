/**
 * task detail page
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { switchMap, tap } from 'rxjs/operators';
import { ToasterService } from 'angular2-toaster';

import { TasksService } from '../services/tasks.service';

/**
 * componet defining the task detail page
 */
@Component({
    selector: 'app-task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
    task;
    users = {};
    current_user = {};

    /**
     * constructor
     * @param tasksService tasks API service
     * @param route activated route service
     * @param router Router service for navigation
     * @param toaster notification balloon service
     */
    constructor(
        private tasksService: TasksService,
        private route: ActivatedRoute,
        private router: Router,
        private toaster: ToasterService
    ) { }

    /**
     * component initialisation hook
     */
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

    /**
     * get the current task from api
     * @param pk the id of the task
     */
    getTask({pk}: any) {
        return this.tasksService.getTask(pk);
    }

    /**
     * set the task info
     * @param data the task information from backend
     */
    setTask(data) {
        this.task = data;
    }

    /**
     * set the list of users
     * @param data the user list data from backend
     */
    setUsers(data) {
        const users = {};
        data.forEach(x => {
            users[x.pk] = x;
        });
        this.users = users;
    }

    /**
     * send the mark done request to the API
     */
    markDone() {
        this.tasksService.markDone(this.task).subscribe(
            data => this.update(data),
            () => this.onError('Could not mark "Done"')
        );
    }

    /**
     * update the current task with updated information
     * @param task updated task data
     */
    update(task) {
        this.task = task;
    }

    /**
     * send the delete request to the api
     */
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

    /**
     * show error message
     * @param body error message
     */
    onError(body) {
        this.toaster.pop({type: 'error', title: 'ERROR', body});
    }
}
