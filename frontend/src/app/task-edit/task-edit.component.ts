import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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

    @ViewChild('nameInput') nameInput;

    constructor(
        private tasksService: TasksService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.params.subscribe(
            ({pk}: any) => {
                this.pk = pk;
                if (pk) {
                    this.tasksService.getTask(pk)
                        .subscribe(
                            task => this.setTask(task)
                        );
                }
            }
        );
    }

    ngAfterViewInit() {
        this.nameInput.nativeElement.focus();
    }

    setTask(task) {
        if (task.pk !== this.tasksService.currentUser.pk) {
            return this.router.navigate(['/task', task.pk]);
        }
        this.model = task;
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
            error => this.setError(error)
        );
    }

    success(data) {
        this.router.navigate(['/tasks']);
    }

    setError(error) {
        console.log(error);
    }
}
