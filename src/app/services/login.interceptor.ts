import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core"
import { Observable, of } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
    constructor(public toasterService: ToastrService,
        private router: Router) { }
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(

            catchError((err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        document.cookie = 'JSESSIONID=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        sessionStorage.removeItem('sesId');
                        sessionStorage.removeItem('authDetail');
                        this.router.navigate(['login']);
                    }
                }
                // return throwError("Error occurred.");
                throw new Error(err.status);
            })
        );

    }

}