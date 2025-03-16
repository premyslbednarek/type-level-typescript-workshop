/* eslint-disable */

import { Equal, Expect, Tuple } from "../helpers";

/**
 * 1. Implement a Reverse type that takes a tuple and reverses it.
 */
namespace one {
  type Reverse<tuple extends any[]> = tuple extends [infer First, ...infer Rest] ? [...Reverse<Rest>, First] : [];

  type res1 = Reverse<[1, 2, 3, 4]>;
  type test1 = Expect<Equal<res1, [4, 3, 2, 1]>>;

  type res2 = Reverse<[1, 2]>;
  type test2 = Expect<Equal<res2, [2, 1]>>;

  type res3 = Reverse<[]>;
  type test3 = Expect<Equal<res3, []>>;

  type res4 = Reverse<[1]>;
  type test4 = Expect<Equal<res4, [1]>>;
}

/**
 * 2. Using a rec. conditional a generic `Every` which given a tuple
 *    containing `true` or `false`, returns the type `true` if every
 *    item in the tuple are equal to `true`.
 *
 * Bonus: Can you find an alternate implementation that doesn't require
 * using recursion?
 */
namespace two {
  // type Every<tuple extends any[]> =
  //   tuple extends [infer First, ...infer Rest]
  //     ? First extends true ? Every<Rest> : false
  //     : true /* empty tuple */;

  // alternative without recursion
  type Every<tuple extends any[]> = false extends tuple[number] ? false : true;

  type res1 = Every<[true, false, false]>;
  type test1 = Expect<Equal<res1, false>>;

  type res2 = Every<[true, true, true, true, true]>;
  type test2 = Expect<Equal<res2, true>>;

  type res3 = Every<[false]>;
  type test3 = Expect<Equal<res3, false>>;

  type res4 = Every<[]>;
  type test4 = Expect<Equal<res4, true>>;
}

/**
 * 3. Implement a `UnwrapPromise` generic type which unwraps all layers
 * of promises and return the value contained inside.
 *
 * For example, `UnwrapPromise<Promise<Promise<number>>>` should
 * return `number`.
 */
namespace three {
  type UnwrapPromise<input> = input extends Promise<infer T> ? UnwrapPromise<T> : input;

  type res1 = UnwrapPromise<"NOT A PROMISE">;
  type test1 = Expect<Equal<res1, "NOT A PROMISE">>;

  type res2 = UnwrapPromise<Promise<"Hello">>;
  type test2 = Expect<Equal<res2, "Hello">>;

  type res3 = UnwrapPromise<Promise<Promise<"Hello">>>;
  type test3 = Expect<Equal<res3, "Hello">>;

  type res4 = UnwrapPromise<Promise<Promise<Promise<"Hello">>>>;
  type test4 = Expect<Equal<res4, "Hello">>;
}

namespace bonus {
  /**
   * 4. Using a rec. conditional a generic `Some` which given a tuple
   *    containing `true` or `false`, returns the type `true` if at least
   *    one item in the tuple is equal to `true`.
   *
   * Bonus: Can you find an alternate implementation that doesn't require
   * using recursion?
   */
  namespace four {
    // type Some<tuple extends any[]> = true extends tuple[number] ? true : false;

    type Some<tuple extends any[]> =
      tuple extends [infer first, ...infer rest]
        ? first extends true ? true : Some<rest>
        : false

    type res1 = Some<[true, false, false]>;
    type test1 = Expect<Equal<res1, true>>;

    type res2 = Some<[true, true, true, true, true]>;
    type test2 = Expect<Equal<res2, true>>;

    type res3 = Some<[false, false]>;
    type test3 = Expect<Equal<res3, false>>;

    type res4 = Some<[]>;
    type test4 = Expect<Equal<res4, false>>;
  }

  /**
   * 5. Write a `All<Promises>` generic type which turns an array
   * of Promises into a Promise containing an array of values.
   *
   * For example, `All<[Promise<number>, Promise<string>, Promise<boolean>]>`
   * should return `[number, string, boolean]`.
   */
  namespace five {
    type All<promises extends Array<any>> = promises extends [Promise<infer t>, ...infer tail] ? [t, ...All<tail>] : []

    type res1 = All<[Promise<number>]>;
    type test1 = Expect<Equal<res1, [number]>>;

    type res2 = All<[Promise<number>, Promise<string>, Promise<boolean>]>;
    type test2 = Expect<Equal<res2, [number, string, boolean]>>;

    type res3 = All<[Promise<number>, Promise<string>]>;
    type test3 = Expect<Equal<res3, [number, string]>>;

    type res4 = All<[]>;
    type test4 = Expect<Equal<res4, []>>;

    function all<Promises extends Tuple>(promises: Promises): All<Promises> {
      return Promise.all(promises) as unknown as All<Promises>;
    }

    const res5 = all([
      Promise.resolve(2),
      Promise.resolve("string"),
      Promise.resolve(true),
    ]);

    type res5 = typeof res5;
    type test5 = Expect<Equal<res5, [number, string, boolean]>>;
  }

  /**
   * 6. Implement a generic to convert strings formatted in snake_case
   *    into strings formatted in camelCase.
   *
   * Hint: you will need to use a Template Literal Type!
   */
  namespace six {
    type SnakeToPascalCase<word> =
      word extends `${infer first}_${infer rest}` ? `${Capitalize<first>}${SnakeToPascalCase<rest>}`
    : word extends `${infer word_without_underscore}` ? Capitalize<word_without_underscore> : "";

    export type SnakeToCamelCase<word> =
      word extends `${infer firstWord}_${infer rest}` ? `${firstWord}${SnakeToPascalCase<rest>}` : word;

    type res1 = SnakeToCamelCase<"hello">;
    type test1 = Expect<Equal<res1, "hello">>;

    type res2 = SnakeToCamelCase<"hello_world">;
    type test2 = Expect<Equal<res2, "helloWorld">>;

    type res3 = SnakeToCamelCase<"hello_type_script">;
    type test3 = Expect<Equal<res3, "helloTypeScript">>;
  }

  /**
   * 7. Implement a generic converting all keys of an object
   *    from snake_case to camelCase.
   *
   * Hints:
   *  - You will need to reuse the previous type!
   *  - You don't need a recursion to solve this one.
   */
  namespace seven {
    type CamelizeKeys<obj> = { [Key in keyof obj as six.SnakeToCamelCase<Key>]: obj[Key] };

    type res1 = CamelizeKeys<{ age: number; first_name: string }>;
    type test1 = Expect<Equal<res1, { age: number; firstName: string }>>;

    type res2 = CamelizeKeys<{ age_of_the_captain: number }>;
    type test2 = Expect<Equal<res2, { ageOfTheCaptain: number }>>;
  }
}
