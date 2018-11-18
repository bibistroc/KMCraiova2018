import {Component} from '@angular/core';
import { EmailService } from './email.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent {
    public emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
    ]);

    private readonly emailService: EmailService;

    constructor(emailService: EmailService) {
        this.emailService = emailService;
    }

    public saveEmail(): void {
        if (this.emailFormControl.valid) {
            const mailAddress = this.emailFormControl.value;
            this.emailService.saveEmail(mailAddress).then(() => {
                this.emailFormControl.reset();
                alert('Your email address has been saved. Thank you for your interest.');
            });
        }
    }
}
