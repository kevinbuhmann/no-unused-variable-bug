# no-unused-variable-bug

> no-unused-variable interferes with other rules
[palantir/tslint/issues/3455](https://github.com/palantir/tslint/issues/3455)

### Bug Report

- __TSLint version__: 5.8.0
- __TypeScript version__: 2.6.1
- __Running TSLint via__: CLI

#### TypeScript code being linted

```ts
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

  obs2 = Observable.of(undefined).do(() => this.subject.next()); // error
  obs3 = Observable.of(undefined).do(() => this.event.next()); // no error, but should be

  obs4 = Observable.of(undefined).do(this.subject.next); // error
  obs5 = Observable.of(undefined).do(this.event.next); // no error, but should be
}

function returnsVoid() { }

```

with `tslint.json` configuration:

```json
{
  "rules": {
    "no-unused-variable": [
      true,
      "check-parameters", {
        "ignore-pattern": "^_"
      }
    ],
    "no-unbound-method": true,
    "no-void-expression": true
  }
}
```

#### Actual behavior
When the `no-unused-variable` variable is enabled, the `no-void-expression` rule does not report an
error on line 15 and the `no-unbound-method` rule does not report an error on line 18. But if you
disable the `no-unused-variable` rule, the `no-void-expression` and `no-unbound-method` rules
correctly reports all of the noted errors.

#### Expected behavior
The `no-unused-variable` rule should not interfere with other rules.
