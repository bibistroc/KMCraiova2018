import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chatervice } from './chat.service';
import { ChatMessageView } from './chat-message.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
    public messages: Array<ChatMessageView> = new Array<ChatMessageView>();

    private readonly chatervice: Chatervice;
    private newMessagesSubscription: Subscription;

    constructor(chatervice: Chatervice) {
        this.chatervice = chatervice;
    }

    ngOnInit() {
        this.messages = this.chatervice.messages.map(e => e as ChatMessageView);
        this.newMessagesSubscription = this.chatervice.newMessages.subscribe((newMessage: ChatMessageView) => {
            this.messages.push(newMessage);
        });
    }

    ngOnDestroy() {
        if (this.newMessagesSubscription) {
            this.newMessagesSubscription.unsubscribe();
        }
    }

    public sendMessage(message: string): boolean {
        this.chatervice.send(message).subscribe();
        return false;
    }
}
