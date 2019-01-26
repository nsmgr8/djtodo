/**
 * Authenticaton related service, interceptor etc.
 */

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
import { switchMap, catchError, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { TasksService } from './tasks.service';

/**
 * navigation guard for authenticated access
 */
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    /** constructor
     * @param tasksService the API service for tasks
     */
    constructor(
        private tasksService: TasksService
    ) {}

    /**
     * check whether user is logged in
     * @param next snapshot of the activated route holding next navigation info
     * @param state current route snapshot
     * @return Observable with true if authenticated false otherwise
     */
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.tasksService.get('is_authenticated').pipe(
            tap(user => this.tasksService.currentUser = user),
            switchMap(user => of(true)),
            catchError(() => of(false))
        );
    }
}

/**
 * HTTP interceptor for redirecting to login page when authentication is
 * required
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    /**
     * constructor
     * @param router the router service for navigation
     */
    constructor(
        private router: Router
    ) {}

    /**
     * Intercept the HTTP request for checking the status
     * When response is 401 (auth required, redirect to login page
     * @param req the current http request
     * @param next the handler for the request
     * @return httpevent observable with login page redirector installed
     */
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // get the request, make sure to send creds as development is
        // cross-origin
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
