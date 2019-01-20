import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './services/auth.guard';
import { LoginComponent } from './login/login.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskCreateComponent } from './task-create/task-create.component';

const routes: Routes = [
    {path: '', redirectTo: '/tasks', pathMatch: 'full'},
    {path: 'tasks', component: TaskListComponent},
    {path: 'create', component: TaskCreateComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
