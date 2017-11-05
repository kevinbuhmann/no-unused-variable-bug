# no-void-expression-bug

> no-void-expression misses errors when no-unused-variable is listed first
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

  obs3 = Observable.of(undefined).do(() => this.subject.next()); // error
  obs2 = Observable.of(undefined).do(() => this.event.next()); // no error, but should be
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
    "no-void-expression": true
  }
}
```

#### Actual behavior
The `no-void-expression` rule does not report an error on line 15 when the `no-unused-variable`
variable is enabled. But if you disable the `no-unused-variable` rule or move it after the
`no-void-expression` rule, the `no-void-expression` rule correctly reports all four errors.

#### Expected behavior
The `no-void-expression` rule should report an error on four of the noted lines regardless of which
other rules are enabled or the order the rules.

### Commentary
This is odd because the angular `EventEmitter` extends the rxjs `Subject`, so the two expressions
should be evaluated as exactly the same type.

If I were to guess the cause of this behavior, I would say that `no-unused-variable` the rule seems
to be mutating the TypeScript AST or some other shared state somehow.