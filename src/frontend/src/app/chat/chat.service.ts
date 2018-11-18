import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';
import { ChatMessageView } from './chat-message.model';
import { Observable, Subject } from 'rxjs';
import { SignalRService } from '../signalr/signalr.service';
import { environment } from '../../environments/environment';

@Injectable()
export class Chatervice {
    public messages: Array<ChatMessageView> = new Array<ChatMessageView>();
    public newMessages: Subject<ChatMessageView> = new Subject<ChatMessageView>();

    private readonly baseUrl: string = environment.baseUrl;
    private readonly http: HttpClient;
    private readonly userService: UserService;

    constructor(http: HttpClient, userService: UserService, signalRService: SignalRService) {
        this.http = http;
        this.userService = userService;

        signalRService.chatMessages.subscribe((response: ChatMessageView) => {
            const chatMessageView: ChatMessageView = response as ChatMessageView;
            if (response.author === this.userService.getUser()) {
                chatMessageView.isMe = true;
            }
            this.newMessages.next(chatMessageView);
            this.messages.push(chatMessageView);
        });
    }

    public getHistory(): Promise<any> {
        return new Promise((resolve, reject) => {
            const url = `${this.baseUrl}chatHistory`;
            this.http.get<Array<ChatMessageView>>(url).subscribe((data) => {
                this.messages = data;
                resolve();
            });
        });
    }

    public send(message: string): Observable<any> {
        const chatMessage = new ChatMessageView();
        chatMessage.author = this.userService.getUser();
        chatMessage.colour = this.userService.getColour();
        chatMessage.message = message;

        const url = `${this.baseUrl}chat`;
        return this.http.post<ChatMessageView>(url, chatMessage);
    }
}
