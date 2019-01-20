import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AuthInterceptor } from './services/auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { LoginComponent } from './login/login.component';

@NgModule({
    declarations: [
        AppComponent,
        TaskListComponent,
        TaskCreateComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
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
