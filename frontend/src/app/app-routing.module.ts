import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './login/login.component';
import { NoContentComponent } from './no-content/no-content.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';

const routes: Routes = [
    {path: '', redirectTo: '/tasks', pathMatch: 'full'},
    {path: 'tasks', component: TaskListComponent, canActivate: [AuthGuard]},
    {path: 'create', component: TaskEditComponent, canActivate: [AuthGuard]},
    {path: 'edit/:pk', component: TaskEditComponent, canActivate: [AuthGuard]},
    {path: 'task/:pk', component: TaskDetailComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: '**', component: NoContentComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
