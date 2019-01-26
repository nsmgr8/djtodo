/**
 * task edit page
 */
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToasterService } from 'angular2-toaster';

import { TasksService } from '../services/tasks.service';

/**
 * component for task editing and creating
 */
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

    /**
     * constructor
     * @param tasksService tasks api service
     * @param router route navigation service
     * @param route activated route service
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

    /**
     * component ready hook
     */
    ngAfterViewInit() {
        this.nameInput.nativeElement.focus();
    }

    /**
     * set the task to edit
     * @param task the task information
     */
    setTask(task) {
        if (task.created_by !== this.tasksService.currentUser.pk) {
            return this.router.navigate(['/task', task.pk]);
        }
        this.model = task;
        this.showForm = true;
    }

    /**
     * send the edit/create request to the backend
     */
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

    /**
     * action after successful edit/create
     * @param data updated task data
     */
    success(data) {
        this.router.navigate(['/tasks']);
        this.toaster.pop({type: 'success', title: 'Task saved'});
    }

    /**
     * show error message
     * @param body error message
     */
    onError(body) {
        this.toaster.pop({type: 'error', title: 'ERROR', body});
    }
}

