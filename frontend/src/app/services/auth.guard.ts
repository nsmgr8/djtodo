import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Router } from '@angular/router';


import { of, Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { TasksService } from './tasks.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private tasksService: TasksService
    ) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.tasksService.get('is_authenticated').pipe(
            switchMap(user => of(true)),
            catchError(() => of(false))
        );
    }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private router: Router
    ) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const modified = req.clone({withCredentials: !environment.production});
        return next.handle(modified)
            .pipe(
                catchError(resp => {
                    if (resp.status === 401) {
                        this.router.navigate(['/login']);
                    }
                    return throwError(resp);
                })
            );
    }
}
