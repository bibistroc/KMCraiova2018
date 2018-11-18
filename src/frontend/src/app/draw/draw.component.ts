import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Observable, Subscription, fromEvent, merge, timer } from 'rxjs';
import { UserService } from '../user/user.service';
import { SignalRService } from '../signalr/signalr.service';

class DrawPoint {
  constructor(
    public x: number,
    public y: number,
    public prevX: number,
    public prevY: number) {}
}

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements AfterViewInit, OnDestroy {
  @ViewChild('drawCanvas')
  private drawCanvas: ElementRef;
  private context: CanvasRenderingContext2D;
  private canvasRectX: number;
  private canvasRectY: number;
  private paint: Boolean;
  private prevX: number;
  private prevY: number;
  private currentLine: Array<DrawPoint> = new Array<DrawPoint>();
  private drawStartEventsSubscription: Subscription;
  private drawMoveEventsSubscription: Subscription;
  private drawStopEventsSubscription: Subscription;
  private currentUser: string;

  constructor(private userService: UserService, private signalRService: SignalRService) {
    this.currentUser = userService.getUser();
  }

  ngAfterViewInit() {
    this.initCanvasConstants();

    this.initDrawingEvents();

    this.signalRService.lines.subscribe((message: string) => {
      const data = JSON.parse(message);
      if (data.author.name !== this.currentUser) {
        for (let i = 0; i < data.data.length; i++) {
          this.draw(data.data[i], data.author.colour);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.drawStartEventsSubscription) {
      this.drawStartEventsSubscription.unsubscribe();
    }
    if (this.drawMoveEventsSubscription) {
      this.drawMoveEventsSubscription.unsubscribe();
    }
    if (this.drawStopEventsSubscription) {
      this.drawStopEventsSubscription.unsubscribe();
    }
  }

  private initCanvasConstants(): void {
    this.prevX = -1;
    this.prevY = -1;
    const width = this.drawCanvas.nativeElement.scrollWidth;
    const height = this.drawCanvas.nativeElement.scrollHeight;
    this.drawCanvas.nativeElement.setAttribute('width', width);
    this.drawCanvas.nativeElement.setAttribute('height', height);

    const drawCanvasRect = this.drawCanvas.nativeElement.getBoundingClientRect();
    this.canvasRectX = drawCanvasRect.x;
    this.canvasRectY = drawCanvasRect.y;

    this.context = this.drawCanvas.nativeElement.getContext('2d');

    const color = this.userService.getColour();
    this.context.strokeStyle = color;
    this.context.lineJoin = 'round';
    this.context.lineWidth = 5;
  }

  private initDrawingEvents(): void {
    const drawStart = [
      'mousedown',
      'touchstart'
    ];
    const drawStartStreams = drawStart.map((event) => {
      return fromEvent(this.drawCanvas.nativeElement, event);
    });
    const drawStartEvents = merge(...drawStartStreams);

    this.drawStartEventsSubscription = drawStartEvents.subscribe((e: Event) => {
      this.currentLine = new Array<DrawPoint>();
      let curX, curY;
      [curX, curY] = this.getCoords(e);
      this.paint = true;
      const drawPoint = new DrawPoint(curX, curY, -1, -1);
      this.draw(drawPoint);
      this.prevX = curX;
      this.prevY = curY;
    });

    const drawMove = [
      'mousemove',
      'touchmove'
    ];
    const drawMoveStreams = drawMove.map((event) => {
      return fromEvent(this.drawCanvas.nativeElement, event);
    });
    const drawMoveEvents = merge(...drawMoveStreams);

    this.drawMoveEventsSubscription = drawMoveEvents.subscribe((e: Event) => {
      if (this.paint) {
        let curX, curY;
        [curX, curY] = this.getCoords(e);
        const drawPoint = new DrawPoint(curX, curY, this.prevX, this.prevY);
        this.currentLine.push(drawPoint);
        this.draw(drawPoint);
        this.prevX = curX;
        this.prevY = curY;
      }
    });

    const drawStop = [
      'mouseup',
      'mouseleave',
      'touchend'
    ];

    const drawStopStreams = drawStop.map((event) => {
      return fromEvent(this.drawCanvas.nativeElement, event);
    });
    const drawStopEvents = merge(...drawStopStreams);

    this.drawStopEventsSubscription = drawStopEvents.subscribe((e: Event) => {
      this.paint = false;
      this.prevX = -1;
      this.prevY = -1;
      if (this.currentLine.length > 0) {
        this.broadcastDraw(this.currentLine);
        this.currentLine = new Array<DrawPoint>();
      }
    });
  }

  private broadcastDraw(currentDrawSerialized: any): any {
    const author = {
      'name': this.userService.getUser(),
      'colour': this.userService.getColour()
    };
    this.signalRService.sendLine(author, currentDrawSerialized);
  }

  private getCoords(e: Event): [number, number] {
    let mouseX = 0;
    let mouseY = 0;
    if (e.type.startsWith('mouse')) {
      const ev = (e as MouseEvent);
      mouseX = ev.pageX - this.canvasRectX;
      mouseY = ev.pageY - this.canvasRectY;
    } else if (e.type.startsWith('touch')) {
      const ev = (e as TouchEvent);
      if (ev.touches && ev.touches.length > 0) {
        mouseX = ev.touches[0].pageX - this.canvasRectX;
        mouseY = ev.touches[0].pageY - this.canvasRectY;
      }
    }
    return [mouseX, mouseY];
  }

  private draw(drawPoint: DrawPoint, color?: string): void {
    if (color) {
      this.context.strokeStyle = color;
    }
    this.context.beginPath();
    if (drawPoint.prevX > -1 && drawPoint.prevY > -1) {
      this.context.moveTo(drawPoint.prevX, drawPoint.prevY);
    } else {
      this.context.moveTo(drawPoint.x - 1, drawPoint.y);
    }
    this.context.lineTo(drawPoint.x, drawPoint.y);
    this.context.closePath();
    this.context.stroke();
    if (color) {
      this.context.strokeStyle = this.userService.getColour();
    }
  }
}
