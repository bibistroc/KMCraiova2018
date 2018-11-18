import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

class EmailAddress {
    constructor(
        public address: string
    ) {}
}

@Injectable()
export class EmailService {
    private readonly baseUrl: string = environment.baseUrl;
    private readonly http: HttpClient;

    constructor(http: HttpClient) {
        this.http = http;
    }

    public saveEmail(emailAddress: string): Promise<any> {
        const email = new EmailAddress(emailAddress);

        const url = `${this.baseUrl}email`;
        return this.http.post<EmailAddress>(url, email).toPromise();
    }
}
