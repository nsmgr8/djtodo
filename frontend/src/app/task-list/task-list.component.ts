/**
 * task listing page
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { tap, switchMap } from 'rxjs/operators';
import { ToasterService } from 'angular2-toaster';

import { TasksService } from '../services/tasks.service';

/**
 * comonent for listing tasks
 */
@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
    tasks = [];
    users;
    current_params;
    pager;
    status = 'undone';

    /**
     * constructor
     * @param tasksService task api service
     * @param route activated route service
     * @param router route navigation service
     * @param toaster notification balloon service
     */
    constructor(
        private tasksService: TasksService,
        private route: ActivatedRoute,
        private router: Router,
        private toaster: ToasterService
    ) { }

    /**
     * Component initialisation hook
     */
    ngOnInit() {
        this.tasksService.whoami().subscribe();
        this.route.params.subscribe(params => this.getTasks(params));
    }

    /**
     * request the task list from backend
     * @param params the route params, can be used to filter the tasks
     */
    getTasks(params) {
        this.current_params = params;
        this.status = params.status || 'undone';

        this.tasksService.getUsers().pipe(
            tap(data => this.setUsers(data)),
            switchMap(() => this.tasksService.getTasks(params))
        ).subscribe(
            data => this.setTasks(data),
            error => this.onError('Could not get tasks')
        );
    }

    /**
     * set the list of users
     * @param data list of users
     */
    setUsers(data) {
        const users = {};
        data.forEach(x => {
            users[x.pk] = x;
        });
        this.users = users;
    }

    /**
     * set the task list
     * @param data a list tasks from api
     */
    setTasks(data) {
        this.tasks = data.results;
        const current = +(this.current_params.page || 1);
        const pager: any = {
            current,
            count: data.count,
            next: data.next && +(data.next.replace(/^.*?page=/, '').split('&')[0]),
            previous: current - 1,
        };
        this.pager = pager;
    }

    /**
     * show error message
     * @param body error message
     */
    onError(body) {
        this.toaster.pop({type: 'error', title: 'ERROR', body});
    }

    /**
     * request marking done for a given task
     * @param task the task to mark done
     */
    markDone(task) {
        this.tasksService.markDone(task).subscribe(
            data => this.update(data),
            error => this.onError('Could not mark "Done"')
        );
    }

    /**
     * update the given task with new data
     * @param task the task with new data to update
     */
    update(task) {
        this.tasks = this.tasks.map(x => {
            return x.pk === task.pk ? task : x;
        });
    }

    /**
     * reload the listing with new params/filters
     * @param params the route params such as status filter, pagination, etc.
     */
    reload(params) {
        this.router.navigate(['.', params]);
    }

    /**
     * paginate the list
     * @param direction the direction of the page
     *      +ve to page forward, -ve to page backward
     */
    page(direction) {
        this.reload({
            ...this.current_params,
            page: this.pager.current + direction,
        });
    }

    /**
     * filter the list by currently selected status value
     */
    filterByStatus() {
        if (this.status !== '') {
            this.reload({status: this.status});
        } else {
            this.reload({});
        }
    }
}
