import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { tap, switchMap } from 'rxjs/operators';
import { ToasterService } from 'angular2-toaster';

import { TasksService } from '../services/tasks.service';

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

    constructor(
        private tasksService: TasksService,
        private route: ActivatedRoute,
        private router: Router,
        private toaster: ToasterService
    ) { }

    ngOnInit() {
        this.tasksService.whoami().subscribe();
        this.route.params.subscribe(params => this.getTasks(params));
    }

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

    setUsers(data) {
        const users = {};
        data.forEach(x => {
            users[x.pk] = x;
        });
        this.users = users;
    }

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

    onError(body) {
        this.toaster.pop({type: 'error', title: 'ERROR', body});
    }

    markDone(task) {
        this.tasksService.markDone(task).subscribe(
            data => this.update(data),
            error => this.onError('Could not mark "Done"')
        );
    }

    update(task) {
        this.tasks = this.tasks.map(x => {
            return x.pk === task.pk ? task : x;
        });
    }

    reload(params) {
        this.router.navigate(['.', params]);
    }

    page(direction) {
        this.reload({
            ...this.current_params,
            page: this.pager.current + direction,
        });
    }

    filterByStatus() {
        if (this.status !== '') {
            this.reload({status: this.status});
        } else {
            this.reload({});
        }
    }
}
