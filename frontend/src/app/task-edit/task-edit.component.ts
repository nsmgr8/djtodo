import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { TasksService } from '../services/tasks.service';

@Component({
    selector: 'app-task-edit',
    templateUrl: './task-edit.component.html',
    styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit, AfterViewInit {
    model = {
        name: '',
        description: '',
    };

    @ViewChild('nameInput') nameInput;

    constructor(
        private tasksService: TasksService,
        private router: Router
    ) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.nameInput.nativeElement.focus();
    }

    create() {
        this.tasksService.createTask(this.model)
            .subscribe(
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

