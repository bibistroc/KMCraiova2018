import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { Observable, Subject } from 'rxjs';
import { SignalRConnectionInfo } from './signalr-connection-info.model';
import { map } from 'rxjs/operators';
import { ChatMessageView } from '../chat/chat-message.model';
import { environment } from '../../environments/environment';

@Injectable()
export class SignalRService {
    public lines: Subject<string> = new Subject();
    public chatMessages: Subject<ChatMessageView> = new Subject<ChatMessageView>();
    private readonly http: HttpClient;
    private readonly baseUrl: string =  environment.baseUrl;
    private hubConnection: HubConnection;

    constructor(http: HttpClient) {
        this.http = http;
    }

    public init() {
        this.getConnectionInfo().subscribe(info => {
            const options = {
                accessTokenFactory: () => info.accessToken
            };

            this.hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(info.url, options)
                .configureLogging(signalR.LogLevel.Information)
                .build();

            this.hubConnection.start().catch(err => console.error(err.toString()));

            this.hubConnection.on('draw', (data: any) => {
                this.lines.next(data);
            });

            this.hubConnection.on('chatMessage', (data: any) => {
                const chatMessage = new ChatMessageView();
                chatMessage.author = data.Author;
                chatMessage.colour = data.Colour;
                chatMessage.message = data.Message;

                this.chatMessages.next(chatMessage);
            });
        });
    }

    public sendLine(author: any, data: any): void {
        const requestUrl = `${this.baseUrl}draw`;
        if (this.hubConnection) {
            const message = {
                'author': author,
                'data': data
            };
            this.http.post(requestUrl, message).pipe(map((result: any) => { })).subscribe();
        }
    }

    private getConnectionInfo(): Observable<SignalRConnectionInfo> {
        const requestUrl = `${this.baseUrl}negotiate`;
        return this.http.get<SignalRConnectionInfo>(requestUrl);
    }
}
