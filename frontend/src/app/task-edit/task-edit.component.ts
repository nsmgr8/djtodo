import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToasterService } from 'angular2-toaster';

import { TasksService } from '../services/tasks.service';

@Component({
    selector: 'app-task-edit',
    templateUrl: './task-edit.component.html',
    styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit, AfterViewInit {
    pk;
    model: any = {
        name: '',
        description: '',
    };

    showForm = false;

    @ViewChild('nameInput') nameInput;

    constructor(
        private tasksService: TasksService,
        private router: Router,
        private route: ActivatedRoute,
        private toaster: ToasterService
    ) { }

    ngOnInit() {
        this.showForm = false;
        this.route.params.subscribe(
            ({pk}: any) => {
                this.pk = pk;
                if (pk) {
                    this.tasksService.getTask(pk)
                        .subscribe(
                            task => this.setTask(task),
                            () => this.onError('Could not get task')
                        );
                } else {
                    this.showForm = true;
                }
            }
        );
    }

    ngAfterViewInit() {
        this.nameInput.nativeElement.focus();
    }

    setTask(task) {
        if (task.created_by !== this.tasksService.currentUser.pk) {
            return this.router.navigate(['/task', task.pk]);
        }
        this.model = task;
        this.showForm = true;
    }

    edit() {
        let service;
        if (this.pk) {
            service = this.tasksService.updateTask(this.model);
        } else {
            service = this.tasksService.createTask(this.model);
        }
        service.subscribe(
            data => this.success(data),
            error => this.onError('Could not save task')
        );
    }

    success(data) {
        this.router.navigate(['/tasks']);
        this.toaster.pop({type: 'success', title: 'Task saved'});
    }

    onError(body) {
        this.toaster.pop({type: 'error', title: 'ERROR', body});
    }
}

