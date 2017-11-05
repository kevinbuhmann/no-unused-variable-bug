import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

export const f1 = () => returnsVoid(); // error
export const obs1 = Observable.of(undefined).do(() => returnsVoid()); // error

export class Component {
  subject = new Subject<void>();
  event = new EventEmitter<void>();

  obs3 = Observable.of(undefined).do(() => this.subject.next()); // error
  obs2 = Observable.of(undefined).do(() => this.event.next()); // no error, but should be
}

function returnsVoid() { }
