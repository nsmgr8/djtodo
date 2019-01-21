import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AuthInterceptor } from './services/auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { LoginComponent } from './login/login.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';

@NgModule({
    declarations: [
        AppComponent,
        TaskListComponent,
        TaskEditComponent,
        LoginComponent,
        TaskDetailComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientXsrfModule.withOptions({
            cookieName: 'csrftoken',
            headerName: 'X-CSRFToken',
        }),
        FormsModule,

        CollapseModule.forRoot(),

        AppRoutingModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
