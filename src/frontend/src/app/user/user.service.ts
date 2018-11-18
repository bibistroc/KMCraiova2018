import { Injectable } from '@angular/core';

declare var Chance: any;

@Injectable()
export class UserService {
    private name: string;
    private colour: string;

    public init(): Promise<any> {
        return new Promise((resolve, reject) => {
            const ch = new Chance();
            const name = ch.name({ nationality: 'en' }).replace(' ', '');
            const colour = this.getColourFromName(name);
            this.name = name;
            this.colour = colour;
            resolve();
        });
    }

    public getUser(): string {
        return this.name;
    }

    public getColour(): string {
        return this.colour;
    }

    private getColourFromName(name: string): string {
        // tslint:disable:no-bitwise
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        let colour = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
        // tslint:enable:no-bitwise
    }
}
