
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Lead
 * 
 */
export type Lead = $Result.DefaultSelection<Prisma.$LeadPayload>
/**
 * Model AiPerformanceMetric
 * 
 */
export type AiPerformanceMetric = $Result.DefaultSelection<Prisma.$AiPerformanceMetricPayload>
/**
 * Model AiJob
 * 
 */
export type AiJob = $Result.DefaultSelection<Prisma.$AiJobPayload>
/**
 * Model AiJobAction
 * 
 */
export type AiJobAction = $Result.DefaultSelection<Prisma.$AiJobActionPayload>
/**
 * Model AiJobLog
 * 
 */
export type AiJobLog = $Result.DefaultSelection<Prisma.$AiJobLogPayload>
/**
 * Model AiMemoryEvent
 * 
 */
export type AiMemoryEvent = $Result.DefaultSelection<Prisma.$AiMemoryEventPayload>
/**
 * Model AiLearningRecommendation
 * 
 */
export type AiLearningRecommendation = $Result.DefaultSelection<Prisma.$AiLearningRecommendationPayload>
/**
 * Model Buyer
 * 
 */
export type Buyer = $Result.DefaultSelection<Prisma.$BuyerPayload>
/**
 * Model BuyerActivity
 * 
 */
export type BuyerActivity = $Result.DefaultSelection<Prisma.$BuyerActivityPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const LeadStatus: {
  new: 'new',
  contacted: 'contacted',
  negotiating: 'negotiating',
  under_contract: 'under_contract',
  closed: 'closed'
};

export type LeadStatus = (typeof LeadStatus)[keyof typeof LeadStatus]


export const BuyerActivityEventType: {
  deal_sent: 'deal_sent',
  deal_viewed: 'deal_viewed',
  deal_opened: 'deal_opened',
  link_clicked: 'link_clicked',
  responded: 'responded',
  replied: 'replied',
  requested_details: 'requested_details',
  offer_made: 'offer_made',
  deal_closed: 'deal_closed',
  deal_passed: 'deal_passed',
  unsubscribed_or_inactive: 'unsubscribed_or_inactive'
};

export type BuyerActivityEventType = (typeof BuyerActivityEventType)[keyof typeof BuyerActivityEventType]


export const BuyerTier: {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D'
};

export type BuyerTier = (typeof BuyerTier)[keyof typeof BuyerTier]

}

export type LeadStatus = $Enums.LeadStatus

export const LeadStatus: typeof $Enums.LeadStatus

export type BuyerActivityEventType = $Enums.BuyerActivityEventType

export const BuyerActivityEventType: typeof $Enums.BuyerActivityEventType

export type BuyerTier = $Enums.BuyerTier

export const BuyerTier: typeof $Enums.BuyerTier

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Leads
 * const leads = await prisma.lead.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Leads
   * const leads = await prisma.lead.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.lead`: Exposes CRUD operations for the **Lead** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Leads
    * const leads = await prisma.lead.findMany()
    * ```
    */
  get lead(): Prisma.LeadDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiPerformanceMetric`: Exposes CRUD operations for the **AiPerformanceMetric** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiPerformanceMetrics
    * const aiPerformanceMetrics = await prisma.aiPerformanceMetric.findMany()
    * ```
    */
  get aiPerformanceMetric(): Prisma.AiPerformanceMetricDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiJob`: Exposes CRUD operations for the **AiJob** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiJobs
    * const aiJobs = await prisma.aiJob.findMany()
    * ```
    */
  get aiJob(): Prisma.AiJobDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiJobAction`: Exposes CRUD operations for the **AiJobAction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiJobActions
    * const aiJobActions = await prisma.aiJobAction.findMany()
    * ```
    */
  get aiJobAction(): Prisma.AiJobActionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiJobLog`: Exposes CRUD operations for the **AiJobLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiJobLogs
    * const aiJobLogs = await prisma.aiJobLog.findMany()
    * ```
    */
  get aiJobLog(): Prisma.AiJobLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiMemoryEvent`: Exposes CRUD operations for the **AiMemoryEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiMemoryEvents
    * const aiMemoryEvents = await prisma.aiMemoryEvent.findMany()
    * ```
    */
  get aiMemoryEvent(): Prisma.AiMemoryEventDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiLearningRecommendation`: Exposes CRUD operations for the **AiLearningRecommendation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiLearningRecommendations
    * const aiLearningRecommendations = await prisma.aiLearningRecommendation.findMany()
    * ```
    */
  get aiLearningRecommendation(): Prisma.AiLearningRecommendationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.buyer`: Exposes CRUD operations for the **Buyer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Buyers
    * const buyers = await prisma.buyer.findMany()
    * ```
    */
  get buyer(): Prisma.BuyerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.buyerActivity`: Exposes CRUD operations for the **BuyerActivity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BuyerActivities
    * const buyerActivities = await prisma.buyerActivity.findMany()
    * ```
    */
  get buyerActivity(): Prisma.BuyerActivityDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Lead: 'Lead',
    AiPerformanceMetric: 'AiPerformanceMetric',
    AiJob: 'AiJob',
    AiJobAction: 'AiJobAction',
    AiJobLog: 'AiJobLog',
    AiMemoryEvent: 'AiMemoryEvent',
    AiLearningRecommendation: 'AiLearningRecommendation',
    Buyer: 'Buyer',
    BuyerActivity: 'BuyerActivity'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "lead" | "aiPerformanceMetric" | "aiJob" | "aiJobAction" | "aiJobLog" | "aiMemoryEvent" | "aiLearningRecommendation" | "buyer" | "buyerActivity"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Lead: {
        payload: Prisma.$LeadPayload<ExtArgs>
        fields: Prisma.LeadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          findFirst: {
            args: Prisma.LeadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          findMany: {
            args: Prisma.LeadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          create: {
            args: Prisma.LeadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          createMany: {
            args: Prisma.LeadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeadCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          delete: {
            args: Prisma.LeadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          update: {
            args: Prisma.LeadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          deleteMany: {
            args: Prisma.LeadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LeadUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>[]
          }
          upsert: {
            args: Prisma.LeadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeadPayload>
          }
          aggregate: {
            args: Prisma.LeadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLead>
          }
          groupBy: {
            args: Prisma.LeadGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeadGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeadCountArgs<ExtArgs>
            result: $Utils.Optional<LeadCountAggregateOutputType> | number
          }
        }
      }
      AiPerformanceMetric: {
        payload: Prisma.$AiPerformanceMetricPayload<ExtArgs>
        fields: Prisma.AiPerformanceMetricFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiPerformanceMetricFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPerformanceMetricPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiPerformanceMetricFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPerformanceMetricPayload>
          }
          findFirst: {
            args: Prisma.AiPerformanceMetricFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPerformanceMetricPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiPerformanceMetricFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPerformanceMetricPayload>
          }
          findMany: {
            args: Prisma.AiPerformanceMetricFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPerformanceMetricPayload>[]
          }
          create: {
            args: Prisma.AiPerformanceMetricCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPerformanceMetricPayload>
          }
          createMany: {
            args: Prisma.AiPerformanceMetricCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiPerformanceMetricCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPerformanceMetricPayload>[]
          }
          delete: {
            args: Prisma.AiPerformanceMetricDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPerformanceMetricPayload>
          }
          update: {
            args: Prisma.AiPerformanceMetricUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPerformanceMetricPayload>
          }
          deleteMany: {
            args: Prisma.AiPerformanceMetricDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiPerformanceMetricUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiPerformanceMetricUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPerformanceMetricPayload>[]
          }
          upsert: {
            args: Prisma.AiPerformanceMetricUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiPerformanceMetricPayload>
          }
          aggregate: {
            args: Prisma.AiPerformanceMetricAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiPerformanceMetric>
          }
          groupBy: {
            args: Prisma.AiPerformanceMetricGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiPerformanceMetricGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiPerformanceMetricCountArgs<ExtArgs>
            result: $Utils.Optional<AiPerformanceMetricCountAggregateOutputType> | number
          }
        }
      }
      AiJob: {
        payload: Prisma.$AiJobPayload<ExtArgs>
        fields: Prisma.AiJobFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiJobFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiJobFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobPayload>
          }
          findFirst: {
            args: Prisma.AiJobFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiJobFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobPayload>
          }
          findMany: {
            args: Prisma.AiJobFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobPayload>[]
          }
          create: {
            args: Prisma.AiJobCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobPayload>
          }
          createMany: {
            args: Prisma.AiJobCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiJobCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobPayload>[]
          }
          delete: {
            args: Prisma.AiJobDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobPayload>
          }
          update: {
            args: Prisma.AiJobUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobPayload>
          }
          deleteMany: {
            args: Prisma.AiJobDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiJobUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiJobUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobPayload>[]
          }
          upsert: {
            args: Prisma.AiJobUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobPayload>
          }
          aggregate: {
            args: Prisma.AiJobAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiJob>
          }
          groupBy: {
            args: Prisma.AiJobGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiJobGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiJobCountArgs<ExtArgs>
            result: $Utils.Optional<AiJobCountAggregateOutputType> | number
          }
        }
      }
      AiJobAction: {
        payload: Prisma.$AiJobActionPayload<ExtArgs>
        fields: Prisma.AiJobActionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiJobActionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobActionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiJobActionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobActionPayload>
          }
          findFirst: {
            args: Prisma.AiJobActionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobActionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiJobActionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobActionPayload>
          }
          findMany: {
            args: Prisma.AiJobActionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobActionPayload>[]
          }
          create: {
            args: Prisma.AiJobActionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobActionPayload>
          }
          createMany: {
            args: Prisma.AiJobActionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiJobActionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobActionPayload>[]
          }
          delete: {
            args: Prisma.AiJobActionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobActionPayload>
          }
          update: {
            args: Prisma.AiJobActionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobActionPayload>
          }
          deleteMany: {
            args: Prisma.AiJobActionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiJobActionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiJobActionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobActionPayload>[]
          }
          upsert: {
            args: Prisma.AiJobActionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobActionPayload>
          }
          aggregate: {
            args: Prisma.AiJobActionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiJobAction>
          }
          groupBy: {
            args: Prisma.AiJobActionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiJobActionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiJobActionCountArgs<ExtArgs>
            result: $Utils.Optional<AiJobActionCountAggregateOutputType> | number
          }
        }
      }
      AiJobLog: {
        payload: Prisma.$AiJobLogPayload<ExtArgs>
        fields: Prisma.AiJobLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiJobLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiJobLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobLogPayload>
          }
          findFirst: {
            args: Prisma.AiJobLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiJobLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobLogPayload>
          }
          findMany: {
            args: Prisma.AiJobLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobLogPayload>[]
          }
          create: {
            args: Prisma.AiJobLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobLogPayload>
          }
          createMany: {
            args: Prisma.AiJobLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiJobLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobLogPayload>[]
          }
          delete: {
            args: Prisma.AiJobLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobLogPayload>
          }
          update: {
            args: Prisma.AiJobLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobLogPayload>
          }
          deleteMany: {
            args: Prisma.AiJobLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiJobLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiJobLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobLogPayload>[]
          }
          upsert: {
            args: Prisma.AiJobLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiJobLogPayload>
          }
          aggregate: {
            args: Prisma.AiJobLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiJobLog>
          }
          groupBy: {
            args: Prisma.AiJobLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiJobLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiJobLogCountArgs<ExtArgs>
            result: $Utils.Optional<AiJobLogCountAggregateOutputType> | number
          }
        }
      }
      AiMemoryEvent: {
        payload: Prisma.$AiMemoryEventPayload<ExtArgs>
        fields: Prisma.AiMemoryEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiMemoryEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMemoryEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiMemoryEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMemoryEventPayload>
          }
          findFirst: {
            args: Prisma.AiMemoryEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMemoryEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiMemoryEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMemoryEventPayload>
          }
          findMany: {
            args: Prisma.AiMemoryEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMemoryEventPayload>[]
          }
          create: {
            args: Prisma.AiMemoryEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMemoryEventPayload>
          }
          createMany: {
            args: Prisma.AiMemoryEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiMemoryEventCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMemoryEventPayload>[]
          }
          delete: {
            args: Prisma.AiMemoryEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMemoryEventPayload>
          }
          update: {
            args: Prisma.AiMemoryEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMemoryEventPayload>
          }
          deleteMany: {
            args: Prisma.AiMemoryEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiMemoryEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiMemoryEventUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMemoryEventPayload>[]
          }
          upsert: {
            args: Prisma.AiMemoryEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiMemoryEventPayload>
          }
          aggregate: {
            args: Prisma.AiMemoryEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiMemoryEvent>
          }
          groupBy: {
            args: Prisma.AiMemoryEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiMemoryEventGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiMemoryEventCountArgs<ExtArgs>
            result: $Utils.Optional<AiMemoryEventCountAggregateOutputType> | number
          }
        }
      }
      AiLearningRecommendation: {
        payload: Prisma.$AiLearningRecommendationPayload<ExtArgs>
        fields: Prisma.AiLearningRecommendationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiLearningRecommendationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiLearningRecommendationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiLearningRecommendationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiLearningRecommendationPayload>
          }
          findFirst: {
            args: Prisma.AiLearningRecommendationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiLearningRecommendationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiLearningRecommendationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiLearningRecommendationPayload>
          }
          findMany: {
            args: Prisma.AiLearningRecommendationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiLearningRecommendationPayload>[]
          }
          create: {
            args: Prisma.AiLearningRecommendationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiLearningRecommendationPayload>
          }
          createMany: {
            args: Prisma.AiLearningRecommendationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiLearningRecommendationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiLearningRecommendationPayload>[]
          }
          delete: {
            args: Prisma.AiLearningRecommendationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiLearningRecommendationPayload>
          }
          update: {
            args: Prisma.AiLearningRecommendationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiLearningRecommendationPayload>
          }
          deleteMany: {
            args: Prisma.AiLearningRecommendationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiLearningRecommendationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiLearningRecommendationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiLearningRecommendationPayload>[]
          }
          upsert: {
            args: Prisma.AiLearningRecommendationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiLearningRecommendationPayload>
          }
          aggregate: {
            args: Prisma.AiLearningRecommendationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiLearningRecommendation>
          }
          groupBy: {
            args: Prisma.AiLearningRecommendationGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiLearningRecommendationGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiLearningRecommendationCountArgs<ExtArgs>
            result: $Utils.Optional<AiLearningRecommendationCountAggregateOutputType> | number
          }
        }
      }
      Buyer: {
        payload: Prisma.$BuyerPayload<ExtArgs>
        fields: Prisma.BuyerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BuyerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BuyerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerPayload>
          }
          findFirst: {
            args: Prisma.BuyerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BuyerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerPayload>
          }
          findMany: {
            args: Prisma.BuyerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerPayload>[]
          }
          create: {
            args: Prisma.BuyerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerPayload>
          }
          createMany: {
            args: Prisma.BuyerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BuyerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerPayload>[]
          }
          delete: {
            args: Prisma.BuyerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerPayload>
          }
          update: {
            args: Prisma.BuyerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerPayload>
          }
          deleteMany: {
            args: Prisma.BuyerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BuyerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BuyerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerPayload>[]
          }
          upsert: {
            args: Prisma.BuyerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerPayload>
          }
          aggregate: {
            args: Prisma.BuyerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBuyer>
          }
          groupBy: {
            args: Prisma.BuyerGroupByArgs<ExtArgs>
            result: $Utils.Optional<BuyerGroupByOutputType>[]
          }
          count: {
            args: Prisma.BuyerCountArgs<ExtArgs>
            result: $Utils.Optional<BuyerCountAggregateOutputType> | number
          }
        }
      }
      BuyerActivity: {
        payload: Prisma.$BuyerActivityPayload<ExtArgs>
        fields: Prisma.BuyerActivityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BuyerActivityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerActivityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BuyerActivityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerActivityPayload>
          }
          findFirst: {
            args: Prisma.BuyerActivityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerActivityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BuyerActivityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerActivityPayload>
          }
          findMany: {
            args: Prisma.BuyerActivityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerActivityPayload>[]
          }
          create: {
            args: Prisma.BuyerActivityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerActivityPayload>
          }
          createMany: {
            args: Prisma.BuyerActivityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BuyerActivityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerActivityPayload>[]
          }
          delete: {
            args: Prisma.BuyerActivityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerActivityPayload>
          }
          update: {
            args: Prisma.BuyerActivityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerActivityPayload>
          }
          deleteMany: {
            args: Prisma.BuyerActivityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BuyerActivityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BuyerActivityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerActivityPayload>[]
          }
          upsert: {
            args: Prisma.BuyerActivityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BuyerActivityPayload>
          }
          aggregate: {
            args: Prisma.BuyerActivityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBuyerActivity>
          }
          groupBy: {
            args: Prisma.BuyerActivityGroupByArgs<ExtArgs>
            result: $Utils.Optional<BuyerActivityGroupByOutputType>[]
          }
          count: {
            args: Prisma.BuyerActivityCountArgs<ExtArgs>
            result: $Utils.Optional<BuyerActivityCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    lead?: LeadOmit
    aiPerformanceMetric?: AiPerformanceMetricOmit
    aiJob?: AiJobOmit
    aiJobAction?: AiJobActionOmit
    aiJobLog?: AiJobLogOmit
    aiMemoryEvent?: AiMemoryEventOmit
    aiLearningRecommendation?: AiLearningRecommendationOmit
    buyer?: BuyerOmit
    buyerActivity?: BuyerActivityOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AiJobCountOutputType
   */

  export type AiJobCountOutputType = {
    actions: number
    logs: number
  }

  export type AiJobCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actions?: boolean | AiJobCountOutputTypeCountActionsArgs
    logs?: boolean | AiJobCountOutputTypeCountLogsArgs
  }

  // Custom InputTypes
  /**
   * AiJobCountOutputType without action
   */
  export type AiJobCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobCountOutputType
     */
    select?: AiJobCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AiJobCountOutputType without action
   */
  export type AiJobCountOutputTypeCountActionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiJobActionWhereInput
  }

  /**
   * AiJobCountOutputType without action
   */
  export type AiJobCountOutputTypeCountLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiJobLogWhereInput
  }


  /**
   * Count Type BuyerCountOutputType
   */

  export type BuyerCountOutputType = {
    activities: number
  }

  export type BuyerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activities?: boolean | BuyerCountOutputTypeCountActivitiesArgs
  }

  // Custom InputTypes
  /**
   * BuyerCountOutputType without action
   */
  export type BuyerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerCountOutputType
     */
    select?: BuyerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BuyerCountOutputType without action
   */
  export type BuyerCountOutputTypeCountActivitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuyerActivityWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Lead
   */

  export type AggregateLead = {
    _count: LeadCountAggregateOutputType | null
    _avg: LeadAvgAggregateOutputType | null
    _sum: LeadSumAggregateOutputType | null
    _min: LeadMinAggregateOutputType | null
    _max: LeadMaxAggregateOutputType | null
  }

  export type LeadAvgAggregateOutputType = {
    score: number | null
    followUpCount: number | null
    lastSellerReplyConfidence: number | null
  }

  export type LeadSumAggregateOutputType = {
    score: number | null
    followUpCount: number | null
    lastSellerReplyConfidence: number | null
  }

  export type LeadMinAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    propertyAddress: string | null
    source: string | null
    status: $Enums.LeadStatus | null
    score: number | null
    priority: string | null
    notes: string | null
    payload: string | null
    lastContactedAt: Date | null
    nextFollowUpAt: Date | null
    followUpCount: number | null
    lastFollowUpMessage: string | null
    automationStatus: string | null
    isHot: boolean | null
    lastSellerReply: string | null
    lastSellerReplyAt: Date | null
    lastSellerReplyIntent: string | null
    lastSellerReplyConfidence: number | null
    suggestedReply: string | null
    requiresHumanApproval: boolean | null
    doNotContact: boolean | null
    optOutReason: string | null
    optOutAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeadMaxAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    propertyAddress: string | null
    source: string | null
    status: $Enums.LeadStatus | null
    score: number | null
    priority: string | null
    notes: string | null
    payload: string | null
    lastContactedAt: Date | null
    nextFollowUpAt: Date | null
    followUpCount: number | null
    lastFollowUpMessage: string | null
    automationStatus: string | null
    isHot: boolean | null
    lastSellerReply: string | null
    lastSellerReplyAt: Date | null
    lastSellerReplyIntent: string | null
    lastSellerReplyConfidence: number | null
    suggestedReply: string | null
    requiresHumanApproval: boolean | null
    doNotContact: boolean | null
    optOutReason: string | null
    optOutAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeadCountAggregateOutputType = {
    id: number
    name: number
    phone: number
    propertyAddress: number
    source: number
    status: number
    score: number
    priority: number
    notes: number
    payload: number
    lastContactedAt: number
    nextFollowUpAt: number
    followUpCount: number
    lastFollowUpMessage: number
    automationStatus: number
    isHot: number
    lastSellerReply: number
    lastSellerReplyAt: number
    lastSellerReplyIntent: number
    lastSellerReplyConfidence: number
    suggestedReply: number
    requiresHumanApproval: number
    doNotContact: number
    optOutReason: number
    optOutAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LeadAvgAggregateInputType = {
    score?: true
    followUpCount?: true
    lastSellerReplyConfidence?: true
  }

  export type LeadSumAggregateInputType = {
    score?: true
    followUpCount?: true
    lastSellerReplyConfidence?: true
  }

  export type LeadMinAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    propertyAddress?: true
    source?: true
    status?: true
    score?: true
    priority?: true
    notes?: true
    payload?: true
    lastContactedAt?: true
    nextFollowUpAt?: true
    followUpCount?: true
    lastFollowUpMessage?: true
    automationStatus?: true
    isHot?: true
    lastSellerReply?: true
    lastSellerReplyAt?: true
    lastSellerReplyIntent?: true
    lastSellerReplyConfidence?: true
    suggestedReply?: true
    requiresHumanApproval?: true
    doNotContact?: true
    optOutReason?: true
    optOutAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeadMaxAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    propertyAddress?: true
    source?: true
    status?: true
    score?: true
    priority?: true
    notes?: true
    payload?: true
    lastContactedAt?: true
    nextFollowUpAt?: true
    followUpCount?: true
    lastFollowUpMessage?: true
    automationStatus?: true
    isHot?: true
    lastSellerReply?: true
    lastSellerReplyAt?: true
    lastSellerReplyIntent?: true
    lastSellerReplyConfidence?: true
    suggestedReply?: true
    requiresHumanApproval?: true
    doNotContact?: true
    optOutReason?: true
    optOutAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeadCountAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    propertyAddress?: true
    source?: true
    status?: true
    score?: true
    priority?: true
    notes?: true
    payload?: true
    lastContactedAt?: true
    nextFollowUpAt?: true
    followUpCount?: true
    lastFollowUpMessage?: true
    automationStatus?: true
    isHot?: true
    lastSellerReply?: true
    lastSellerReplyAt?: true
    lastSellerReplyIntent?: true
    lastSellerReplyConfidence?: true
    suggestedReply?: true
    requiresHumanApproval?: true
    doNotContact?: true
    optOutReason?: true
    optOutAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LeadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lead to aggregate.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Leads
    **/
    _count?: true | LeadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LeadAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LeadSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeadMaxAggregateInputType
  }

  export type GetLeadAggregateType<T extends LeadAggregateArgs> = {
        [P in keyof T & keyof AggregateLead]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLead[P]>
      : GetScalarType<T[P], AggregateLead[P]>
  }




  export type LeadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeadWhereInput
    orderBy?: LeadOrderByWithAggregationInput | LeadOrderByWithAggregationInput[]
    by: LeadScalarFieldEnum[] | LeadScalarFieldEnum
    having?: LeadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeadCountAggregateInputType | true
    _avg?: LeadAvgAggregateInputType
    _sum?: LeadSumAggregateInputType
    _min?: LeadMinAggregateInputType
    _max?: LeadMaxAggregateInputType
  }

  export type LeadGroupByOutputType = {
    id: string
    name: string
    phone: string
    propertyAddress: string
    source: string
    status: $Enums.LeadStatus
    score: number
    priority: string
    notes: string | null
    payload: string | null
    lastContactedAt: Date | null
    nextFollowUpAt: Date | null
    followUpCount: number
    lastFollowUpMessage: string | null
    automationStatus: string
    isHot: boolean
    lastSellerReply: string | null
    lastSellerReplyAt: Date | null
    lastSellerReplyIntent: string | null
    lastSellerReplyConfidence: number | null
    suggestedReply: string | null
    requiresHumanApproval: boolean
    doNotContact: boolean
    optOutReason: string | null
    optOutAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: LeadCountAggregateOutputType | null
    _avg: LeadAvgAggregateOutputType | null
    _sum: LeadSumAggregateOutputType | null
    _min: LeadMinAggregateOutputType | null
    _max: LeadMaxAggregateOutputType | null
  }

  type GetLeadGroupByPayload<T extends LeadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeadGroupByOutputType[P]>
            : GetScalarType<T[P], LeadGroupByOutputType[P]>
        }
      >
    >


  export type LeadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    propertyAddress?: boolean
    source?: boolean
    status?: boolean
    score?: boolean
    priority?: boolean
    notes?: boolean
    payload?: boolean
    lastContactedAt?: boolean
    nextFollowUpAt?: boolean
    followUpCount?: boolean
    lastFollowUpMessage?: boolean
    automationStatus?: boolean
    isHot?: boolean
    lastSellerReply?: boolean
    lastSellerReplyAt?: boolean
    lastSellerReplyIntent?: boolean
    lastSellerReplyConfidence?: boolean
    suggestedReply?: boolean
    requiresHumanApproval?: boolean
    doNotContact?: boolean
    optOutReason?: boolean
    optOutAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    propertyAddress?: boolean
    source?: boolean
    status?: boolean
    score?: boolean
    priority?: boolean
    notes?: boolean
    payload?: boolean
    lastContactedAt?: boolean
    nextFollowUpAt?: boolean
    followUpCount?: boolean
    lastFollowUpMessage?: boolean
    automationStatus?: boolean
    isHot?: boolean
    lastSellerReply?: boolean
    lastSellerReplyAt?: boolean
    lastSellerReplyIntent?: boolean
    lastSellerReplyConfidence?: boolean
    suggestedReply?: boolean
    requiresHumanApproval?: boolean
    doNotContact?: boolean
    optOutReason?: boolean
    optOutAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    propertyAddress?: boolean
    source?: boolean
    status?: boolean
    score?: boolean
    priority?: boolean
    notes?: boolean
    payload?: boolean
    lastContactedAt?: boolean
    nextFollowUpAt?: boolean
    followUpCount?: boolean
    lastFollowUpMessage?: boolean
    automationStatus?: boolean
    isHot?: boolean
    lastSellerReply?: boolean
    lastSellerReplyAt?: boolean
    lastSellerReplyIntent?: boolean
    lastSellerReplyConfidence?: boolean
    suggestedReply?: boolean
    requiresHumanApproval?: boolean
    doNotContact?: boolean
    optOutReason?: boolean
    optOutAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["lead"]>

  export type LeadSelectScalar = {
    id?: boolean
    name?: boolean
    phone?: boolean
    propertyAddress?: boolean
    source?: boolean
    status?: boolean
    score?: boolean
    priority?: boolean
    notes?: boolean
    payload?: boolean
    lastContactedAt?: boolean
    nextFollowUpAt?: boolean
    followUpCount?: boolean
    lastFollowUpMessage?: boolean
    automationStatus?: boolean
    isHot?: boolean
    lastSellerReply?: boolean
    lastSellerReplyAt?: boolean
    lastSellerReplyIntent?: boolean
    lastSellerReplyConfidence?: boolean
    suggestedReply?: boolean
    requiresHumanApproval?: boolean
    doNotContact?: boolean
    optOutReason?: boolean
    optOutAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LeadOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "phone" | "propertyAddress" | "source" | "status" | "score" | "priority" | "notes" | "payload" | "lastContactedAt" | "nextFollowUpAt" | "followUpCount" | "lastFollowUpMessage" | "automationStatus" | "isHot" | "lastSellerReply" | "lastSellerReplyAt" | "lastSellerReplyIntent" | "lastSellerReplyConfidence" | "suggestedReply" | "requiresHumanApproval" | "doNotContact" | "optOutReason" | "optOutAt" | "createdAt" | "updatedAt", ExtArgs["result"]["lead"]>

  export type $LeadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lead"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      phone: string
      propertyAddress: string
      source: string
      status: $Enums.LeadStatus
      score: number
      priority: string
      notes: string | null
      payload: string | null
      lastContactedAt: Date | null
      nextFollowUpAt: Date | null
      followUpCount: number
      lastFollowUpMessage: string | null
      automationStatus: string
      isHot: boolean
      lastSellerReply: string | null
      lastSellerReplyAt: Date | null
      lastSellerReplyIntent: string | null
      lastSellerReplyConfidence: number | null
      suggestedReply: string | null
      requiresHumanApproval: boolean
      doNotContact: boolean
      optOutReason: string | null
      optOutAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["lead"]>
    composites: {}
  }

  type LeadGetPayload<S extends boolean | null | undefined | LeadDefaultArgs> = $Result.GetResult<Prisma.$LeadPayload, S>

  type LeadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LeadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LeadCountAggregateInputType | true
    }

  export interface LeadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lead'], meta: { name: 'Lead' } }
    /**
     * Find zero or one Lead that matches the filter.
     * @param {LeadFindUniqueArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeadFindUniqueArgs>(args: SelectSubset<T, LeadFindUniqueArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lead that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeadFindUniqueOrThrowArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeadFindUniqueOrThrowArgs>(args: SelectSubset<T, LeadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lead that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindFirstArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeadFindFirstArgs>(args?: SelectSubset<T, LeadFindFirstArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lead that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindFirstOrThrowArgs} args - Arguments to find a Lead
     * @example
     * // Get one Lead
     * const lead = await prisma.lead.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeadFindFirstOrThrowArgs>(args?: SelectSubset<T, LeadFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Leads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Leads
     * const leads = await prisma.lead.findMany()
     * 
     * // Get first 10 Leads
     * const leads = await prisma.lead.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leadWithIdOnly = await prisma.lead.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeadFindManyArgs>(args?: SelectSubset<T, LeadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lead.
     * @param {LeadCreateArgs} args - Arguments to create a Lead.
     * @example
     * // Create one Lead
     * const Lead = await prisma.lead.create({
     *   data: {
     *     // ... data to create a Lead
     *   }
     * })
     * 
     */
    create<T extends LeadCreateArgs>(args: SelectSubset<T, LeadCreateArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Leads.
     * @param {LeadCreateManyArgs} args - Arguments to create many Leads.
     * @example
     * // Create many Leads
     * const lead = await prisma.lead.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeadCreateManyArgs>(args?: SelectSubset<T, LeadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Leads and returns the data saved in the database.
     * @param {LeadCreateManyAndReturnArgs} args - Arguments to create many Leads.
     * @example
     * // Create many Leads
     * const lead = await prisma.lead.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Leads and only return the `id`
     * const leadWithIdOnly = await prisma.lead.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeadCreateManyAndReturnArgs>(args?: SelectSubset<T, LeadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lead.
     * @param {LeadDeleteArgs} args - Arguments to delete one Lead.
     * @example
     * // Delete one Lead
     * const Lead = await prisma.lead.delete({
     *   where: {
     *     // ... filter to delete one Lead
     *   }
     * })
     * 
     */
    delete<T extends LeadDeleteArgs>(args: SelectSubset<T, LeadDeleteArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lead.
     * @param {LeadUpdateArgs} args - Arguments to update one Lead.
     * @example
     * // Update one Lead
     * const lead = await prisma.lead.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeadUpdateArgs>(args: SelectSubset<T, LeadUpdateArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Leads.
     * @param {LeadDeleteManyArgs} args - Arguments to filter Leads to delete.
     * @example
     * // Delete a few Leads
     * const { count } = await prisma.lead.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeadDeleteManyArgs>(args?: SelectSubset<T, LeadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Leads
     * const lead = await prisma.lead.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeadUpdateManyArgs>(args: SelectSubset<T, LeadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leads and returns the data updated in the database.
     * @param {LeadUpdateManyAndReturnArgs} args - Arguments to update many Leads.
     * @example
     * // Update many Leads
     * const lead = await prisma.lead.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Leads and only return the `id`
     * const leadWithIdOnly = await prisma.lead.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LeadUpdateManyAndReturnArgs>(args: SelectSubset<T, LeadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lead.
     * @param {LeadUpsertArgs} args - Arguments to update or create a Lead.
     * @example
     * // Update or create a Lead
     * const lead = await prisma.lead.upsert({
     *   create: {
     *     // ... data to create a Lead
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lead we want to update
     *   }
     * })
     */
    upsert<T extends LeadUpsertArgs>(args: SelectSubset<T, LeadUpsertArgs<ExtArgs>>): Prisma__LeadClient<$Result.GetResult<Prisma.$LeadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Leads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadCountArgs} args - Arguments to filter Leads to count.
     * @example
     * // Count the number of Leads
     * const count = await prisma.lead.count({
     *   where: {
     *     // ... the filter for the Leads we want to count
     *   }
     * })
    **/
    count<T extends LeadCountArgs>(
      args?: Subset<T, LeadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lead.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeadAggregateArgs>(args: Subset<T, LeadAggregateArgs>): Prisma.PrismaPromise<GetLeadAggregateType<T>>

    /**
     * Group by Lead.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeadGroupByArgs['orderBy'] }
        : { orderBy?: LeadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lead model
   */
  readonly fields: LeadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lead.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lead model
   */
  interface LeadFieldRefs {
    readonly id: FieldRef<"Lead", 'String'>
    readonly name: FieldRef<"Lead", 'String'>
    readonly phone: FieldRef<"Lead", 'String'>
    readonly propertyAddress: FieldRef<"Lead", 'String'>
    readonly source: FieldRef<"Lead", 'String'>
    readonly status: FieldRef<"Lead", 'LeadStatus'>
    readonly score: FieldRef<"Lead", 'Int'>
    readonly priority: FieldRef<"Lead", 'String'>
    readonly notes: FieldRef<"Lead", 'String'>
    readonly payload: FieldRef<"Lead", 'String'>
    readonly lastContactedAt: FieldRef<"Lead", 'DateTime'>
    readonly nextFollowUpAt: FieldRef<"Lead", 'DateTime'>
    readonly followUpCount: FieldRef<"Lead", 'Int'>
    readonly lastFollowUpMessage: FieldRef<"Lead", 'String'>
    readonly automationStatus: FieldRef<"Lead", 'String'>
    readonly isHot: FieldRef<"Lead", 'Boolean'>
    readonly lastSellerReply: FieldRef<"Lead", 'String'>
    readonly lastSellerReplyAt: FieldRef<"Lead", 'DateTime'>
    readonly lastSellerReplyIntent: FieldRef<"Lead", 'String'>
    readonly lastSellerReplyConfidence: FieldRef<"Lead", 'Float'>
    readonly suggestedReply: FieldRef<"Lead", 'String'>
    readonly requiresHumanApproval: FieldRef<"Lead", 'Boolean'>
    readonly doNotContact: FieldRef<"Lead", 'Boolean'>
    readonly optOutReason: FieldRef<"Lead", 'String'>
    readonly optOutAt: FieldRef<"Lead", 'DateTime'>
    readonly createdAt: FieldRef<"Lead", 'DateTime'>
    readonly updatedAt: FieldRef<"Lead", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Lead findUnique
   */
  export type LeadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead findUniqueOrThrow
   */
  export type LeadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead findFirst
   */
  export type LeadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leads.
     */
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead findFirstOrThrow
   */
  export type LeadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Filter, which Lead to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leads.
     */
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead findMany
   */
  export type LeadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Filter, which Leads to fetch.
     */
    where?: LeadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leads to fetch.
     */
    orderBy?: LeadOrderByWithRelationInput | LeadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Leads.
     */
    cursor?: LeadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leads.
     */
    skip?: number
    distinct?: LeadScalarFieldEnum | LeadScalarFieldEnum[]
  }

  /**
   * Lead create
   */
  export type LeadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * The data needed to create a Lead.
     */
    data: XOR<LeadCreateInput, LeadUncheckedCreateInput>
  }

  /**
   * Lead createMany
   */
  export type LeadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Leads.
     */
    data: LeadCreateManyInput | LeadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lead createManyAndReturn
   */
  export type LeadCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * The data used to create many Leads.
     */
    data: LeadCreateManyInput | LeadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lead update
   */
  export type LeadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * The data needed to update a Lead.
     */
    data: XOR<LeadUpdateInput, LeadUncheckedUpdateInput>
    /**
     * Choose, which Lead to update.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead updateMany
   */
  export type LeadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Leads.
     */
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyInput>
    /**
     * Filter which Leads to update
     */
    where?: LeadWhereInput
    /**
     * Limit how many Leads to update.
     */
    limit?: number
  }

  /**
   * Lead updateManyAndReturn
   */
  export type LeadUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * The data used to update Leads.
     */
    data: XOR<LeadUpdateManyMutationInput, LeadUncheckedUpdateManyInput>
    /**
     * Filter which Leads to update
     */
    where?: LeadWhereInput
    /**
     * Limit how many Leads to update.
     */
    limit?: number
  }

  /**
   * Lead upsert
   */
  export type LeadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * The filter to search for the Lead to update in case it exists.
     */
    where: LeadWhereUniqueInput
    /**
     * In case the Lead found by the `where` argument doesn't exist, create a new Lead with this data.
     */
    create: XOR<LeadCreateInput, LeadUncheckedCreateInput>
    /**
     * In case the Lead was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeadUpdateInput, LeadUncheckedUpdateInput>
  }

  /**
   * Lead delete
   */
  export type LeadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
    /**
     * Filter which Lead to delete.
     */
    where: LeadWhereUniqueInput
  }

  /**
   * Lead deleteMany
   */
  export type LeadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Leads to delete
     */
    where?: LeadWhereInput
    /**
     * Limit how many Leads to delete.
     */
    limit?: number
  }

  /**
   * Lead without action
   */
  export type LeadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lead
     */
    select?: LeadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lead
     */
    omit?: LeadOmit<ExtArgs> | null
  }


  /**
   * Model AiPerformanceMetric
   */

  export type AggregateAiPerformanceMetric = {
    _count: AiPerformanceMetricCountAggregateOutputType | null
    _avg: AiPerformanceMetricAvgAggregateOutputType | null
    _sum: AiPerformanceMetricSumAggregateOutputType | null
    _min: AiPerformanceMetricMinAggregateOutputType | null
    _max: AiPerformanceMetricMaxAggregateOutputType | null
  }

  export type AiPerformanceMetricAvgAggregateOutputType = {
    totalLeads: number | null
    newLeads: number | null
    contactedLeads: number | null
    negotiatingLeads: number | null
    underContractLeads: number | null
    closedLeads: number | null
    sellerReplies: number | null
    aiClassifications: number | null
    avgConfidence: number | null
    humanApprovalsNeeded: number | null
    suggestedReplies: number | null
    dncCount: number | null
    hotLeads: number | null
    automationScheduled: number | null
    automationIdle: number | null
    staleNewLeads: number | null
    overdueFollowUps: number | null
  }

  export type AiPerformanceMetricSumAggregateOutputType = {
    totalLeads: number | null
    newLeads: number | null
    contactedLeads: number | null
    negotiatingLeads: number | null
    underContractLeads: number | null
    closedLeads: number | null
    sellerReplies: number | null
    aiClassifications: number | null
    avgConfidence: number | null
    humanApprovalsNeeded: number | null
    suggestedReplies: number | null
    dncCount: number | null
    hotLeads: number | null
    automationScheduled: number | null
    automationIdle: number | null
    staleNewLeads: number | null
    overdueFollowUps: number | null
  }

  export type AiPerformanceMetricMinAggregateOutputType = {
    id: string | null
    date: Date | null
    totalLeads: number | null
    newLeads: number | null
    contactedLeads: number | null
    negotiatingLeads: number | null
    underContractLeads: number | null
    closedLeads: number | null
    sellerReplies: number | null
    aiClassifications: number | null
    avgConfidence: number | null
    humanApprovalsNeeded: number | null
    suggestedReplies: number | null
    dncCount: number | null
    hotLeads: number | null
    automationScheduled: number | null
    automationIdle: number | null
    staleNewLeads: number | null
    overdueFollowUps: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiPerformanceMetricMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    totalLeads: number | null
    newLeads: number | null
    contactedLeads: number | null
    negotiatingLeads: number | null
    underContractLeads: number | null
    closedLeads: number | null
    sellerReplies: number | null
    aiClassifications: number | null
    avgConfidence: number | null
    humanApprovalsNeeded: number | null
    suggestedReplies: number | null
    dncCount: number | null
    hotLeads: number | null
    automationScheduled: number | null
    automationIdle: number | null
    staleNewLeads: number | null
    overdueFollowUps: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiPerformanceMetricCountAggregateOutputType = {
    id: number
    date: number
    totalLeads: number
    newLeads: number
    contactedLeads: number
    negotiatingLeads: number
    underContractLeads: number
    closedLeads: number
    sellerReplies: number
    aiClassifications: number
    avgConfidence: number
    humanApprovalsNeeded: number
    suggestedReplies: number
    dncCount: number
    hotLeads: number
    automationScheduled: number
    automationIdle: number
    staleNewLeads: number
    overdueFollowUps: number
    systemWarnings: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AiPerformanceMetricAvgAggregateInputType = {
    totalLeads?: true
    newLeads?: true
    contactedLeads?: true
    negotiatingLeads?: true
    underContractLeads?: true
    closedLeads?: true
    sellerReplies?: true
    aiClassifications?: true
    avgConfidence?: true
    humanApprovalsNeeded?: true
    suggestedReplies?: true
    dncCount?: true
    hotLeads?: true
    automationScheduled?: true
    automationIdle?: true
    staleNewLeads?: true
    overdueFollowUps?: true
  }

  export type AiPerformanceMetricSumAggregateInputType = {
    totalLeads?: true
    newLeads?: true
    contactedLeads?: true
    negotiatingLeads?: true
    underContractLeads?: true
    closedLeads?: true
    sellerReplies?: true
    aiClassifications?: true
    avgConfidence?: true
    humanApprovalsNeeded?: true
    suggestedReplies?: true
    dncCount?: true
    hotLeads?: true
    automationScheduled?: true
    automationIdle?: true
    staleNewLeads?: true
    overdueFollowUps?: true
  }

  export type AiPerformanceMetricMinAggregateInputType = {
    id?: true
    date?: true
    totalLeads?: true
    newLeads?: true
    contactedLeads?: true
    negotiatingLeads?: true
    underContractLeads?: true
    closedLeads?: true
    sellerReplies?: true
    aiClassifications?: true
    avgConfidence?: true
    humanApprovalsNeeded?: true
    suggestedReplies?: true
    dncCount?: true
    hotLeads?: true
    automationScheduled?: true
    automationIdle?: true
    staleNewLeads?: true
    overdueFollowUps?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiPerformanceMetricMaxAggregateInputType = {
    id?: true
    date?: true
    totalLeads?: true
    newLeads?: true
    contactedLeads?: true
    negotiatingLeads?: true
    underContractLeads?: true
    closedLeads?: true
    sellerReplies?: true
    aiClassifications?: true
    avgConfidence?: true
    humanApprovalsNeeded?: true
    suggestedReplies?: true
    dncCount?: true
    hotLeads?: true
    automationScheduled?: true
    automationIdle?: true
    staleNewLeads?: true
    overdueFollowUps?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiPerformanceMetricCountAggregateInputType = {
    id?: true
    date?: true
    totalLeads?: true
    newLeads?: true
    contactedLeads?: true
    negotiatingLeads?: true
    underContractLeads?: true
    closedLeads?: true
    sellerReplies?: true
    aiClassifications?: true
    avgConfidence?: true
    humanApprovalsNeeded?: true
    suggestedReplies?: true
    dncCount?: true
    hotLeads?: true
    automationScheduled?: true
    automationIdle?: true
    staleNewLeads?: true
    overdueFollowUps?: true
    systemWarnings?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AiPerformanceMetricAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiPerformanceMetric to aggregate.
     */
    where?: AiPerformanceMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiPerformanceMetrics to fetch.
     */
    orderBy?: AiPerformanceMetricOrderByWithRelationInput | AiPerformanceMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiPerformanceMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiPerformanceMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiPerformanceMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiPerformanceMetrics
    **/
    _count?: true | AiPerformanceMetricCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiPerformanceMetricAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiPerformanceMetricSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiPerformanceMetricMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiPerformanceMetricMaxAggregateInputType
  }

  export type GetAiPerformanceMetricAggregateType<T extends AiPerformanceMetricAggregateArgs> = {
        [P in keyof T & keyof AggregateAiPerformanceMetric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiPerformanceMetric[P]>
      : GetScalarType<T[P], AggregateAiPerformanceMetric[P]>
  }




  export type AiPerformanceMetricGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiPerformanceMetricWhereInput
    orderBy?: AiPerformanceMetricOrderByWithAggregationInput | AiPerformanceMetricOrderByWithAggregationInput[]
    by: AiPerformanceMetricScalarFieldEnum[] | AiPerformanceMetricScalarFieldEnum
    having?: AiPerformanceMetricScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiPerformanceMetricCountAggregateInputType | true
    _avg?: AiPerformanceMetricAvgAggregateInputType
    _sum?: AiPerformanceMetricSumAggregateInputType
    _min?: AiPerformanceMetricMinAggregateInputType
    _max?: AiPerformanceMetricMaxAggregateInputType
  }

  export type AiPerformanceMetricGroupByOutputType = {
    id: string
    date: Date
    totalLeads: number
    newLeads: number
    contactedLeads: number
    negotiatingLeads: number
    underContractLeads: number
    closedLeads: number
    sellerReplies: number
    aiClassifications: number
    avgConfidence: number
    humanApprovalsNeeded: number
    suggestedReplies: number
    dncCount: number
    hotLeads: number
    automationScheduled: number
    automationIdle: number
    staleNewLeads: number
    overdueFollowUps: number
    systemWarnings: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: AiPerformanceMetricCountAggregateOutputType | null
    _avg: AiPerformanceMetricAvgAggregateOutputType | null
    _sum: AiPerformanceMetricSumAggregateOutputType | null
    _min: AiPerformanceMetricMinAggregateOutputType | null
    _max: AiPerformanceMetricMaxAggregateOutputType | null
  }

  type GetAiPerformanceMetricGroupByPayload<T extends AiPerformanceMetricGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiPerformanceMetricGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiPerformanceMetricGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiPerformanceMetricGroupByOutputType[P]>
            : GetScalarType<T[P], AiPerformanceMetricGroupByOutputType[P]>
        }
      >
    >


  export type AiPerformanceMetricSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    totalLeads?: boolean
    newLeads?: boolean
    contactedLeads?: boolean
    negotiatingLeads?: boolean
    underContractLeads?: boolean
    closedLeads?: boolean
    sellerReplies?: boolean
    aiClassifications?: boolean
    avgConfidence?: boolean
    humanApprovalsNeeded?: boolean
    suggestedReplies?: boolean
    dncCount?: boolean
    hotLeads?: boolean
    automationScheduled?: boolean
    automationIdle?: boolean
    staleNewLeads?: boolean
    overdueFollowUps?: boolean
    systemWarnings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiPerformanceMetric"]>

  export type AiPerformanceMetricSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    totalLeads?: boolean
    newLeads?: boolean
    contactedLeads?: boolean
    negotiatingLeads?: boolean
    underContractLeads?: boolean
    closedLeads?: boolean
    sellerReplies?: boolean
    aiClassifications?: boolean
    avgConfidence?: boolean
    humanApprovalsNeeded?: boolean
    suggestedReplies?: boolean
    dncCount?: boolean
    hotLeads?: boolean
    automationScheduled?: boolean
    automationIdle?: boolean
    staleNewLeads?: boolean
    overdueFollowUps?: boolean
    systemWarnings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiPerformanceMetric"]>

  export type AiPerformanceMetricSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    totalLeads?: boolean
    newLeads?: boolean
    contactedLeads?: boolean
    negotiatingLeads?: boolean
    underContractLeads?: boolean
    closedLeads?: boolean
    sellerReplies?: boolean
    aiClassifications?: boolean
    avgConfidence?: boolean
    humanApprovalsNeeded?: boolean
    suggestedReplies?: boolean
    dncCount?: boolean
    hotLeads?: boolean
    automationScheduled?: boolean
    automationIdle?: boolean
    staleNewLeads?: boolean
    overdueFollowUps?: boolean
    systemWarnings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiPerformanceMetric"]>

  export type AiPerformanceMetricSelectScalar = {
    id?: boolean
    date?: boolean
    totalLeads?: boolean
    newLeads?: boolean
    contactedLeads?: boolean
    negotiatingLeads?: boolean
    underContractLeads?: boolean
    closedLeads?: boolean
    sellerReplies?: boolean
    aiClassifications?: boolean
    avgConfidence?: boolean
    humanApprovalsNeeded?: boolean
    suggestedReplies?: boolean
    dncCount?: boolean
    hotLeads?: boolean
    automationScheduled?: boolean
    automationIdle?: boolean
    staleNewLeads?: boolean
    overdueFollowUps?: boolean
    systemWarnings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AiPerformanceMetricOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "totalLeads" | "newLeads" | "contactedLeads" | "negotiatingLeads" | "underContractLeads" | "closedLeads" | "sellerReplies" | "aiClassifications" | "avgConfidence" | "humanApprovalsNeeded" | "suggestedReplies" | "dncCount" | "hotLeads" | "automationScheduled" | "automationIdle" | "staleNewLeads" | "overdueFollowUps" | "systemWarnings" | "createdAt" | "updatedAt", ExtArgs["result"]["aiPerformanceMetric"]>

  export type $AiPerformanceMetricPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiPerformanceMetric"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      totalLeads: number
      newLeads: number
      contactedLeads: number
      negotiatingLeads: number
      underContractLeads: number
      closedLeads: number
      sellerReplies: number
      aiClassifications: number
      avgConfidence: number
      humanApprovalsNeeded: number
      suggestedReplies: number
      dncCount: number
      hotLeads: number
      automationScheduled: number
      automationIdle: number
      staleNewLeads: number
      overdueFollowUps: number
      systemWarnings: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aiPerformanceMetric"]>
    composites: {}
  }

  type AiPerformanceMetricGetPayload<S extends boolean | null | undefined | AiPerformanceMetricDefaultArgs> = $Result.GetResult<Prisma.$AiPerformanceMetricPayload, S>

  type AiPerformanceMetricCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiPerformanceMetricFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiPerformanceMetricCountAggregateInputType | true
    }

  export interface AiPerformanceMetricDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiPerformanceMetric'], meta: { name: 'AiPerformanceMetric' } }
    /**
     * Find zero or one AiPerformanceMetric that matches the filter.
     * @param {AiPerformanceMetricFindUniqueArgs} args - Arguments to find a AiPerformanceMetric
     * @example
     * // Get one AiPerformanceMetric
     * const aiPerformanceMetric = await prisma.aiPerformanceMetric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiPerformanceMetricFindUniqueArgs>(args: SelectSubset<T, AiPerformanceMetricFindUniqueArgs<ExtArgs>>): Prisma__AiPerformanceMetricClient<$Result.GetResult<Prisma.$AiPerformanceMetricPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiPerformanceMetric that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiPerformanceMetricFindUniqueOrThrowArgs} args - Arguments to find a AiPerformanceMetric
     * @example
     * // Get one AiPerformanceMetric
     * const aiPerformanceMetric = await prisma.aiPerformanceMetric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiPerformanceMetricFindUniqueOrThrowArgs>(args: SelectSubset<T, AiPerformanceMetricFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiPerformanceMetricClient<$Result.GetResult<Prisma.$AiPerformanceMetricPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiPerformanceMetric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPerformanceMetricFindFirstArgs} args - Arguments to find a AiPerformanceMetric
     * @example
     * // Get one AiPerformanceMetric
     * const aiPerformanceMetric = await prisma.aiPerformanceMetric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiPerformanceMetricFindFirstArgs>(args?: SelectSubset<T, AiPerformanceMetricFindFirstArgs<ExtArgs>>): Prisma__AiPerformanceMetricClient<$Result.GetResult<Prisma.$AiPerformanceMetricPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiPerformanceMetric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPerformanceMetricFindFirstOrThrowArgs} args - Arguments to find a AiPerformanceMetric
     * @example
     * // Get one AiPerformanceMetric
     * const aiPerformanceMetric = await prisma.aiPerformanceMetric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiPerformanceMetricFindFirstOrThrowArgs>(args?: SelectSubset<T, AiPerformanceMetricFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiPerformanceMetricClient<$Result.GetResult<Prisma.$AiPerformanceMetricPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiPerformanceMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPerformanceMetricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiPerformanceMetrics
     * const aiPerformanceMetrics = await prisma.aiPerformanceMetric.findMany()
     * 
     * // Get first 10 AiPerformanceMetrics
     * const aiPerformanceMetrics = await prisma.aiPerformanceMetric.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiPerformanceMetricWithIdOnly = await prisma.aiPerformanceMetric.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiPerformanceMetricFindManyArgs>(args?: SelectSubset<T, AiPerformanceMetricFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiPerformanceMetricPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiPerformanceMetric.
     * @param {AiPerformanceMetricCreateArgs} args - Arguments to create a AiPerformanceMetric.
     * @example
     * // Create one AiPerformanceMetric
     * const AiPerformanceMetric = await prisma.aiPerformanceMetric.create({
     *   data: {
     *     // ... data to create a AiPerformanceMetric
     *   }
     * })
     * 
     */
    create<T extends AiPerformanceMetricCreateArgs>(args: SelectSubset<T, AiPerformanceMetricCreateArgs<ExtArgs>>): Prisma__AiPerformanceMetricClient<$Result.GetResult<Prisma.$AiPerformanceMetricPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiPerformanceMetrics.
     * @param {AiPerformanceMetricCreateManyArgs} args - Arguments to create many AiPerformanceMetrics.
     * @example
     * // Create many AiPerformanceMetrics
     * const aiPerformanceMetric = await prisma.aiPerformanceMetric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiPerformanceMetricCreateManyArgs>(args?: SelectSubset<T, AiPerformanceMetricCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiPerformanceMetrics and returns the data saved in the database.
     * @param {AiPerformanceMetricCreateManyAndReturnArgs} args - Arguments to create many AiPerformanceMetrics.
     * @example
     * // Create many AiPerformanceMetrics
     * const aiPerformanceMetric = await prisma.aiPerformanceMetric.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiPerformanceMetrics and only return the `id`
     * const aiPerformanceMetricWithIdOnly = await prisma.aiPerformanceMetric.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiPerformanceMetricCreateManyAndReturnArgs>(args?: SelectSubset<T, AiPerformanceMetricCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiPerformanceMetricPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiPerformanceMetric.
     * @param {AiPerformanceMetricDeleteArgs} args - Arguments to delete one AiPerformanceMetric.
     * @example
     * // Delete one AiPerformanceMetric
     * const AiPerformanceMetric = await prisma.aiPerformanceMetric.delete({
     *   where: {
     *     // ... filter to delete one AiPerformanceMetric
     *   }
     * })
     * 
     */
    delete<T extends AiPerformanceMetricDeleteArgs>(args: SelectSubset<T, AiPerformanceMetricDeleteArgs<ExtArgs>>): Prisma__AiPerformanceMetricClient<$Result.GetResult<Prisma.$AiPerformanceMetricPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiPerformanceMetric.
     * @param {AiPerformanceMetricUpdateArgs} args - Arguments to update one AiPerformanceMetric.
     * @example
     * // Update one AiPerformanceMetric
     * const aiPerformanceMetric = await prisma.aiPerformanceMetric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiPerformanceMetricUpdateArgs>(args: SelectSubset<T, AiPerformanceMetricUpdateArgs<ExtArgs>>): Prisma__AiPerformanceMetricClient<$Result.GetResult<Prisma.$AiPerformanceMetricPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiPerformanceMetrics.
     * @param {AiPerformanceMetricDeleteManyArgs} args - Arguments to filter AiPerformanceMetrics to delete.
     * @example
     * // Delete a few AiPerformanceMetrics
     * const { count } = await prisma.aiPerformanceMetric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiPerformanceMetricDeleteManyArgs>(args?: SelectSubset<T, AiPerformanceMetricDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiPerformanceMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPerformanceMetricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiPerformanceMetrics
     * const aiPerformanceMetric = await prisma.aiPerformanceMetric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiPerformanceMetricUpdateManyArgs>(args: SelectSubset<T, AiPerformanceMetricUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiPerformanceMetrics and returns the data updated in the database.
     * @param {AiPerformanceMetricUpdateManyAndReturnArgs} args - Arguments to update many AiPerformanceMetrics.
     * @example
     * // Update many AiPerformanceMetrics
     * const aiPerformanceMetric = await prisma.aiPerformanceMetric.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiPerformanceMetrics and only return the `id`
     * const aiPerformanceMetricWithIdOnly = await prisma.aiPerformanceMetric.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiPerformanceMetricUpdateManyAndReturnArgs>(args: SelectSubset<T, AiPerformanceMetricUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiPerformanceMetricPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiPerformanceMetric.
     * @param {AiPerformanceMetricUpsertArgs} args - Arguments to update or create a AiPerformanceMetric.
     * @example
     * // Update or create a AiPerformanceMetric
     * const aiPerformanceMetric = await prisma.aiPerformanceMetric.upsert({
     *   create: {
     *     // ... data to create a AiPerformanceMetric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiPerformanceMetric we want to update
     *   }
     * })
     */
    upsert<T extends AiPerformanceMetricUpsertArgs>(args: SelectSubset<T, AiPerformanceMetricUpsertArgs<ExtArgs>>): Prisma__AiPerformanceMetricClient<$Result.GetResult<Prisma.$AiPerformanceMetricPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiPerformanceMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPerformanceMetricCountArgs} args - Arguments to filter AiPerformanceMetrics to count.
     * @example
     * // Count the number of AiPerformanceMetrics
     * const count = await prisma.aiPerformanceMetric.count({
     *   where: {
     *     // ... the filter for the AiPerformanceMetrics we want to count
     *   }
     * })
    **/
    count<T extends AiPerformanceMetricCountArgs>(
      args?: Subset<T, AiPerformanceMetricCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiPerformanceMetricCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiPerformanceMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPerformanceMetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiPerformanceMetricAggregateArgs>(args: Subset<T, AiPerformanceMetricAggregateArgs>): Prisma.PrismaPromise<GetAiPerformanceMetricAggregateType<T>>

    /**
     * Group by AiPerformanceMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiPerformanceMetricGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiPerformanceMetricGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiPerformanceMetricGroupByArgs['orderBy'] }
        : { orderBy?: AiPerformanceMetricGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiPerformanceMetricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiPerformanceMetricGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiPerformanceMetric model
   */
  readonly fields: AiPerformanceMetricFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiPerformanceMetric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiPerformanceMetricClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiPerformanceMetric model
   */
  interface AiPerformanceMetricFieldRefs {
    readonly id: FieldRef<"AiPerformanceMetric", 'String'>
    readonly date: FieldRef<"AiPerformanceMetric", 'DateTime'>
    readonly totalLeads: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly newLeads: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly contactedLeads: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly negotiatingLeads: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly underContractLeads: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly closedLeads: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly sellerReplies: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly aiClassifications: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly avgConfidence: FieldRef<"AiPerformanceMetric", 'Float'>
    readonly humanApprovalsNeeded: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly suggestedReplies: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly dncCount: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly hotLeads: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly automationScheduled: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly automationIdle: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly staleNewLeads: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly overdueFollowUps: FieldRef<"AiPerformanceMetric", 'Int'>
    readonly systemWarnings: FieldRef<"AiPerformanceMetric", 'Json'>
    readonly createdAt: FieldRef<"AiPerformanceMetric", 'DateTime'>
    readonly updatedAt: FieldRef<"AiPerformanceMetric", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiPerformanceMetric findUnique
   */
  export type AiPerformanceMetricFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPerformanceMetric
     */
    select?: AiPerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPerformanceMetric
     */
    omit?: AiPerformanceMetricOmit<ExtArgs> | null
    /**
     * Filter, which AiPerformanceMetric to fetch.
     */
    where: AiPerformanceMetricWhereUniqueInput
  }

  /**
   * AiPerformanceMetric findUniqueOrThrow
   */
  export type AiPerformanceMetricFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPerformanceMetric
     */
    select?: AiPerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPerformanceMetric
     */
    omit?: AiPerformanceMetricOmit<ExtArgs> | null
    /**
     * Filter, which AiPerformanceMetric to fetch.
     */
    where: AiPerformanceMetricWhereUniqueInput
  }

  /**
   * AiPerformanceMetric findFirst
   */
  export type AiPerformanceMetricFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPerformanceMetric
     */
    select?: AiPerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPerformanceMetric
     */
    omit?: AiPerformanceMetricOmit<ExtArgs> | null
    /**
     * Filter, which AiPerformanceMetric to fetch.
     */
    where?: AiPerformanceMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiPerformanceMetrics to fetch.
     */
    orderBy?: AiPerformanceMetricOrderByWithRelationInput | AiPerformanceMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiPerformanceMetrics.
     */
    cursor?: AiPerformanceMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiPerformanceMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiPerformanceMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiPerformanceMetrics.
     */
    distinct?: AiPerformanceMetricScalarFieldEnum | AiPerformanceMetricScalarFieldEnum[]
  }

  /**
   * AiPerformanceMetric findFirstOrThrow
   */
  export type AiPerformanceMetricFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPerformanceMetric
     */
    select?: AiPerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPerformanceMetric
     */
    omit?: AiPerformanceMetricOmit<ExtArgs> | null
    /**
     * Filter, which AiPerformanceMetric to fetch.
     */
    where?: AiPerformanceMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiPerformanceMetrics to fetch.
     */
    orderBy?: AiPerformanceMetricOrderByWithRelationInput | AiPerformanceMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiPerformanceMetrics.
     */
    cursor?: AiPerformanceMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiPerformanceMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiPerformanceMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiPerformanceMetrics.
     */
    distinct?: AiPerformanceMetricScalarFieldEnum | AiPerformanceMetricScalarFieldEnum[]
  }

  /**
   * AiPerformanceMetric findMany
   */
  export type AiPerformanceMetricFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPerformanceMetric
     */
    select?: AiPerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPerformanceMetric
     */
    omit?: AiPerformanceMetricOmit<ExtArgs> | null
    /**
     * Filter, which AiPerformanceMetrics to fetch.
     */
    where?: AiPerformanceMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiPerformanceMetrics to fetch.
     */
    orderBy?: AiPerformanceMetricOrderByWithRelationInput | AiPerformanceMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiPerformanceMetrics.
     */
    cursor?: AiPerformanceMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiPerformanceMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiPerformanceMetrics.
     */
    skip?: number
    distinct?: AiPerformanceMetricScalarFieldEnum | AiPerformanceMetricScalarFieldEnum[]
  }

  /**
   * AiPerformanceMetric create
   */
  export type AiPerformanceMetricCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPerformanceMetric
     */
    select?: AiPerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPerformanceMetric
     */
    omit?: AiPerformanceMetricOmit<ExtArgs> | null
    /**
     * The data needed to create a AiPerformanceMetric.
     */
    data: XOR<AiPerformanceMetricCreateInput, AiPerformanceMetricUncheckedCreateInput>
  }

  /**
   * AiPerformanceMetric createMany
   */
  export type AiPerformanceMetricCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiPerformanceMetrics.
     */
    data: AiPerformanceMetricCreateManyInput | AiPerformanceMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiPerformanceMetric createManyAndReturn
   */
  export type AiPerformanceMetricCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPerformanceMetric
     */
    select?: AiPerformanceMetricSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiPerformanceMetric
     */
    omit?: AiPerformanceMetricOmit<ExtArgs> | null
    /**
     * The data used to create many AiPerformanceMetrics.
     */
    data: AiPerformanceMetricCreateManyInput | AiPerformanceMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiPerformanceMetric update
   */
  export type AiPerformanceMetricUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPerformanceMetric
     */
    select?: AiPerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPerformanceMetric
     */
    omit?: AiPerformanceMetricOmit<ExtArgs> | null
    /**
     * The data needed to update a AiPerformanceMetric.
     */
    data: XOR<AiPerformanceMetricUpdateInput, AiPerformanceMetricUncheckedUpdateInput>
    /**
     * Choose, which AiPerformanceMetric to update.
     */
    where: AiPerformanceMetricWhereUniqueInput
  }

  /**
   * AiPerformanceMetric updateMany
   */
  export type AiPerformanceMetricUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiPerformanceMetrics.
     */
    data: XOR<AiPerformanceMetricUpdateManyMutationInput, AiPerformanceMetricUncheckedUpdateManyInput>
    /**
     * Filter which AiPerformanceMetrics to update
     */
    where?: AiPerformanceMetricWhereInput
    /**
     * Limit how many AiPerformanceMetrics to update.
     */
    limit?: number
  }

  /**
   * AiPerformanceMetric updateManyAndReturn
   */
  export type AiPerformanceMetricUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPerformanceMetric
     */
    select?: AiPerformanceMetricSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiPerformanceMetric
     */
    omit?: AiPerformanceMetricOmit<ExtArgs> | null
    /**
     * The data used to update AiPerformanceMetrics.
     */
    data: XOR<AiPerformanceMetricUpdateManyMutationInput, AiPerformanceMetricUncheckedUpdateManyInput>
    /**
     * Filter which AiPerformanceMetrics to update
     */
    where?: AiPerformanceMetricWhereInput
    /**
     * Limit how many AiPerformanceMetrics to update.
     */
    limit?: number
  }

  /**
   * AiPerformanceMetric upsert
   */
  export type AiPerformanceMetricUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPerformanceMetric
     */
    select?: AiPerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPerformanceMetric
     */
    omit?: AiPerformanceMetricOmit<ExtArgs> | null
    /**
     * The filter to search for the AiPerformanceMetric to update in case it exists.
     */
    where: AiPerformanceMetricWhereUniqueInput
    /**
     * In case the AiPerformanceMetric found by the `where` argument doesn't exist, create a new AiPerformanceMetric with this data.
     */
    create: XOR<AiPerformanceMetricCreateInput, AiPerformanceMetricUncheckedCreateInput>
    /**
     * In case the AiPerformanceMetric was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiPerformanceMetricUpdateInput, AiPerformanceMetricUncheckedUpdateInput>
  }

  /**
   * AiPerformanceMetric delete
   */
  export type AiPerformanceMetricDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPerformanceMetric
     */
    select?: AiPerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPerformanceMetric
     */
    omit?: AiPerformanceMetricOmit<ExtArgs> | null
    /**
     * Filter which AiPerformanceMetric to delete.
     */
    where: AiPerformanceMetricWhereUniqueInput
  }

  /**
   * AiPerformanceMetric deleteMany
   */
  export type AiPerformanceMetricDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiPerformanceMetrics to delete
     */
    where?: AiPerformanceMetricWhereInput
    /**
     * Limit how many AiPerformanceMetrics to delete.
     */
    limit?: number
  }

  /**
   * AiPerformanceMetric without action
   */
  export type AiPerformanceMetricDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiPerformanceMetric
     */
    select?: AiPerformanceMetricSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiPerformanceMetric
     */
    omit?: AiPerformanceMetricOmit<ExtArgs> | null
  }


  /**
   * Model AiJob
   */

  export type AggregateAiJob = {
    _count: AiJobCountAggregateOutputType | null
    _min: AiJobMinAggregateOutputType | null
    _max: AiJobMaxAggregateOutputType | null
  }

  export type AiJobMinAggregateOutputType = {
    id: string | null
    status: string | null
    startedAt: Date | null
    completedAt: Date | null
    errorMessage: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiJobMaxAggregateOutputType = {
    id: string | null
    status: string | null
    startedAt: Date | null
    completedAt: Date | null
    errorMessage: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AiJobCountAggregateOutputType = {
    id: number
    status: number
    startedAt: number
    completedAt: number
    errorMessage: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AiJobMinAggregateInputType = {
    id?: true
    status?: true
    startedAt?: true
    completedAt?: true
    errorMessage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiJobMaxAggregateInputType = {
    id?: true
    status?: true
    startedAt?: true
    completedAt?: true
    errorMessage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AiJobCountAggregateInputType = {
    id?: true
    status?: true
    startedAt?: true
    completedAt?: true
    errorMessage?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AiJobAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiJob to aggregate.
     */
    where?: AiJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiJobs to fetch.
     */
    orderBy?: AiJobOrderByWithRelationInput | AiJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiJobs
    **/
    _count?: true | AiJobCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiJobMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiJobMaxAggregateInputType
  }

  export type GetAiJobAggregateType<T extends AiJobAggregateArgs> = {
        [P in keyof T & keyof AggregateAiJob]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiJob[P]>
      : GetScalarType<T[P], AggregateAiJob[P]>
  }




  export type AiJobGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiJobWhereInput
    orderBy?: AiJobOrderByWithAggregationInput | AiJobOrderByWithAggregationInput[]
    by: AiJobScalarFieldEnum[] | AiJobScalarFieldEnum
    having?: AiJobScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiJobCountAggregateInputType | true
    _min?: AiJobMinAggregateInputType
    _max?: AiJobMaxAggregateInputType
  }

  export type AiJobGroupByOutputType = {
    id: string
    status: string
    startedAt: Date
    completedAt: Date | null
    errorMessage: string | null
    createdAt: Date
    updatedAt: Date
    _count: AiJobCountAggregateOutputType | null
    _min: AiJobMinAggregateOutputType | null
    _max: AiJobMaxAggregateOutputType | null
  }

  type GetAiJobGroupByPayload<T extends AiJobGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiJobGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiJobGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiJobGroupByOutputType[P]>
            : GetScalarType<T[P], AiJobGroupByOutputType[P]>
        }
      >
    >


  export type AiJobSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    actions?: boolean | AiJob$actionsArgs<ExtArgs>
    logs?: boolean | AiJob$logsArgs<ExtArgs>
    _count?: boolean | AiJobCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiJob"]>

  export type AiJobSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiJob"]>

  export type AiJobSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["aiJob"]>

  export type AiJobSelectScalar = {
    id?: boolean
    status?: boolean
    startedAt?: boolean
    completedAt?: boolean
    errorMessage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AiJobOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "status" | "startedAt" | "completedAt" | "errorMessage" | "createdAt" | "updatedAt", ExtArgs["result"]["aiJob"]>
  export type AiJobInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actions?: boolean | AiJob$actionsArgs<ExtArgs>
    logs?: boolean | AiJob$logsArgs<ExtArgs>
    _count?: boolean | AiJobCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AiJobIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AiJobIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AiJobPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiJob"
    objects: {
      actions: Prisma.$AiJobActionPayload<ExtArgs>[]
      logs: Prisma.$AiJobLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      status: string
      startedAt: Date
      completedAt: Date | null
      errorMessage: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["aiJob"]>
    composites: {}
  }

  type AiJobGetPayload<S extends boolean | null | undefined | AiJobDefaultArgs> = $Result.GetResult<Prisma.$AiJobPayload, S>

  type AiJobCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiJobFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiJobCountAggregateInputType | true
    }

  export interface AiJobDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiJob'], meta: { name: 'AiJob' } }
    /**
     * Find zero or one AiJob that matches the filter.
     * @param {AiJobFindUniqueArgs} args - Arguments to find a AiJob
     * @example
     * // Get one AiJob
     * const aiJob = await prisma.aiJob.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiJobFindUniqueArgs>(args: SelectSubset<T, AiJobFindUniqueArgs<ExtArgs>>): Prisma__AiJobClient<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiJob that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiJobFindUniqueOrThrowArgs} args - Arguments to find a AiJob
     * @example
     * // Get one AiJob
     * const aiJob = await prisma.aiJob.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiJobFindUniqueOrThrowArgs>(args: SelectSubset<T, AiJobFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiJobClient<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiJob that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobFindFirstArgs} args - Arguments to find a AiJob
     * @example
     * // Get one AiJob
     * const aiJob = await prisma.aiJob.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiJobFindFirstArgs>(args?: SelectSubset<T, AiJobFindFirstArgs<ExtArgs>>): Prisma__AiJobClient<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiJob that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobFindFirstOrThrowArgs} args - Arguments to find a AiJob
     * @example
     * // Get one AiJob
     * const aiJob = await prisma.aiJob.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiJobFindFirstOrThrowArgs>(args?: SelectSubset<T, AiJobFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiJobClient<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiJobs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiJobs
     * const aiJobs = await prisma.aiJob.findMany()
     * 
     * // Get first 10 AiJobs
     * const aiJobs = await prisma.aiJob.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiJobWithIdOnly = await prisma.aiJob.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiJobFindManyArgs>(args?: SelectSubset<T, AiJobFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiJob.
     * @param {AiJobCreateArgs} args - Arguments to create a AiJob.
     * @example
     * // Create one AiJob
     * const AiJob = await prisma.aiJob.create({
     *   data: {
     *     // ... data to create a AiJob
     *   }
     * })
     * 
     */
    create<T extends AiJobCreateArgs>(args: SelectSubset<T, AiJobCreateArgs<ExtArgs>>): Prisma__AiJobClient<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiJobs.
     * @param {AiJobCreateManyArgs} args - Arguments to create many AiJobs.
     * @example
     * // Create many AiJobs
     * const aiJob = await prisma.aiJob.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiJobCreateManyArgs>(args?: SelectSubset<T, AiJobCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiJobs and returns the data saved in the database.
     * @param {AiJobCreateManyAndReturnArgs} args - Arguments to create many AiJobs.
     * @example
     * // Create many AiJobs
     * const aiJob = await prisma.aiJob.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiJobs and only return the `id`
     * const aiJobWithIdOnly = await prisma.aiJob.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiJobCreateManyAndReturnArgs>(args?: SelectSubset<T, AiJobCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiJob.
     * @param {AiJobDeleteArgs} args - Arguments to delete one AiJob.
     * @example
     * // Delete one AiJob
     * const AiJob = await prisma.aiJob.delete({
     *   where: {
     *     // ... filter to delete one AiJob
     *   }
     * })
     * 
     */
    delete<T extends AiJobDeleteArgs>(args: SelectSubset<T, AiJobDeleteArgs<ExtArgs>>): Prisma__AiJobClient<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiJob.
     * @param {AiJobUpdateArgs} args - Arguments to update one AiJob.
     * @example
     * // Update one AiJob
     * const aiJob = await prisma.aiJob.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiJobUpdateArgs>(args: SelectSubset<T, AiJobUpdateArgs<ExtArgs>>): Prisma__AiJobClient<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiJobs.
     * @param {AiJobDeleteManyArgs} args - Arguments to filter AiJobs to delete.
     * @example
     * // Delete a few AiJobs
     * const { count } = await prisma.aiJob.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiJobDeleteManyArgs>(args?: SelectSubset<T, AiJobDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiJobs
     * const aiJob = await prisma.aiJob.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiJobUpdateManyArgs>(args: SelectSubset<T, AiJobUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiJobs and returns the data updated in the database.
     * @param {AiJobUpdateManyAndReturnArgs} args - Arguments to update many AiJobs.
     * @example
     * // Update many AiJobs
     * const aiJob = await prisma.aiJob.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiJobs and only return the `id`
     * const aiJobWithIdOnly = await prisma.aiJob.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiJobUpdateManyAndReturnArgs>(args: SelectSubset<T, AiJobUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiJob.
     * @param {AiJobUpsertArgs} args - Arguments to update or create a AiJob.
     * @example
     * // Update or create a AiJob
     * const aiJob = await prisma.aiJob.upsert({
     *   create: {
     *     // ... data to create a AiJob
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiJob we want to update
     *   }
     * })
     */
    upsert<T extends AiJobUpsertArgs>(args: SelectSubset<T, AiJobUpsertArgs<ExtArgs>>): Prisma__AiJobClient<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiJobs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobCountArgs} args - Arguments to filter AiJobs to count.
     * @example
     * // Count the number of AiJobs
     * const count = await prisma.aiJob.count({
     *   where: {
     *     // ... the filter for the AiJobs we want to count
     *   }
     * })
    **/
    count<T extends AiJobCountArgs>(
      args?: Subset<T, AiJobCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiJobCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiJobAggregateArgs>(args: Subset<T, AiJobAggregateArgs>): Prisma.PrismaPromise<GetAiJobAggregateType<T>>

    /**
     * Group by AiJob.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiJobGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiJobGroupByArgs['orderBy'] }
        : { orderBy?: AiJobGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiJobGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiJobGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiJob model
   */
  readonly fields: AiJobFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiJob.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiJobClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    actions<T extends AiJob$actionsArgs<ExtArgs> = {}>(args?: Subset<T, AiJob$actionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiJobActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    logs<T extends AiJob$logsArgs<ExtArgs> = {}>(args?: Subset<T, AiJob$logsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiJobLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiJob model
   */
  interface AiJobFieldRefs {
    readonly id: FieldRef<"AiJob", 'String'>
    readonly status: FieldRef<"AiJob", 'String'>
    readonly startedAt: FieldRef<"AiJob", 'DateTime'>
    readonly completedAt: FieldRef<"AiJob", 'DateTime'>
    readonly errorMessage: FieldRef<"AiJob", 'String'>
    readonly createdAt: FieldRef<"AiJob", 'DateTime'>
    readonly updatedAt: FieldRef<"AiJob", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiJob findUnique
   */
  export type AiJobFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJob
     */
    select?: AiJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJob
     */
    omit?: AiJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobInclude<ExtArgs> | null
    /**
     * Filter, which AiJob to fetch.
     */
    where: AiJobWhereUniqueInput
  }

  /**
   * AiJob findUniqueOrThrow
   */
  export type AiJobFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJob
     */
    select?: AiJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJob
     */
    omit?: AiJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobInclude<ExtArgs> | null
    /**
     * Filter, which AiJob to fetch.
     */
    where: AiJobWhereUniqueInput
  }

  /**
   * AiJob findFirst
   */
  export type AiJobFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJob
     */
    select?: AiJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJob
     */
    omit?: AiJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobInclude<ExtArgs> | null
    /**
     * Filter, which AiJob to fetch.
     */
    where?: AiJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiJobs to fetch.
     */
    orderBy?: AiJobOrderByWithRelationInput | AiJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiJobs.
     */
    cursor?: AiJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiJobs.
     */
    distinct?: AiJobScalarFieldEnum | AiJobScalarFieldEnum[]
  }

  /**
   * AiJob findFirstOrThrow
   */
  export type AiJobFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJob
     */
    select?: AiJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJob
     */
    omit?: AiJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobInclude<ExtArgs> | null
    /**
     * Filter, which AiJob to fetch.
     */
    where?: AiJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiJobs to fetch.
     */
    orderBy?: AiJobOrderByWithRelationInput | AiJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiJobs.
     */
    cursor?: AiJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiJobs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiJobs.
     */
    distinct?: AiJobScalarFieldEnum | AiJobScalarFieldEnum[]
  }

  /**
   * AiJob findMany
   */
  export type AiJobFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJob
     */
    select?: AiJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJob
     */
    omit?: AiJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobInclude<ExtArgs> | null
    /**
     * Filter, which AiJobs to fetch.
     */
    where?: AiJobWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiJobs to fetch.
     */
    orderBy?: AiJobOrderByWithRelationInput | AiJobOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiJobs.
     */
    cursor?: AiJobWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiJobs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiJobs.
     */
    skip?: number
    distinct?: AiJobScalarFieldEnum | AiJobScalarFieldEnum[]
  }

  /**
   * AiJob create
   */
  export type AiJobCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJob
     */
    select?: AiJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJob
     */
    omit?: AiJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobInclude<ExtArgs> | null
    /**
     * The data needed to create a AiJob.
     */
    data: XOR<AiJobCreateInput, AiJobUncheckedCreateInput>
  }

  /**
   * AiJob createMany
   */
  export type AiJobCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiJobs.
     */
    data: AiJobCreateManyInput | AiJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiJob createManyAndReturn
   */
  export type AiJobCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJob
     */
    select?: AiJobSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiJob
     */
    omit?: AiJobOmit<ExtArgs> | null
    /**
     * The data used to create many AiJobs.
     */
    data: AiJobCreateManyInput | AiJobCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiJob update
   */
  export type AiJobUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJob
     */
    select?: AiJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJob
     */
    omit?: AiJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobInclude<ExtArgs> | null
    /**
     * The data needed to update a AiJob.
     */
    data: XOR<AiJobUpdateInput, AiJobUncheckedUpdateInput>
    /**
     * Choose, which AiJob to update.
     */
    where: AiJobWhereUniqueInput
  }

  /**
   * AiJob updateMany
   */
  export type AiJobUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiJobs.
     */
    data: XOR<AiJobUpdateManyMutationInput, AiJobUncheckedUpdateManyInput>
    /**
     * Filter which AiJobs to update
     */
    where?: AiJobWhereInput
    /**
     * Limit how many AiJobs to update.
     */
    limit?: number
  }

  /**
   * AiJob updateManyAndReturn
   */
  export type AiJobUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJob
     */
    select?: AiJobSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiJob
     */
    omit?: AiJobOmit<ExtArgs> | null
    /**
     * The data used to update AiJobs.
     */
    data: XOR<AiJobUpdateManyMutationInput, AiJobUncheckedUpdateManyInput>
    /**
     * Filter which AiJobs to update
     */
    where?: AiJobWhereInput
    /**
     * Limit how many AiJobs to update.
     */
    limit?: number
  }

  /**
   * AiJob upsert
   */
  export type AiJobUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJob
     */
    select?: AiJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJob
     */
    omit?: AiJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobInclude<ExtArgs> | null
    /**
     * The filter to search for the AiJob to update in case it exists.
     */
    where: AiJobWhereUniqueInput
    /**
     * In case the AiJob found by the `where` argument doesn't exist, create a new AiJob with this data.
     */
    create: XOR<AiJobCreateInput, AiJobUncheckedCreateInput>
    /**
     * In case the AiJob was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiJobUpdateInput, AiJobUncheckedUpdateInput>
  }

  /**
   * AiJob delete
   */
  export type AiJobDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJob
     */
    select?: AiJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJob
     */
    omit?: AiJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobInclude<ExtArgs> | null
    /**
     * Filter which AiJob to delete.
     */
    where: AiJobWhereUniqueInput
  }

  /**
   * AiJob deleteMany
   */
  export type AiJobDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiJobs to delete
     */
    where?: AiJobWhereInput
    /**
     * Limit how many AiJobs to delete.
     */
    limit?: number
  }

  /**
   * AiJob.actions
   */
  export type AiJob$actionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionInclude<ExtArgs> | null
    where?: AiJobActionWhereInput
    orderBy?: AiJobActionOrderByWithRelationInput | AiJobActionOrderByWithRelationInput[]
    cursor?: AiJobActionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AiJobActionScalarFieldEnum | AiJobActionScalarFieldEnum[]
  }

  /**
   * AiJob.logs
   */
  export type AiJob$logsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogInclude<ExtArgs> | null
    where?: AiJobLogWhereInput
    orderBy?: AiJobLogOrderByWithRelationInput | AiJobLogOrderByWithRelationInput[]
    cursor?: AiJobLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AiJobLogScalarFieldEnum | AiJobLogScalarFieldEnum[]
  }

  /**
   * AiJob without action
   */
  export type AiJobDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJob
     */
    select?: AiJobSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJob
     */
    omit?: AiJobOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobInclude<ExtArgs> | null
  }


  /**
   * Model AiJobAction
   */

  export type AggregateAiJobAction = {
    _count: AiJobActionCountAggregateOutputType | null
    _avg: AiJobActionAvgAggregateOutputType | null
    _sum: AiJobActionSumAggregateOutputType | null
    _min: AiJobActionMinAggregateOutputType | null
    _max: AiJobActionMaxAggregateOutputType | null
  }

  export type AiJobActionAvgAggregateOutputType = {
    count: number | null
  }

  export type AiJobActionSumAggregateOutputType = {
    count: number | null
  }

  export type AiJobActionMinAggregateOutputType = {
    id: string | null
    jobId: string | null
    action: string | null
    count: number | null
    createdAt: Date | null
  }

  export type AiJobActionMaxAggregateOutputType = {
    id: string | null
    jobId: string | null
    action: string | null
    count: number | null
    createdAt: Date | null
  }

  export type AiJobActionCountAggregateOutputType = {
    id: number
    jobId: number
    action: number
    count: number
    createdAt: number
    _all: number
  }


  export type AiJobActionAvgAggregateInputType = {
    count?: true
  }

  export type AiJobActionSumAggregateInputType = {
    count?: true
  }

  export type AiJobActionMinAggregateInputType = {
    id?: true
    jobId?: true
    action?: true
    count?: true
    createdAt?: true
  }

  export type AiJobActionMaxAggregateInputType = {
    id?: true
    jobId?: true
    action?: true
    count?: true
    createdAt?: true
  }

  export type AiJobActionCountAggregateInputType = {
    id?: true
    jobId?: true
    action?: true
    count?: true
    createdAt?: true
    _all?: true
  }

  export type AiJobActionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiJobAction to aggregate.
     */
    where?: AiJobActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiJobActions to fetch.
     */
    orderBy?: AiJobActionOrderByWithRelationInput | AiJobActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiJobActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiJobActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiJobActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiJobActions
    **/
    _count?: true | AiJobActionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiJobActionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiJobActionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiJobActionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiJobActionMaxAggregateInputType
  }

  export type GetAiJobActionAggregateType<T extends AiJobActionAggregateArgs> = {
        [P in keyof T & keyof AggregateAiJobAction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiJobAction[P]>
      : GetScalarType<T[P], AggregateAiJobAction[P]>
  }




  export type AiJobActionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiJobActionWhereInput
    orderBy?: AiJobActionOrderByWithAggregationInput | AiJobActionOrderByWithAggregationInput[]
    by: AiJobActionScalarFieldEnum[] | AiJobActionScalarFieldEnum
    having?: AiJobActionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiJobActionCountAggregateInputType | true
    _avg?: AiJobActionAvgAggregateInputType
    _sum?: AiJobActionSumAggregateInputType
    _min?: AiJobActionMinAggregateInputType
    _max?: AiJobActionMaxAggregateInputType
  }

  export type AiJobActionGroupByOutputType = {
    id: string
    jobId: string
    action: string
    count: number
    createdAt: Date
    _count: AiJobActionCountAggregateOutputType | null
    _avg: AiJobActionAvgAggregateOutputType | null
    _sum: AiJobActionSumAggregateOutputType | null
    _min: AiJobActionMinAggregateOutputType | null
    _max: AiJobActionMaxAggregateOutputType | null
  }

  type GetAiJobActionGroupByPayload<T extends AiJobActionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiJobActionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiJobActionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiJobActionGroupByOutputType[P]>
            : GetScalarType<T[P], AiJobActionGroupByOutputType[P]>
        }
      >
    >


  export type AiJobActionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    action?: boolean
    count?: boolean
    createdAt?: boolean
    job?: boolean | AiJobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiJobAction"]>

  export type AiJobActionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    action?: boolean
    count?: boolean
    createdAt?: boolean
    job?: boolean | AiJobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiJobAction"]>

  export type AiJobActionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    action?: boolean
    count?: boolean
    createdAt?: boolean
    job?: boolean | AiJobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiJobAction"]>

  export type AiJobActionSelectScalar = {
    id?: boolean
    jobId?: boolean
    action?: boolean
    count?: boolean
    createdAt?: boolean
  }

  export type AiJobActionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "jobId" | "action" | "count" | "createdAt", ExtArgs["result"]["aiJobAction"]>
  export type AiJobActionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | AiJobDefaultArgs<ExtArgs>
  }
  export type AiJobActionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | AiJobDefaultArgs<ExtArgs>
  }
  export type AiJobActionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | AiJobDefaultArgs<ExtArgs>
  }

  export type $AiJobActionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiJobAction"
    objects: {
      job: Prisma.$AiJobPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      jobId: string
      action: string
      count: number
      createdAt: Date
    }, ExtArgs["result"]["aiJobAction"]>
    composites: {}
  }

  type AiJobActionGetPayload<S extends boolean | null | undefined | AiJobActionDefaultArgs> = $Result.GetResult<Prisma.$AiJobActionPayload, S>

  type AiJobActionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiJobActionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiJobActionCountAggregateInputType | true
    }

  export interface AiJobActionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiJobAction'], meta: { name: 'AiJobAction' } }
    /**
     * Find zero or one AiJobAction that matches the filter.
     * @param {AiJobActionFindUniqueArgs} args - Arguments to find a AiJobAction
     * @example
     * // Get one AiJobAction
     * const aiJobAction = await prisma.aiJobAction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiJobActionFindUniqueArgs>(args: SelectSubset<T, AiJobActionFindUniqueArgs<ExtArgs>>): Prisma__AiJobActionClient<$Result.GetResult<Prisma.$AiJobActionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiJobAction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiJobActionFindUniqueOrThrowArgs} args - Arguments to find a AiJobAction
     * @example
     * // Get one AiJobAction
     * const aiJobAction = await prisma.aiJobAction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiJobActionFindUniqueOrThrowArgs>(args: SelectSubset<T, AiJobActionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiJobActionClient<$Result.GetResult<Prisma.$AiJobActionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiJobAction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobActionFindFirstArgs} args - Arguments to find a AiJobAction
     * @example
     * // Get one AiJobAction
     * const aiJobAction = await prisma.aiJobAction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiJobActionFindFirstArgs>(args?: SelectSubset<T, AiJobActionFindFirstArgs<ExtArgs>>): Prisma__AiJobActionClient<$Result.GetResult<Prisma.$AiJobActionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiJobAction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobActionFindFirstOrThrowArgs} args - Arguments to find a AiJobAction
     * @example
     * // Get one AiJobAction
     * const aiJobAction = await prisma.aiJobAction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiJobActionFindFirstOrThrowArgs>(args?: SelectSubset<T, AiJobActionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiJobActionClient<$Result.GetResult<Prisma.$AiJobActionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiJobActions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobActionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiJobActions
     * const aiJobActions = await prisma.aiJobAction.findMany()
     * 
     * // Get first 10 AiJobActions
     * const aiJobActions = await prisma.aiJobAction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiJobActionWithIdOnly = await prisma.aiJobAction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiJobActionFindManyArgs>(args?: SelectSubset<T, AiJobActionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiJobActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiJobAction.
     * @param {AiJobActionCreateArgs} args - Arguments to create a AiJobAction.
     * @example
     * // Create one AiJobAction
     * const AiJobAction = await prisma.aiJobAction.create({
     *   data: {
     *     // ... data to create a AiJobAction
     *   }
     * })
     * 
     */
    create<T extends AiJobActionCreateArgs>(args: SelectSubset<T, AiJobActionCreateArgs<ExtArgs>>): Prisma__AiJobActionClient<$Result.GetResult<Prisma.$AiJobActionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiJobActions.
     * @param {AiJobActionCreateManyArgs} args - Arguments to create many AiJobActions.
     * @example
     * // Create many AiJobActions
     * const aiJobAction = await prisma.aiJobAction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiJobActionCreateManyArgs>(args?: SelectSubset<T, AiJobActionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiJobActions and returns the data saved in the database.
     * @param {AiJobActionCreateManyAndReturnArgs} args - Arguments to create many AiJobActions.
     * @example
     * // Create many AiJobActions
     * const aiJobAction = await prisma.aiJobAction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiJobActions and only return the `id`
     * const aiJobActionWithIdOnly = await prisma.aiJobAction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiJobActionCreateManyAndReturnArgs>(args?: SelectSubset<T, AiJobActionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiJobActionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiJobAction.
     * @param {AiJobActionDeleteArgs} args - Arguments to delete one AiJobAction.
     * @example
     * // Delete one AiJobAction
     * const AiJobAction = await prisma.aiJobAction.delete({
     *   where: {
     *     // ... filter to delete one AiJobAction
     *   }
     * })
     * 
     */
    delete<T extends AiJobActionDeleteArgs>(args: SelectSubset<T, AiJobActionDeleteArgs<ExtArgs>>): Prisma__AiJobActionClient<$Result.GetResult<Prisma.$AiJobActionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiJobAction.
     * @param {AiJobActionUpdateArgs} args - Arguments to update one AiJobAction.
     * @example
     * // Update one AiJobAction
     * const aiJobAction = await prisma.aiJobAction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiJobActionUpdateArgs>(args: SelectSubset<T, AiJobActionUpdateArgs<ExtArgs>>): Prisma__AiJobActionClient<$Result.GetResult<Prisma.$AiJobActionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiJobActions.
     * @param {AiJobActionDeleteManyArgs} args - Arguments to filter AiJobActions to delete.
     * @example
     * // Delete a few AiJobActions
     * const { count } = await prisma.aiJobAction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiJobActionDeleteManyArgs>(args?: SelectSubset<T, AiJobActionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiJobActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobActionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiJobActions
     * const aiJobAction = await prisma.aiJobAction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiJobActionUpdateManyArgs>(args: SelectSubset<T, AiJobActionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiJobActions and returns the data updated in the database.
     * @param {AiJobActionUpdateManyAndReturnArgs} args - Arguments to update many AiJobActions.
     * @example
     * // Update many AiJobActions
     * const aiJobAction = await prisma.aiJobAction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiJobActions and only return the `id`
     * const aiJobActionWithIdOnly = await prisma.aiJobAction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiJobActionUpdateManyAndReturnArgs>(args: SelectSubset<T, AiJobActionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiJobActionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiJobAction.
     * @param {AiJobActionUpsertArgs} args - Arguments to update or create a AiJobAction.
     * @example
     * // Update or create a AiJobAction
     * const aiJobAction = await prisma.aiJobAction.upsert({
     *   create: {
     *     // ... data to create a AiJobAction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiJobAction we want to update
     *   }
     * })
     */
    upsert<T extends AiJobActionUpsertArgs>(args: SelectSubset<T, AiJobActionUpsertArgs<ExtArgs>>): Prisma__AiJobActionClient<$Result.GetResult<Prisma.$AiJobActionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiJobActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobActionCountArgs} args - Arguments to filter AiJobActions to count.
     * @example
     * // Count the number of AiJobActions
     * const count = await prisma.aiJobAction.count({
     *   where: {
     *     // ... the filter for the AiJobActions we want to count
     *   }
     * })
    **/
    count<T extends AiJobActionCountArgs>(
      args?: Subset<T, AiJobActionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiJobActionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiJobAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobActionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiJobActionAggregateArgs>(args: Subset<T, AiJobActionAggregateArgs>): Prisma.PrismaPromise<GetAiJobActionAggregateType<T>>

    /**
     * Group by AiJobAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobActionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiJobActionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiJobActionGroupByArgs['orderBy'] }
        : { orderBy?: AiJobActionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiJobActionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiJobActionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiJobAction model
   */
  readonly fields: AiJobActionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiJobAction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiJobActionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    job<T extends AiJobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AiJobDefaultArgs<ExtArgs>>): Prisma__AiJobClient<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiJobAction model
   */
  interface AiJobActionFieldRefs {
    readonly id: FieldRef<"AiJobAction", 'String'>
    readonly jobId: FieldRef<"AiJobAction", 'String'>
    readonly action: FieldRef<"AiJobAction", 'String'>
    readonly count: FieldRef<"AiJobAction", 'Int'>
    readonly createdAt: FieldRef<"AiJobAction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiJobAction findUnique
   */
  export type AiJobActionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionInclude<ExtArgs> | null
    /**
     * Filter, which AiJobAction to fetch.
     */
    where: AiJobActionWhereUniqueInput
  }

  /**
   * AiJobAction findUniqueOrThrow
   */
  export type AiJobActionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionInclude<ExtArgs> | null
    /**
     * Filter, which AiJobAction to fetch.
     */
    where: AiJobActionWhereUniqueInput
  }

  /**
   * AiJobAction findFirst
   */
  export type AiJobActionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionInclude<ExtArgs> | null
    /**
     * Filter, which AiJobAction to fetch.
     */
    where?: AiJobActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiJobActions to fetch.
     */
    orderBy?: AiJobActionOrderByWithRelationInput | AiJobActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiJobActions.
     */
    cursor?: AiJobActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiJobActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiJobActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiJobActions.
     */
    distinct?: AiJobActionScalarFieldEnum | AiJobActionScalarFieldEnum[]
  }

  /**
   * AiJobAction findFirstOrThrow
   */
  export type AiJobActionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionInclude<ExtArgs> | null
    /**
     * Filter, which AiJobAction to fetch.
     */
    where?: AiJobActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiJobActions to fetch.
     */
    orderBy?: AiJobActionOrderByWithRelationInput | AiJobActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiJobActions.
     */
    cursor?: AiJobActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiJobActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiJobActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiJobActions.
     */
    distinct?: AiJobActionScalarFieldEnum | AiJobActionScalarFieldEnum[]
  }

  /**
   * AiJobAction findMany
   */
  export type AiJobActionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionInclude<ExtArgs> | null
    /**
     * Filter, which AiJobActions to fetch.
     */
    where?: AiJobActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiJobActions to fetch.
     */
    orderBy?: AiJobActionOrderByWithRelationInput | AiJobActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiJobActions.
     */
    cursor?: AiJobActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiJobActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiJobActions.
     */
    skip?: number
    distinct?: AiJobActionScalarFieldEnum | AiJobActionScalarFieldEnum[]
  }

  /**
   * AiJobAction create
   */
  export type AiJobActionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionInclude<ExtArgs> | null
    /**
     * The data needed to create a AiJobAction.
     */
    data: XOR<AiJobActionCreateInput, AiJobActionUncheckedCreateInput>
  }

  /**
   * AiJobAction createMany
   */
  export type AiJobActionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiJobActions.
     */
    data: AiJobActionCreateManyInput | AiJobActionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiJobAction createManyAndReturn
   */
  export type AiJobActionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * The data used to create many AiJobActions.
     */
    data: AiJobActionCreateManyInput | AiJobActionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiJobAction update
   */
  export type AiJobActionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionInclude<ExtArgs> | null
    /**
     * The data needed to update a AiJobAction.
     */
    data: XOR<AiJobActionUpdateInput, AiJobActionUncheckedUpdateInput>
    /**
     * Choose, which AiJobAction to update.
     */
    where: AiJobActionWhereUniqueInput
  }

  /**
   * AiJobAction updateMany
   */
  export type AiJobActionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiJobActions.
     */
    data: XOR<AiJobActionUpdateManyMutationInput, AiJobActionUncheckedUpdateManyInput>
    /**
     * Filter which AiJobActions to update
     */
    where?: AiJobActionWhereInput
    /**
     * Limit how many AiJobActions to update.
     */
    limit?: number
  }

  /**
   * AiJobAction updateManyAndReturn
   */
  export type AiJobActionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * The data used to update AiJobActions.
     */
    data: XOR<AiJobActionUpdateManyMutationInput, AiJobActionUncheckedUpdateManyInput>
    /**
     * Filter which AiJobActions to update
     */
    where?: AiJobActionWhereInput
    /**
     * Limit how many AiJobActions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiJobAction upsert
   */
  export type AiJobActionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionInclude<ExtArgs> | null
    /**
     * The filter to search for the AiJobAction to update in case it exists.
     */
    where: AiJobActionWhereUniqueInput
    /**
     * In case the AiJobAction found by the `where` argument doesn't exist, create a new AiJobAction with this data.
     */
    create: XOR<AiJobActionCreateInput, AiJobActionUncheckedCreateInput>
    /**
     * In case the AiJobAction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiJobActionUpdateInput, AiJobActionUncheckedUpdateInput>
  }

  /**
   * AiJobAction delete
   */
  export type AiJobActionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionInclude<ExtArgs> | null
    /**
     * Filter which AiJobAction to delete.
     */
    where: AiJobActionWhereUniqueInput
  }

  /**
   * AiJobAction deleteMany
   */
  export type AiJobActionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiJobActions to delete
     */
    where?: AiJobActionWhereInput
    /**
     * Limit how many AiJobActions to delete.
     */
    limit?: number
  }

  /**
   * AiJobAction without action
   */
  export type AiJobActionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobAction
     */
    select?: AiJobActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobAction
     */
    omit?: AiJobActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobActionInclude<ExtArgs> | null
  }


  /**
   * Model AiJobLog
   */

  export type AggregateAiJobLog = {
    _count: AiJobLogCountAggregateOutputType | null
    _min: AiJobLogMinAggregateOutputType | null
    _max: AiJobLogMaxAggregateOutputType | null
  }

  export type AiJobLogMinAggregateOutputType = {
    id: string | null
    jobId: string | null
    level: string | null
    message: string | null
    createdAt: Date | null
  }

  export type AiJobLogMaxAggregateOutputType = {
    id: string | null
    jobId: string | null
    level: string | null
    message: string | null
    createdAt: Date | null
  }

  export type AiJobLogCountAggregateOutputType = {
    id: number
    jobId: number
    level: number
    message: number
    createdAt: number
    _all: number
  }


  export type AiJobLogMinAggregateInputType = {
    id?: true
    jobId?: true
    level?: true
    message?: true
    createdAt?: true
  }

  export type AiJobLogMaxAggregateInputType = {
    id?: true
    jobId?: true
    level?: true
    message?: true
    createdAt?: true
  }

  export type AiJobLogCountAggregateInputType = {
    id?: true
    jobId?: true
    level?: true
    message?: true
    createdAt?: true
    _all?: true
  }

  export type AiJobLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiJobLog to aggregate.
     */
    where?: AiJobLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiJobLogs to fetch.
     */
    orderBy?: AiJobLogOrderByWithRelationInput | AiJobLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiJobLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiJobLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiJobLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiJobLogs
    **/
    _count?: true | AiJobLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiJobLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiJobLogMaxAggregateInputType
  }

  export type GetAiJobLogAggregateType<T extends AiJobLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAiJobLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiJobLog[P]>
      : GetScalarType<T[P], AggregateAiJobLog[P]>
  }




  export type AiJobLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiJobLogWhereInput
    orderBy?: AiJobLogOrderByWithAggregationInput | AiJobLogOrderByWithAggregationInput[]
    by: AiJobLogScalarFieldEnum[] | AiJobLogScalarFieldEnum
    having?: AiJobLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiJobLogCountAggregateInputType | true
    _min?: AiJobLogMinAggregateInputType
    _max?: AiJobLogMaxAggregateInputType
  }

  export type AiJobLogGroupByOutputType = {
    id: string
    jobId: string
    level: string
    message: string
    createdAt: Date
    _count: AiJobLogCountAggregateOutputType | null
    _min: AiJobLogMinAggregateOutputType | null
    _max: AiJobLogMaxAggregateOutputType | null
  }

  type GetAiJobLogGroupByPayload<T extends AiJobLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiJobLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiJobLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiJobLogGroupByOutputType[P]>
            : GetScalarType<T[P], AiJobLogGroupByOutputType[P]>
        }
      >
    >


  export type AiJobLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    level?: boolean
    message?: boolean
    createdAt?: boolean
    job?: boolean | AiJobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiJobLog"]>

  export type AiJobLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    level?: boolean
    message?: boolean
    createdAt?: boolean
    job?: boolean | AiJobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiJobLog"]>

  export type AiJobLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    jobId?: boolean
    level?: boolean
    message?: boolean
    createdAt?: boolean
    job?: boolean | AiJobDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["aiJobLog"]>

  export type AiJobLogSelectScalar = {
    id?: boolean
    jobId?: boolean
    level?: boolean
    message?: boolean
    createdAt?: boolean
  }

  export type AiJobLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "jobId" | "level" | "message" | "createdAt", ExtArgs["result"]["aiJobLog"]>
  export type AiJobLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | AiJobDefaultArgs<ExtArgs>
  }
  export type AiJobLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | AiJobDefaultArgs<ExtArgs>
  }
  export type AiJobLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    job?: boolean | AiJobDefaultArgs<ExtArgs>
  }

  export type $AiJobLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiJobLog"
    objects: {
      job: Prisma.$AiJobPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      jobId: string
      level: string
      message: string
      createdAt: Date
    }, ExtArgs["result"]["aiJobLog"]>
    composites: {}
  }

  type AiJobLogGetPayload<S extends boolean | null | undefined | AiJobLogDefaultArgs> = $Result.GetResult<Prisma.$AiJobLogPayload, S>

  type AiJobLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiJobLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiJobLogCountAggregateInputType | true
    }

  export interface AiJobLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiJobLog'], meta: { name: 'AiJobLog' } }
    /**
     * Find zero or one AiJobLog that matches the filter.
     * @param {AiJobLogFindUniqueArgs} args - Arguments to find a AiJobLog
     * @example
     * // Get one AiJobLog
     * const aiJobLog = await prisma.aiJobLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiJobLogFindUniqueArgs>(args: SelectSubset<T, AiJobLogFindUniqueArgs<ExtArgs>>): Prisma__AiJobLogClient<$Result.GetResult<Prisma.$AiJobLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiJobLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiJobLogFindUniqueOrThrowArgs} args - Arguments to find a AiJobLog
     * @example
     * // Get one AiJobLog
     * const aiJobLog = await prisma.aiJobLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiJobLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AiJobLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiJobLogClient<$Result.GetResult<Prisma.$AiJobLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiJobLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobLogFindFirstArgs} args - Arguments to find a AiJobLog
     * @example
     * // Get one AiJobLog
     * const aiJobLog = await prisma.aiJobLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiJobLogFindFirstArgs>(args?: SelectSubset<T, AiJobLogFindFirstArgs<ExtArgs>>): Prisma__AiJobLogClient<$Result.GetResult<Prisma.$AiJobLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiJobLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobLogFindFirstOrThrowArgs} args - Arguments to find a AiJobLog
     * @example
     * // Get one AiJobLog
     * const aiJobLog = await prisma.aiJobLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiJobLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AiJobLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiJobLogClient<$Result.GetResult<Prisma.$AiJobLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiJobLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiJobLogs
     * const aiJobLogs = await prisma.aiJobLog.findMany()
     * 
     * // Get first 10 AiJobLogs
     * const aiJobLogs = await prisma.aiJobLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiJobLogWithIdOnly = await prisma.aiJobLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiJobLogFindManyArgs>(args?: SelectSubset<T, AiJobLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiJobLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiJobLog.
     * @param {AiJobLogCreateArgs} args - Arguments to create a AiJobLog.
     * @example
     * // Create one AiJobLog
     * const AiJobLog = await prisma.aiJobLog.create({
     *   data: {
     *     // ... data to create a AiJobLog
     *   }
     * })
     * 
     */
    create<T extends AiJobLogCreateArgs>(args: SelectSubset<T, AiJobLogCreateArgs<ExtArgs>>): Prisma__AiJobLogClient<$Result.GetResult<Prisma.$AiJobLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiJobLogs.
     * @param {AiJobLogCreateManyArgs} args - Arguments to create many AiJobLogs.
     * @example
     * // Create many AiJobLogs
     * const aiJobLog = await prisma.aiJobLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiJobLogCreateManyArgs>(args?: SelectSubset<T, AiJobLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiJobLogs and returns the data saved in the database.
     * @param {AiJobLogCreateManyAndReturnArgs} args - Arguments to create many AiJobLogs.
     * @example
     * // Create many AiJobLogs
     * const aiJobLog = await prisma.aiJobLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiJobLogs and only return the `id`
     * const aiJobLogWithIdOnly = await prisma.aiJobLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiJobLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AiJobLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiJobLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiJobLog.
     * @param {AiJobLogDeleteArgs} args - Arguments to delete one AiJobLog.
     * @example
     * // Delete one AiJobLog
     * const AiJobLog = await prisma.aiJobLog.delete({
     *   where: {
     *     // ... filter to delete one AiJobLog
     *   }
     * })
     * 
     */
    delete<T extends AiJobLogDeleteArgs>(args: SelectSubset<T, AiJobLogDeleteArgs<ExtArgs>>): Prisma__AiJobLogClient<$Result.GetResult<Prisma.$AiJobLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiJobLog.
     * @param {AiJobLogUpdateArgs} args - Arguments to update one AiJobLog.
     * @example
     * // Update one AiJobLog
     * const aiJobLog = await prisma.aiJobLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiJobLogUpdateArgs>(args: SelectSubset<T, AiJobLogUpdateArgs<ExtArgs>>): Prisma__AiJobLogClient<$Result.GetResult<Prisma.$AiJobLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiJobLogs.
     * @param {AiJobLogDeleteManyArgs} args - Arguments to filter AiJobLogs to delete.
     * @example
     * // Delete a few AiJobLogs
     * const { count } = await prisma.aiJobLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiJobLogDeleteManyArgs>(args?: SelectSubset<T, AiJobLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiJobLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiJobLogs
     * const aiJobLog = await prisma.aiJobLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiJobLogUpdateManyArgs>(args: SelectSubset<T, AiJobLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiJobLogs and returns the data updated in the database.
     * @param {AiJobLogUpdateManyAndReturnArgs} args - Arguments to update many AiJobLogs.
     * @example
     * // Update many AiJobLogs
     * const aiJobLog = await prisma.aiJobLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiJobLogs and only return the `id`
     * const aiJobLogWithIdOnly = await prisma.aiJobLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiJobLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AiJobLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiJobLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiJobLog.
     * @param {AiJobLogUpsertArgs} args - Arguments to update or create a AiJobLog.
     * @example
     * // Update or create a AiJobLog
     * const aiJobLog = await prisma.aiJobLog.upsert({
     *   create: {
     *     // ... data to create a AiJobLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiJobLog we want to update
     *   }
     * })
     */
    upsert<T extends AiJobLogUpsertArgs>(args: SelectSubset<T, AiJobLogUpsertArgs<ExtArgs>>): Prisma__AiJobLogClient<$Result.GetResult<Prisma.$AiJobLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiJobLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobLogCountArgs} args - Arguments to filter AiJobLogs to count.
     * @example
     * // Count the number of AiJobLogs
     * const count = await prisma.aiJobLog.count({
     *   where: {
     *     // ... the filter for the AiJobLogs we want to count
     *   }
     * })
    **/
    count<T extends AiJobLogCountArgs>(
      args?: Subset<T, AiJobLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiJobLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiJobLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiJobLogAggregateArgs>(args: Subset<T, AiJobLogAggregateArgs>): Prisma.PrismaPromise<GetAiJobLogAggregateType<T>>

    /**
     * Group by AiJobLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiJobLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiJobLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiJobLogGroupByArgs['orderBy'] }
        : { orderBy?: AiJobLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiJobLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiJobLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiJobLog model
   */
  readonly fields: AiJobLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiJobLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiJobLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    job<T extends AiJobDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AiJobDefaultArgs<ExtArgs>>): Prisma__AiJobClient<$Result.GetResult<Prisma.$AiJobPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiJobLog model
   */
  interface AiJobLogFieldRefs {
    readonly id: FieldRef<"AiJobLog", 'String'>
    readonly jobId: FieldRef<"AiJobLog", 'String'>
    readonly level: FieldRef<"AiJobLog", 'String'>
    readonly message: FieldRef<"AiJobLog", 'String'>
    readonly createdAt: FieldRef<"AiJobLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiJobLog findUnique
   */
  export type AiJobLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogInclude<ExtArgs> | null
    /**
     * Filter, which AiJobLog to fetch.
     */
    where: AiJobLogWhereUniqueInput
  }

  /**
   * AiJobLog findUniqueOrThrow
   */
  export type AiJobLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogInclude<ExtArgs> | null
    /**
     * Filter, which AiJobLog to fetch.
     */
    where: AiJobLogWhereUniqueInput
  }

  /**
   * AiJobLog findFirst
   */
  export type AiJobLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogInclude<ExtArgs> | null
    /**
     * Filter, which AiJobLog to fetch.
     */
    where?: AiJobLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiJobLogs to fetch.
     */
    orderBy?: AiJobLogOrderByWithRelationInput | AiJobLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiJobLogs.
     */
    cursor?: AiJobLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiJobLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiJobLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiJobLogs.
     */
    distinct?: AiJobLogScalarFieldEnum | AiJobLogScalarFieldEnum[]
  }

  /**
   * AiJobLog findFirstOrThrow
   */
  export type AiJobLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogInclude<ExtArgs> | null
    /**
     * Filter, which AiJobLog to fetch.
     */
    where?: AiJobLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiJobLogs to fetch.
     */
    orderBy?: AiJobLogOrderByWithRelationInput | AiJobLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiJobLogs.
     */
    cursor?: AiJobLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiJobLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiJobLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiJobLogs.
     */
    distinct?: AiJobLogScalarFieldEnum | AiJobLogScalarFieldEnum[]
  }

  /**
   * AiJobLog findMany
   */
  export type AiJobLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogInclude<ExtArgs> | null
    /**
     * Filter, which AiJobLogs to fetch.
     */
    where?: AiJobLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiJobLogs to fetch.
     */
    orderBy?: AiJobLogOrderByWithRelationInput | AiJobLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiJobLogs.
     */
    cursor?: AiJobLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiJobLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiJobLogs.
     */
    skip?: number
    distinct?: AiJobLogScalarFieldEnum | AiJobLogScalarFieldEnum[]
  }

  /**
   * AiJobLog create
   */
  export type AiJobLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AiJobLog.
     */
    data: XOR<AiJobLogCreateInput, AiJobLogUncheckedCreateInput>
  }

  /**
   * AiJobLog createMany
   */
  export type AiJobLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiJobLogs.
     */
    data: AiJobLogCreateManyInput | AiJobLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiJobLog createManyAndReturn
   */
  export type AiJobLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * The data used to create many AiJobLogs.
     */
    data: AiJobLogCreateManyInput | AiJobLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiJobLog update
   */
  export type AiJobLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AiJobLog.
     */
    data: XOR<AiJobLogUpdateInput, AiJobLogUncheckedUpdateInput>
    /**
     * Choose, which AiJobLog to update.
     */
    where: AiJobLogWhereUniqueInput
  }

  /**
   * AiJobLog updateMany
   */
  export type AiJobLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiJobLogs.
     */
    data: XOR<AiJobLogUpdateManyMutationInput, AiJobLogUncheckedUpdateManyInput>
    /**
     * Filter which AiJobLogs to update
     */
    where?: AiJobLogWhereInput
    /**
     * Limit how many AiJobLogs to update.
     */
    limit?: number
  }

  /**
   * AiJobLog updateManyAndReturn
   */
  export type AiJobLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * The data used to update AiJobLogs.
     */
    data: XOR<AiJobLogUpdateManyMutationInput, AiJobLogUncheckedUpdateManyInput>
    /**
     * Filter which AiJobLogs to update
     */
    where?: AiJobLogWhereInput
    /**
     * Limit how many AiJobLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AiJobLog upsert
   */
  export type AiJobLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AiJobLog to update in case it exists.
     */
    where: AiJobLogWhereUniqueInput
    /**
     * In case the AiJobLog found by the `where` argument doesn't exist, create a new AiJobLog with this data.
     */
    create: XOR<AiJobLogCreateInput, AiJobLogUncheckedCreateInput>
    /**
     * In case the AiJobLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiJobLogUpdateInput, AiJobLogUncheckedUpdateInput>
  }

  /**
   * AiJobLog delete
   */
  export type AiJobLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogInclude<ExtArgs> | null
    /**
     * Filter which AiJobLog to delete.
     */
    where: AiJobLogWhereUniqueInput
  }

  /**
   * AiJobLog deleteMany
   */
  export type AiJobLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiJobLogs to delete
     */
    where?: AiJobLogWhereInput
    /**
     * Limit how many AiJobLogs to delete.
     */
    limit?: number
  }

  /**
   * AiJobLog without action
   */
  export type AiJobLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiJobLog
     */
    select?: AiJobLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiJobLog
     */
    omit?: AiJobLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AiJobLogInclude<ExtArgs> | null
  }


  /**
   * Model AiMemoryEvent
   */

  export type AggregateAiMemoryEvent = {
    _count: AiMemoryEventCountAggregateOutputType | null
    _avg: AiMemoryEventAvgAggregateOutputType | null
    _sum: AiMemoryEventSumAggregateOutputType | null
    _min: AiMemoryEventMinAggregateOutputType | null
    _max: AiMemoryEventMaxAggregateOutputType | null
  }

  export type AiMemoryEventAvgAggregateOutputType = {
    confidence: number | null
  }

  export type AiMemoryEventSumAggregateOutputType = {
    confidence: number | null
  }

  export type AiMemoryEventMinAggregateOutputType = {
    id: string | null
    leadId: string | null
    jobId: string | null
    actionId: string | null
    eventType: string | null
    source: string | null
    sellerReply: string | null
    aiSuggestedReply: string | null
    humanFinalReply: string | null
    approvalDecision: string | null
    messageChannel: string | null
    messageStatus: string | null
    sellerIntent: string | null
    sellerSentiment: string | null
    confidence: number | null
    outcome: string | null
    createdAt: Date | null
  }

  export type AiMemoryEventMaxAggregateOutputType = {
    id: string | null
    leadId: string | null
    jobId: string | null
    actionId: string | null
    eventType: string | null
    source: string | null
    sellerReply: string | null
    aiSuggestedReply: string | null
    humanFinalReply: string | null
    approvalDecision: string | null
    messageChannel: string | null
    messageStatus: string | null
    sellerIntent: string | null
    sellerSentiment: string | null
    confidence: number | null
    outcome: string | null
    createdAt: Date | null
  }

  export type AiMemoryEventCountAggregateOutputType = {
    id: number
    leadId: number
    jobId: number
    actionId: number
    eventType: number
    source: number
    sellerReply: number
    aiSuggestedReply: number
    humanFinalReply: number
    approvalDecision: number
    messageChannel: number
    messageStatus: number
    sellerIntent: number
    sellerSentiment: number
    confidence: number
    outcome: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type AiMemoryEventAvgAggregateInputType = {
    confidence?: true
  }

  export type AiMemoryEventSumAggregateInputType = {
    confidence?: true
  }

  export type AiMemoryEventMinAggregateInputType = {
    id?: true
    leadId?: true
    jobId?: true
    actionId?: true
    eventType?: true
    source?: true
    sellerReply?: true
    aiSuggestedReply?: true
    humanFinalReply?: true
    approvalDecision?: true
    messageChannel?: true
    messageStatus?: true
    sellerIntent?: true
    sellerSentiment?: true
    confidence?: true
    outcome?: true
    createdAt?: true
  }

  export type AiMemoryEventMaxAggregateInputType = {
    id?: true
    leadId?: true
    jobId?: true
    actionId?: true
    eventType?: true
    source?: true
    sellerReply?: true
    aiSuggestedReply?: true
    humanFinalReply?: true
    approvalDecision?: true
    messageChannel?: true
    messageStatus?: true
    sellerIntent?: true
    sellerSentiment?: true
    confidence?: true
    outcome?: true
    createdAt?: true
  }

  export type AiMemoryEventCountAggregateInputType = {
    id?: true
    leadId?: true
    jobId?: true
    actionId?: true
    eventType?: true
    source?: true
    sellerReply?: true
    aiSuggestedReply?: true
    humanFinalReply?: true
    approvalDecision?: true
    messageChannel?: true
    messageStatus?: true
    sellerIntent?: true
    sellerSentiment?: true
    confidence?: true
    outcome?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type AiMemoryEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiMemoryEvent to aggregate.
     */
    where?: AiMemoryEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiMemoryEvents to fetch.
     */
    orderBy?: AiMemoryEventOrderByWithRelationInput | AiMemoryEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiMemoryEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiMemoryEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiMemoryEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiMemoryEvents
    **/
    _count?: true | AiMemoryEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiMemoryEventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiMemoryEventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiMemoryEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiMemoryEventMaxAggregateInputType
  }

  export type GetAiMemoryEventAggregateType<T extends AiMemoryEventAggregateArgs> = {
        [P in keyof T & keyof AggregateAiMemoryEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiMemoryEvent[P]>
      : GetScalarType<T[P], AggregateAiMemoryEvent[P]>
  }




  export type AiMemoryEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiMemoryEventWhereInput
    orderBy?: AiMemoryEventOrderByWithAggregationInput | AiMemoryEventOrderByWithAggregationInput[]
    by: AiMemoryEventScalarFieldEnum[] | AiMemoryEventScalarFieldEnum
    having?: AiMemoryEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiMemoryEventCountAggregateInputType | true
    _avg?: AiMemoryEventAvgAggregateInputType
    _sum?: AiMemoryEventSumAggregateInputType
    _min?: AiMemoryEventMinAggregateInputType
    _max?: AiMemoryEventMaxAggregateInputType
  }

  export type AiMemoryEventGroupByOutputType = {
    id: string
    leadId: string | null
    jobId: string | null
    actionId: string | null
    eventType: string
    source: string
    sellerReply: string | null
    aiSuggestedReply: string | null
    humanFinalReply: string | null
    approvalDecision: string | null
    messageChannel: string | null
    messageStatus: string | null
    sellerIntent: string | null
    sellerSentiment: string | null
    confidence: number | null
    outcome: string | null
    metadata: JsonValue | null
    createdAt: Date
    _count: AiMemoryEventCountAggregateOutputType | null
    _avg: AiMemoryEventAvgAggregateOutputType | null
    _sum: AiMemoryEventSumAggregateOutputType | null
    _min: AiMemoryEventMinAggregateOutputType | null
    _max: AiMemoryEventMaxAggregateOutputType | null
  }

  type GetAiMemoryEventGroupByPayload<T extends AiMemoryEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiMemoryEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiMemoryEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiMemoryEventGroupByOutputType[P]>
            : GetScalarType<T[P], AiMemoryEventGroupByOutputType[P]>
        }
      >
    >


  export type AiMemoryEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leadId?: boolean
    jobId?: boolean
    actionId?: boolean
    eventType?: boolean
    source?: boolean
    sellerReply?: boolean
    aiSuggestedReply?: boolean
    humanFinalReply?: boolean
    approvalDecision?: boolean
    messageChannel?: boolean
    messageStatus?: boolean
    sellerIntent?: boolean
    sellerSentiment?: boolean
    confidence?: boolean
    outcome?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiMemoryEvent"]>

  export type AiMemoryEventSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leadId?: boolean
    jobId?: boolean
    actionId?: boolean
    eventType?: boolean
    source?: boolean
    sellerReply?: boolean
    aiSuggestedReply?: boolean
    humanFinalReply?: boolean
    approvalDecision?: boolean
    messageChannel?: boolean
    messageStatus?: boolean
    sellerIntent?: boolean
    sellerSentiment?: boolean
    confidence?: boolean
    outcome?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiMemoryEvent"]>

  export type AiMemoryEventSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leadId?: boolean
    jobId?: boolean
    actionId?: boolean
    eventType?: boolean
    source?: boolean
    sellerReply?: boolean
    aiSuggestedReply?: boolean
    humanFinalReply?: boolean
    approvalDecision?: boolean
    messageChannel?: boolean
    messageStatus?: boolean
    sellerIntent?: boolean
    sellerSentiment?: boolean
    confidence?: boolean
    outcome?: boolean
    metadata?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiMemoryEvent"]>

  export type AiMemoryEventSelectScalar = {
    id?: boolean
    leadId?: boolean
    jobId?: boolean
    actionId?: boolean
    eventType?: boolean
    source?: boolean
    sellerReply?: boolean
    aiSuggestedReply?: boolean
    humanFinalReply?: boolean
    approvalDecision?: boolean
    messageChannel?: boolean
    messageStatus?: boolean
    sellerIntent?: boolean
    sellerSentiment?: boolean
    confidence?: boolean
    outcome?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type AiMemoryEventOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "leadId" | "jobId" | "actionId" | "eventType" | "source" | "sellerReply" | "aiSuggestedReply" | "humanFinalReply" | "approvalDecision" | "messageChannel" | "messageStatus" | "sellerIntent" | "sellerSentiment" | "confidence" | "outcome" | "metadata" | "createdAt", ExtArgs["result"]["aiMemoryEvent"]>

  export type $AiMemoryEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiMemoryEvent"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      leadId: string | null
      jobId: string | null
      actionId: string | null
      eventType: string
      source: string
      sellerReply: string | null
      aiSuggestedReply: string | null
      humanFinalReply: string | null
      approvalDecision: string | null
      messageChannel: string | null
      messageStatus: string | null
      sellerIntent: string | null
      sellerSentiment: string | null
      confidence: number | null
      outcome: string | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["aiMemoryEvent"]>
    composites: {}
  }

  type AiMemoryEventGetPayload<S extends boolean | null | undefined | AiMemoryEventDefaultArgs> = $Result.GetResult<Prisma.$AiMemoryEventPayload, S>

  type AiMemoryEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiMemoryEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiMemoryEventCountAggregateInputType | true
    }

  export interface AiMemoryEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiMemoryEvent'], meta: { name: 'AiMemoryEvent' } }
    /**
     * Find zero or one AiMemoryEvent that matches the filter.
     * @param {AiMemoryEventFindUniqueArgs} args - Arguments to find a AiMemoryEvent
     * @example
     * // Get one AiMemoryEvent
     * const aiMemoryEvent = await prisma.aiMemoryEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiMemoryEventFindUniqueArgs>(args: SelectSubset<T, AiMemoryEventFindUniqueArgs<ExtArgs>>): Prisma__AiMemoryEventClient<$Result.GetResult<Prisma.$AiMemoryEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiMemoryEvent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiMemoryEventFindUniqueOrThrowArgs} args - Arguments to find a AiMemoryEvent
     * @example
     * // Get one AiMemoryEvent
     * const aiMemoryEvent = await prisma.aiMemoryEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiMemoryEventFindUniqueOrThrowArgs>(args: SelectSubset<T, AiMemoryEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiMemoryEventClient<$Result.GetResult<Prisma.$AiMemoryEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiMemoryEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMemoryEventFindFirstArgs} args - Arguments to find a AiMemoryEvent
     * @example
     * // Get one AiMemoryEvent
     * const aiMemoryEvent = await prisma.aiMemoryEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiMemoryEventFindFirstArgs>(args?: SelectSubset<T, AiMemoryEventFindFirstArgs<ExtArgs>>): Prisma__AiMemoryEventClient<$Result.GetResult<Prisma.$AiMemoryEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiMemoryEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMemoryEventFindFirstOrThrowArgs} args - Arguments to find a AiMemoryEvent
     * @example
     * // Get one AiMemoryEvent
     * const aiMemoryEvent = await prisma.aiMemoryEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiMemoryEventFindFirstOrThrowArgs>(args?: SelectSubset<T, AiMemoryEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiMemoryEventClient<$Result.GetResult<Prisma.$AiMemoryEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiMemoryEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMemoryEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiMemoryEvents
     * const aiMemoryEvents = await prisma.aiMemoryEvent.findMany()
     * 
     * // Get first 10 AiMemoryEvents
     * const aiMemoryEvents = await prisma.aiMemoryEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiMemoryEventWithIdOnly = await prisma.aiMemoryEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiMemoryEventFindManyArgs>(args?: SelectSubset<T, AiMemoryEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiMemoryEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiMemoryEvent.
     * @param {AiMemoryEventCreateArgs} args - Arguments to create a AiMemoryEvent.
     * @example
     * // Create one AiMemoryEvent
     * const AiMemoryEvent = await prisma.aiMemoryEvent.create({
     *   data: {
     *     // ... data to create a AiMemoryEvent
     *   }
     * })
     * 
     */
    create<T extends AiMemoryEventCreateArgs>(args: SelectSubset<T, AiMemoryEventCreateArgs<ExtArgs>>): Prisma__AiMemoryEventClient<$Result.GetResult<Prisma.$AiMemoryEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiMemoryEvents.
     * @param {AiMemoryEventCreateManyArgs} args - Arguments to create many AiMemoryEvents.
     * @example
     * // Create many AiMemoryEvents
     * const aiMemoryEvent = await prisma.aiMemoryEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiMemoryEventCreateManyArgs>(args?: SelectSubset<T, AiMemoryEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiMemoryEvents and returns the data saved in the database.
     * @param {AiMemoryEventCreateManyAndReturnArgs} args - Arguments to create many AiMemoryEvents.
     * @example
     * // Create many AiMemoryEvents
     * const aiMemoryEvent = await prisma.aiMemoryEvent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiMemoryEvents and only return the `id`
     * const aiMemoryEventWithIdOnly = await prisma.aiMemoryEvent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiMemoryEventCreateManyAndReturnArgs>(args?: SelectSubset<T, AiMemoryEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiMemoryEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiMemoryEvent.
     * @param {AiMemoryEventDeleteArgs} args - Arguments to delete one AiMemoryEvent.
     * @example
     * // Delete one AiMemoryEvent
     * const AiMemoryEvent = await prisma.aiMemoryEvent.delete({
     *   where: {
     *     // ... filter to delete one AiMemoryEvent
     *   }
     * })
     * 
     */
    delete<T extends AiMemoryEventDeleteArgs>(args: SelectSubset<T, AiMemoryEventDeleteArgs<ExtArgs>>): Prisma__AiMemoryEventClient<$Result.GetResult<Prisma.$AiMemoryEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiMemoryEvent.
     * @param {AiMemoryEventUpdateArgs} args - Arguments to update one AiMemoryEvent.
     * @example
     * // Update one AiMemoryEvent
     * const aiMemoryEvent = await prisma.aiMemoryEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiMemoryEventUpdateArgs>(args: SelectSubset<T, AiMemoryEventUpdateArgs<ExtArgs>>): Prisma__AiMemoryEventClient<$Result.GetResult<Prisma.$AiMemoryEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiMemoryEvents.
     * @param {AiMemoryEventDeleteManyArgs} args - Arguments to filter AiMemoryEvents to delete.
     * @example
     * // Delete a few AiMemoryEvents
     * const { count } = await prisma.aiMemoryEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiMemoryEventDeleteManyArgs>(args?: SelectSubset<T, AiMemoryEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiMemoryEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMemoryEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiMemoryEvents
     * const aiMemoryEvent = await prisma.aiMemoryEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiMemoryEventUpdateManyArgs>(args: SelectSubset<T, AiMemoryEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiMemoryEvents and returns the data updated in the database.
     * @param {AiMemoryEventUpdateManyAndReturnArgs} args - Arguments to update many AiMemoryEvents.
     * @example
     * // Update many AiMemoryEvents
     * const aiMemoryEvent = await prisma.aiMemoryEvent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiMemoryEvents and only return the `id`
     * const aiMemoryEventWithIdOnly = await prisma.aiMemoryEvent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiMemoryEventUpdateManyAndReturnArgs>(args: SelectSubset<T, AiMemoryEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiMemoryEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiMemoryEvent.
     * @param {AiMemoryEventUpsertArgs} args - Arguments to update or create a AiMemoryEvent.
     * @example
     * // Update or create a AiMemoryEvent
     * const aiMemoryEvent = await prisma.aiMemoryEvent.upsert({
     *   create: {
     *     // ... data to create a AiMemoryEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiMemoryEvent we want to update
     *   }
     * })
     */
    upsert<T extends AiMemoryEventUpsertArgs>(args: SelectSubset<T, AiMemoryEventUpsertArgs<ExtArgs>>): Prisma__AiMemoryEventClient<$Result.GetResult<Prisma.$AiMemoryEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiMemoryEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMemoryEventCountArgs} args - Arguments to filter AiMemoryEvents to count.
     * @example
     * // Count the number of AiMemoryEvents
     * const count = await prisma.aiMemoryEvent.count({
     *   where: {
     *     // ... the filter for the AiMemoryEvents we want to count
     *   }
     * })
    **/
    count<T extends AiMemoryEventCountArgs>(
      args?: Subset<T, AiMemoryEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiMemoryEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiMemoryEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMemoryEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiMemoryEventAggregateArgs>(args: Subset<T, AiMemoryEventAggregateArgs>): Prisma.PrismaPromise<GetAiMemoryEventAggregateType<T>>

    /**
     * Group by AiMemoryEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiMemoryEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiMemoryEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiMemoryEventGroupByArgs['orderBy'] }
        : { orderBy?: AiMemoryEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiMemoryEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiMemoryEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiMemoryEvent model
   */
  readonly fields: AiMemoryEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiMemoryEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiMemoryEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiMemoryEvent model
   */
  interface AiMemoryEventFieldRefs {
    readonly id: FieldRef<"AiMemoryEvent", 'String'>
    readonly leadId: FieldRef<"AiMemoryEvent", 'String'>
    readonly jobId: FieldRef<"AiMemoryEvent", 'String'>
    readonly actionId: FieldRef<"AiMemoryEvent", 'String'>
    readonly eventType: FieldRef<"AiMemoryEvent", 'String'>
    readonly source: FieldRef<"AiMemoryEvent", 'String'>
    readonly sellerReply: FieldRef<"AiMemoryEvent", 'String'>
    readonly aiSuggestedReply: FieldRef<"AiMemoryEvent", 'String'>
    readonly humanFinalReply: FieldRef<"AiMemoryEvent", 'String'>
    readonly approvalDecision: FieldRef<"AiMemoryEvent", 'String'>
    readonly messageChannel: FieldRef<"AiMemoryEvent", 'String'>
    readonly messageStatus: FieldRef<"AiMemoryEvent", 'String'>
    readonly sellerIntent: FieldRef<"AiMemoryEvent", 'String'>
    readonly sellerSentiment: FieldRef<"AiMemoryEvent", 'String'>
    readonly confidence: FieldRef<"AiMemoryEvent", 'Float'>
    readonly outcome: FieldRef<"AiMemoryEvent", 'String'>
    readonly metadata: FieldRef<"AiMemoryEvent", 'Json'>
    readonly createdAt: FieldRef<"AiMemoryEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiMemoryEvent findUnique
   */
  export type AiMemoryEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMemoryEvent
     */
    select?: AiMemoryEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMemoryEvent
     */
    omit?: AiMemoryEventOmit<ExtArgs> | null
    /**
     * Filter, which AiMemoryEvent to fetch.
     */
    where: AiMemoryEventWhereUniqueInput
  }

  /**
   * AiMemoryEvent findUniqueOrThrow
   */
  export type AiMemoryEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMemoryEvent
     */
    select?: AiMemoryEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMemoryEvent
     */
    omit?: AiMemoryEventOmit<ExtArgs> | null
    /**
     * Filter, which AiMemoryEvent to fetch.
     */
    where: AiMemoryEventWhereUniqueInput
  }

  /**
   * AiMemoryEvent findFirst
   */
  export type AiMemoryEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMemoryEvent
     */
    select?: AiMemoryEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMemoryEvent
     */
    omit?: AiMemoryEventOmit<ExtArgs> | null
    /**
     * Filter, which AiMemoryEvent to fetch.
     */
    where?: AiMemoryEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiMemoryEvents to fetch.
     */
    orderBy?: AiMemoryEventOrderByWithRelationInput | AiMemoryEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiMemoryEvents.
     */
    cursor?: AiMemoryEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiMemoryEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiMemoryEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiMemoryEvents.
     */
    distinct?: AiMemoryEventScalarFieldEnum | AiMemoryEventScalarFieldEnum[]
  }

  /**
   * AiMemoryEvent findFirstOrThrow
   */
  export type AiMemoryEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMemoryEvent
     */
    select?: AiMemoryEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMemoryEvent
     */
    omit?: AiMemoryEventOmit<ExtArgs> | null
    /**
     * Filter, which AiMemoryEvent to fetch.
     */
    where?: AiMemoryEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiMemoryEvents to fetch.
     */
    orderBy?: AiMemoryEventOrderByWithRelationInput | AiMemoryEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiMemoryEvents.
     */
    cursor?: AiMemoryEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiMemoryEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiMemoryEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiMemoryEvents.
     */
    distinct?: AiMemoryEventScalarFieldEnum | AiMemoryEventScalarFieldEnum[]
  }

  /**
   * AiMemoryEvent findMany
   */
  export type AiMemoryEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMemoryEvent
     */
    select?: AiMemoryEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMemoryEvent
     */
    omit?: AiMemoryEventOmit<ExtArgs> | null
    /**
     * Filter, which AiMemoryEvents to fetch.
     */
    where?: AiMemoryEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiMemoryEvents to fetch.
     */
    orderBy?: AiMemoryEventOrderByWithRelationInput | AiMemoryEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiMemoryEvents.
     */
    cursor?: AiMemoryEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiMemoryEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiMemoryEvents.
     */
    skip?: number
    distinct?: AiMemoryEventScalarFieldEnum | AiMemoryEventScalarFieldEnum[]
  }

  /**
   * AiMemoryEvent create
   */
  export type AiMemoryEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMemoryEvent
     */
    select?: AiMemoryEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMemoryEvent
     */
    omit?: AiMemoryEventOmit<ExtArgs> | null
    /**
     * The data needed to create a AiMemoryEvent.
     */
    data: XOR<AiMemoryEventCreateInput, AiMemoryEventUncheckedCreateInput>
  }

  /**
   * AiMemoryEvent createMany
   */
  export type AiMemoryEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiMemoryEvents.
     */
    data: AiMemoryEventCreateManyInput | AiMemoryEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiMemoryEvent createManyAndReturn
   */
  export type AiMemoryEventCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMemoryEvent
     */
    select?: AiMemoryEventSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiMemoryEvent
     */
    omit?: AiMemoryEventOmit<ExtArgs> | null
    /**
     * The data used to create many AiMemoryEvents.
     */
    data: AiMemoryEventCreateManyInput | AiMemoryEventCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiMemoryEvent update
   */
  export type AiMemoryEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMemoryEvent
     */
    select?: AiMemoryEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMemoryEvent
     */
    omit?: AiMemoryEventOmit<ExtArgs> | null
    /**
     * The data needed to update a AiMemoryEvent.
     */
    data: XOR<AiMemoryEventUpdateInput, AiMemoryEventUncheckedUpdateInput>
    /**
     * Choose, which AiMemoryEvent to update.
     */
    where: AiMemoryEventWhereUniqueInput
  }

  /**
   * AiMemoryEvent updateMany
   */
  export type AiMemoryEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiMemoryEvents.
     */
    data: XOR<AiMemoryEventUpdateManyMutationInput, AiMemoryEventUncheckedUpdateManyInput>
    /**
     * Filter which AiMemoryEvents to update
     */
    where?: AiMemoryEventWhereInput
    /**
     * Limit how many AiMemoryEvents to update.
     */
    limit?: number
  }

  /**
   * AiMemoryEvent updateManyAndReturn
   */
  export type AiMemoryEventUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMemoryEvent
     */
    select?: AiMemoryEventSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiMemoryEvent
     */
    omit?: AiMemoryEventOmit<ExtArgs> | null
    /**
     * The data used to update AiMemoryEvents.
     */
    data: XOR<AiMemoryEventUpdateManyMutationInput, AiMemoryEventUncheckedUpdateManyInput>
    /**
     * Filter which AiMemoryEvents to update
     */
    where?: AiMemoryEventWhereInput
    /**
     * Limit how many AiMemoryEvents to update.
     */
    limit?: number
  }

  /**
   * AiMemoryEvent upsert
   */
  export type AiMemoryEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMemoryEvent
     */
    select?: AiMemoryEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMemoryEvent
     */
    omit?: AiMemoryEventOmit<ExtArgs> | null
    /**
     * The filter to search for the AiMemoryEvent to update in case it exists.
     */
    where: AiMemoryEventWhereUniqueInput
    /**
     * In case the AiMemoryEvent found by the `where` argument doesn't exist, create a new AiMemoryEvent with this data.
     */
    create: XOR<AiMemoryEventCreateInput, AiMemoryEventUncheckedCreateInput>
    /**
     * In case the AiMemoryEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiMemoryEventUpdateInput, AiMemoryEventUncheckedUpdateInput>
  }

  /**
   * AiMemoryEvent delete
   */
  export type AiMemoryEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMemoryEvent
     */
    select?: AiMemoryEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMemoryEvent
     */
    omit?: AiMemoryEventOmit<ExtArgs> | null
    /**
     * Filter which AiMemoryEvent to delete.
     */
    where: AiMemoryEventWhereUniqueInput
  }

  /**
   * AiMemoryEvent deleteMany
   */
  export type AiMemoryEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiMemoryEvents to delete
     */
    where?: AiMemoryEventWhereInput
    /**
     * Limit how many AiMemoryEvents to delete.
     */
    limit?: number
  }

  /**
   * AiMemoryEvent without action
   */
  export type AiMemoryEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiMemoryEvent
     */
    select?: AiMemoryEventSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiMemoryEvent
     */
    omit?: AiMemoryEventOmit<ExtArgs> | null
  }


  /**
   * Model AiLearningRecommendation
   */

  export type AggregateAiLearningRecommendation = {
    _count: AiLearningRecommendationCountAggregateOutputType | null
    _avg: AiLearningRecommendationAvgAggregateOutputType | null
    _sum: AiLearningRecommendationSumAggregateOutputType | null
    _min: AiLearningRecommendationMinAggregateOutputType | null
    _max: AiLearningRecommendationMaxAggregateOutputType | null
  }

  export type AiLearningRecommendationAvgAggregateOutputType = {
    confidence: number | null
  }

  export type AiLearningRecommendationSumAggregateOutputType = {
    confidence: number | null
  }

  export type AiLearningRecommendationMinAggregateOutputType = {
    id: string | null
    type: string | null
    title: string | null
    description: string | null
    confidence: number | null
    status: string | null
    createdAt: Date | null
    reviewedAt: Date | null
    appliedAt: Date | null
    autoPromotable: boolean | null
    promotedAt: Date | null
  }

  export type AiLearningRecommendationMaxAggregateOutputType = {
    id: string | null
    type: string | null
    title: string | null
    description: string | null
    confidence: number | null
    status: string | null
    createdAt: Date | null
    reviewedAt: Date | null
    appliedAt: Date | null
    autoPromotable: boolean | null
    promotedAt: Date | null
  }

  export type AiLearningRecommendationCountAggregateOutputType = {
    id: number
    type: number
    title: number
    description: number
    recommendationData: number
    applicationPlan: number
    confidence: number
    status: number
    createdAt: number
    reviewedAt: number
    appliedAt: number
    autoPromotable: number
    promotedAt: number
    _all: number
  }


  export type AiLearningRecommendationAvgAggregateInputType = {
    confidence?: true
  }

  export type AiLearningRecommendationSumAggregateInputType = {
    confidence?: true
  }

  export type AiLearningRecommendationMinAggregateInputType = {
    id?: true
    type?: true
    title?: true
    description?: true
    confidence?: true
    status?: true
    createdAt?: true
    reviewedAt?: true
    appliedAt?: true
    autoPromotable?: true
    promotedAt?: true
  }

  export type AiLearningRecommendationMaxAggregateInputType = {
    id?: true
    type?: true
    title?: true
    description?: true
    confidence?: true
    status?: true
    createdAt?: true
    reviewedAt?: true
    appliedAt?: true
    autoPromotable?: true
    promotedAt?: true
  }

  export type AiLearningRecommendationCountAggregateInputType = {
    id?: true
    type?: true
    title?: true
    description?: true
    recommendationData?: true
    applicationPlan?: true
    confidence?: true
    status?: true
    createdAt?: true
    reviewedAt?: true
    appliedAt?: true
    autoPromotable?: true
    promotedAt?: true
    _all?: true
  }

  export type AiLearningRecommendationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiLearningRecommendation to aggregate.
     */
    where?: AiLearningRecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiLearningRecommendations to fetch.
     */
    orderBy?: AiLearningRecommendationOrderByWithRelationInput | AiLearningRecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiLearningRecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiLearningRecommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiLearningRecommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiLearningRecommendations
    **/
    _count?: true | AiLearningRecommendationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiLearningRecommendationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiLearningRecommendationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiLearningRecommendationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiLearningRecommendationMaxAggregateInputType
  }

  export type GetAiLearningRecommendationAggregateType<T extends AiLearningRecommendationAggregateArgs> = {
        [P in keyof T & keyof AggregateAiLearningRecommendation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiLearningRecommendation[P]>
      : GetScalarType<T[P], AggregateAiLearningRecommendation[P]>
  }




  export type AiLearningRecommendationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiLearningRecommendationWhereInput
    orderBy?: AiLearningRecommendationOrderByWithAggregationInput | AiLearningRecommendationOrderByWithAggregationInput[]
    by: AiLearningRecommendationScalarFieldEnum[] | AiLearningRecommendationScalarFieldEnum
    having?: AiLearningRecommendationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiLearningRecommendationCountAggregateInputType | true
    _avg?: AiLearningRecommendationAvgAggregateInputType
    _sum?: AiLearningRecommendationSumAggregateInputType
    _min?: AiLearningRecommendationMinAggregateInputType
    _max?: AiLearningRecommendationMaxAggregateInputType
  }

  export type AiLearningRecommendationGroupByOutputType = {
    id: string
    type: string
    title: string
    description: string
    recommendationData: JsonValue | null
    applicationPlan: JsonValue | null
    confidence: number
    status: string
    createdAt: Date
    reviewedAt: Date | null
    appliedAt: Date | null
    autoPromotable: boolean
    promotedAt: Date | null
    _count: AiLearningRecommendationCountAggregateOutputType | null
    _avg: AiLearningRecommendationAvgAggregateOutputType | null
    _sum: AiLearningRecommendationSumAggregateOutputType | null
    _min: AiLearningRecommendationMinAggregateOutputType | null
    _max: AiLearningRecommendationMaxAggregateOutputType | null
  }

  type GetAiLearningRecommendationGroupByPayload<T extends AiLearningRecommendationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiLearningRecommendationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiLearningRecommendationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiLearningRecommendationGroupByOutputType[P]>
            : GetScalarType<T[P], AiLearningRecommendationGroupByOutputType[P]>
        }
      >
    >


  export type AiLearningRecommendationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    recommendationData?: boolean
    applicationPlan?: boolean
    confidence?: boolean
    status?: boolean
    createdAt?: boolean
    reviewedAt?: boolean
    appliedAt?: boolean
    autoPromotable?: boolean
    promotedAt?: boolean
  }, ExtArgs["result"]["aiLearningRecommendation"]>

  export type AiLearningRecommendationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    recommendationData?: boolean
    applicationPlan?: boolean
    confidence?: boolean
    status?: boolean
    createdAt?: boolean
    reviewedAt?: boolean
    appliedAt?: boolean
    autoPromotable?: boolean
    promotedAt?: boolean
  }, ExtArgs["result"]["aiLearningRecommendation"]>

  export type AiLearningRecommendationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    recommendationData?: boolean
    applicationPlan?: boolean
    confidence?: boolean
    status?: boolean
    createdAt?: boolean
    reviewedAt?: boolean
    appliedAt?: boolean
    autoPromotable?: boolean
    promotedAt?: boolean
  }, ExtArgs["result"]["aiLearningRecommendation"]>

  export type AiLearningRecommendationSelectScalar = {
    id?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    recommendationData?: boolean
    applicationPlan?: boolean
    confidence?: boolean
    status?: boolean
    createdAt?: boolean
    reviewedAt?: boolean
    appliedAt?: boolean
    autoPromotable?: boolean
    promotedAt?: boolean
  }

  export type AiLearningRecommendationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "title" | "description" | "recommendationData" | "applicationPlan" | "confidence" | "status" | "createdAt" | "reviewedAt" | "appliedAt" | "autoPromotable" | "promotedAt", ExtArgs["result"]["aiLearningRecommendation"]>

  export type $AiLearningRecommendationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiLearningRecommendation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      title: string
      description: string
      recommendationData: Prisma.JsonValue | null
      applicationPlan: Prisma.JsonValue | null
      confidence: number
      status: string
      createdAt: Date
      reviewedAt: Date | null
      appliedAt: Date | null
      autoPromotable: boolean
      promotedAt: Date | null
    }, ExtArgs["result"]["aiLearningRecommendation"]>
    composites: {}
  }

  type AiLearningRecommendationGetPayload<S extends boolean | null | undefined | AiLearningRecommendationDefaultArgs> = $Result.GetResult<Prisma.$AiLearningRecommendationPayload, S>

  type AiLearningRecommendationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiLearningRecommendationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiLearningRecommendationCountAggregateInputType | true
    }

  export interface AiLearningRecommendationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiLearningRecommendation'], meta: { name: 'AiLearningRecommendation' } }
    /**
     * Find zero or one AiLearningRecommendation that matches the filter.
     * @param {AiLearningRecommendationFindUniqueArgs} args - Arguments to find a AiLearningRecommendation
     * @example
     * // Get one AiLearningRecommendation
     * const aiLearningRecommendation = await prisma.aiLearningRecommendation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiLearningRecommendationFindUniqueArgs>(args: SelectSubset<T, AiLearningRecommendationFindUniqueArgs<ExtArgs>>): Prisma__AiLearningRecommendationClient<$Result.GetResult<Prisma.$AiLearningRecommendationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiLearningRecommendation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiLearningRecommendationFindUniqueOrThrowArgs} args - Arguments to find a AiLearningRecommendation
     * @example
     * // Get one AiLearningRecommendation
     * const aiLearningRecommendation = await prisma.aiLearningRecommendation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiLearningRecommendationFindUniqueOrThrowArgs>(args: SelectSubset<T, AiLearningRecommendationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiLearningRecommendationClient<$Result.GetResult<Prisma.$AiLearningRecommendationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiLearningRecommendation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiLearningRecommendationFindFirstArgs} args - Arguments to find a AiLearningRecommendation
     * @example
     * // Get one AiLearningRecommendation
     * const aiLearningRecommendation = await prisma.aiLearningRecommendation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiLearningRecommendationFindFirstArgs>(args?: SelectSubset<T, AiLearningRecommendationFindFirstArgs<ExtArgs>>): Prisma__AiLearningRecommendationClient<$Result.GetResult<Prisma.$AiLearningRecommendationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiLearningRecommendation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiLearningRecommendationFindFirstOrThrowArgs} args - Arguments to find a AiLearningRecommendation
     * @example
     * // Get one AiLearningRecommendation
     * const aiLearningRecommendation = await prisma.aiLearningRecommendation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiLearningRecommendationFindFirstOrThrowArgs>(args?: SelectSubset<T, AiLearningRecommendationFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiLearningRecommendationClient<$Result.GetResult<Prisma.$AiLearningRecommendationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiLearningRecommendations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiLearningRecommendationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiLearningRecommendations
     * const aiLearningRecommendations = await prisma.aiLearningRecommendation.findMany()
     * 
     * // Get first 10 AiLearningRecommendations
     * const aiLearningRecommendations = await prisma.aiLearningRecommendation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiLearningRecommendationWithIdOnly = await prisma.aiLearningRecommendation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiLearningRecommendationFindManyArgs>(args?: SelectSubset<T, AiLearningRecommendationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiLearningRecommendationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiLearningRecommendation.
     * @param {AiLearningRecommendationCreateArgs} args - Arguments to create a AiLearningRecommendation.
     * @example
     * // Create one AiLearningRecommendation
     * const AiLearningRecommendation = await prisma.aiLearningRecommendation.create({
     *   data: {
     *     // ... data to create a AiLearningRecommendation
     *   }
     * })
     * 
     */
    create<T extends AiLearningRecommendationCreateArgs>(args: SelectSubset<T, AiLearningRecommendationCreateArgs<ExtArgs>>): Prisma__AiLearningRecommendationClient<$Result.GetResult<Prisma.$AiLearningRecommendationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiLearningRecommendations.
     * @param {AiLearningRecommendationCreateManyArgs} args - Arguments to create many AiLearningRecommendations.
     * @example
     * // Create many AiLearningRecommendations
     * const aiLearningRecommendation = await prisma.aiLearningRecommendation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiLearningRecommendationCreateManyArgs>(args?: SelectSubset<T, AiLearningRecommendationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiLearningRecommendations and returns the data saved in the database.
     * @param {AiLearningRecommendationCreateManyAndReturnArgs} args - Arguments to create many AiLearningRecommendations.
     * @example
     * // Create many AiLearningRecommendations
     * const aiLearningRecommendation = await prisma.aiLearningRecommendation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiLearningRecommendations and only return the `id`
     * const aiLearningRecommendationWithIdOnly = await prisma.aiLearningRecommendation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiLearningRecommendationCreateManyAndReturnArgs>(args?: SelectSubset<T, AiLearningRecommendationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiLearningRecommendationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiLearningRecommendation.
     * @param {AiLearningRecommendationDeleteArgs} args - Arguments to delete one AiLearningRecommendation.
     * @example
     * // Delete one AiLearningRecommendation
     * const AiLearningRecommendation = await prisma.aiLearningRecommendation.delete({
     *   where: {
     *     // ... filter to delete one AiLearningRecommendation
     *   }
     * })
     * 
     */
    delete<T extends AiLearningRecommendationDeleteArgs>(args: SelectSubset<T, AiLearningRecommendationDeleteArgs<ExtArgs>>): Prisma__AiLearningRecommendationClient<$Result.GetResult<Prisma.$AiLearningRecommendationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiLearningRecommendation.
     * @param {AiLearningRecommendationUpdateArgs} args - Arguments to update one AiLearningRecommendation.
     * @example
     * // Update one AiLearningRecommendation
     * const aiLearningRecommendation = await prisma.aiLearningRecommendation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiLearningRecommendationUpdateArgs>(args: SelectSubset<T, AiLearningRecommendationUpdateArgs<ExtArgs>>): Prisma__AiLearningRecommendationClient<$Result.GetResult<Prisma.$AiLearningRecommendationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiLearningRecommendations.
     * @param {AiLearningRecommendationDeleteManyArgs} args - Arguments to filter AiLearningRecommendations to delete.
     * @example
     * // Delete a few AiLearningRecommendations
     * const { count } = await prisma.aiLearningRecommendation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiLearningRecommendationDeleteManyArgs>(args?: SelectSubset<T, AiLearningRecommendationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiLearningRecommendations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiLearningRecommendationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiLearningRecommendations
     * const aiLearningRecommendation = await prisma.aiLearningRecommendation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiLearningRecommendationUpdateManyArgs>(args: SelectSubset<T, AiLearningRecommendationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiLearningRecommendations and returns the data updated in the database.
     * @param {AiLearningRecommendationUpdateManyAndReturnArgs} args - Arguments to update many AiLearningRecommendations.
     * @example
     * // Update many AiLearningRecommendations
     * const aiLearningRecommendation = await prisma.aiLearningRecommendation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiLearningRecommendations and only return the `id`
     * const aiLearningRecommendationWithIdOnly = await prisma.aiLearningRecommendation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiLearningRecommendationUpdateManyAndReturnArgs>(args: SelectSubset<T, AiLearningRecommendationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiLearningRecommendationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiLearningRecommendation.
     * @param {AiLearningRecommendationUpsertArgs} args - Arguments to update or create a AiLearningRecommendation.
     * @example
     * // Update or create a AiLearningRecommendation
     * const aiLearningRecommendation = await prisma.aiLearningRecommendation.upsert({
     *   create: {
     *     // ... data to create a AiLearningRecommendation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiLearningRecommendation we want to update
     *   }
     * })
     */
    upsert<T extends AiLearningRecommendationUpsertArgs>(args: SelectSubset<T, AiLearningRecommendationUpsertArgs<ExtArgs>>): Prisma__AiLearningRecommendationClient<$Result.GetResult<Prisma.$AiLearningRecommendationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiLearningRecommendations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiLearningRecommendationCountArgs} args - Arguments to filter AiLearningRecommendations to count.
     * @example
     * // Count the number of AiLearningRecommendations
     * const count = await prisma.aiLearningRecommendation.count({
     *   where: {
     *     // ... the filter for the AiLearningRecommendations we want to count
     *   }
     * })
    **/
    count<T extends AiLearningRecommendationCountArgs>(
      args?: Subset<T, AiLearningRecommendationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiLearningRecommendationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiLearningRecommendation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiLearningRecommendationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiLearningRecommendationAggregateArgs>(args: Subset<T, AiLearningRecommendationAggregateArgs>): Prisma.PrismaPromise<GetAiLearningRecommendationAggregateType<T>>

    /**
     * Group by AiLearningRecommendation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiLearningRecommendationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiLearningRecommendationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiLearningRecommendationGroupByArgs['orderBy'] }
        : { orderBy?: AiLearningRecommendationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiLearningRecommendationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiLearningRecommendationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiLearningRecommendation model
   */
  readonly fields: AiLearningRecommendationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiLearningRecommendation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiLearningRecommendationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiLearningRecommendation model
   */
  interface AiLearningRecommendationFieldRefs {
    readonly id: FieldRef<"AiLearningRecommendation", 'String'>
    readonly type: FieldRef<"AiLearningRecommendation", 'String'>
    readonly title: FieldRef<"AiLearningRecommendation", 'String'>
    readonly description: FieldRef<"AiLearningRecommendation", 'String'>
    readonly recommendationData: FieldRef<"AiLearningRecommendation", 'Json'>
    readonly applicationPlan: FieldRef<"AiLearningRecommendation", 'Json'>
    readonly confidence: FieldRef<"AiLearningRecommendation", 'Float'>
    readonly status: FieldRef<"AiLearningRecommendation", 'String'>
    readonly createdAt: FieldRef<"AiLearningRecommendation", 'DateTime'>
    readonly reviewedAt: FieldRef<"AiLearningRecommendation", 'DateTime'>
    readonly appliedAt: FieldRef<"AiLearningRecommendation", 'DateTime'>
    readonly autoPromotable: FieldRef<"AiLearningRecommendation", 'Boolean'>
    readonly promotedAt: FieldRef<"AiLearningRecommendation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiLearningRecommendation findUnique
   */
  export type AiLearningRecommendationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiLearningRecommendation
     */
    select?: AiLearningRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiLearningRecommendation
     */
    omit?: AiLearningRecommendationOmit<ExtArgs> | null
    /**
     * Filter, which AiLearningRecommendation to fetch.
     */
    where: AiLearningRecommendationWhereUniqueInput
  }

  /**
   * AiLearningRecommendation findUniqueOrThrow
   */
  export type AiLearningRecommendationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiLearningRecommendation
     */
    select?: AiLearningRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiLearningRecommendation
     */
    omit?: AiLearningRecommendationOmit<ExtArgs> | null
    /**
     * Filter, which AiLearningRecommendation to fetch.
     */
    where: AiLearningRecommendationWhereUniqueInput
  }

  /**
   * AiLearningRecommendation findFirst
   */
  export type AiLearningRecommendationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiLearningRecommendation
     */
    select?: AiLearningRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiLearningRecommendation
     */
    omit?: AiLearningRecommendationOmit<ExtArgs> | null
    /**
     * Filter, which AiLearningRecommendation to fetch.
     */
    where?: AiLearningRecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiLearningRecommendations to fetch.
     */
    orderBy?: AiLearningRecommendationOrderByWithRelationInput | AiLearningRecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiLearningRecommendations.
     */
    cursor?: AiLearningRecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiLearningRecommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiLearningRecommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiLearningRecommendations.
     */
    distinct?: AiLearningRecommendationScalarFieldEnum | AiLearningRecommendationScalarFieldEnum[]
  }

  /**
   * AiLearningRecommendation findFirstOrThrow
   */
  export type AiLearningRecommendationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiLearningRecommendation
     */
    select?: AiLearningRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiLearningRecommendation
     */
    omit?: AiLearningRecommendationOmit<ExtArgs> | null
    /**
     * Filter, which AiLearningRecommendation to fetch.
     */
    where?: AiLearningRecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiLearningRecommendations to fetch.
     */
    orderBy?: AiLearningRecommendationOrderByWithRelationInput | AiLearningRecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiLearningRecommendations.
     */
    cursor?: AiLearningRecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiLearningRecommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiLearningRecommendations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiLearningRecommendations.
     */
    distinct?: AiLearningRecommendationScalarFieldEnum | AiLearningRecommendationScalarFieldEnum[]
  }

  /**
   * AiLearningRecommendation findMany
   */
  export type AiLearningRecommendationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiLearningRecommendation
     */
    select?: AiLearningRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiLearningRecommendation
     */
    omit?: AiLearningRecommendationOmit<ExtArgs> | null
    /**
     * Filter, which AiLearningRecommendations to fetch.
     */
    where?: AiLearningRecommendationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiLearningRecommendations to fetch.
     */
    orderBy?: AiLearningRecommendationOrderByWithRelationInput | AiLearningRecommendationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiLearningRecommendations.
     */
    cursor?: AiLearningRecommendationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiLearningRecommendations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiLearningRecommendations.
     */
    skip?: number
    distinct?: AiLearningRecommendationScalarFieldEnum | AiLearningRecommendationScalarFieldEnum[]
  }

  /**
   * AiLearningRecommendation create
   */
  export type AiLearningRecommendationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiLearningRecommendation
     */
    select?: AiLearningRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiLearningRecommendation
     */
    omit?: AiLearningRecommendationOmit<ExtArgs> | null
    /**
     * The data needed to create a AiLearningRecommendation.
     */
    data: XOR<AiLearningRecommendationCreateInput, AiLearningRecommendationUncheckedCreateInput>
  }

  /**
   * AiLearningRecommendation createMany
   */
  export type AiLearningRecommendationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiLearningRecommendations.
     */
    data: AiLearningRecommendationCreateManyInput | AiLearningRecommendationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiLearningRecommendation createManyAndReturn
   */
  export type AiLearningRecommendationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiLearningRecommendation
     */
    select?: AiLearningRecommendationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiLearningRecommendation
     */
    omit?: AiLearningRecommendationOmit<ExtArgs> | null
    /**
     * The data used to create many AiLearningRecommendations.
     */
    data: AiLearningRecommendationCreateManyInput | AiLearningRecommendationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AiLearningRecommendation update
   */
  export type AiLearningRecommendationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiLearningRecommendation
     */
    select?: AiLearningRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiLearningRecommendation
     */
    omit?: AiLearningRecommendationOmit<ExtArgs> | null
    /**
     * The data needed to update a AiLearningRecommendation.
     */
    data: XOR<AiLearningRecommendationUpdateInput, AiLearningRecommendationUncheckedUpdateInput>
    /**
     * Choose, which AiLearningRecommendation to update.
     */
    where: AiLearningRecommendationWhereUniqueInput
  }

  /**
   * AiLearningRecommendation updateMany
   */
  export type AiLearningRecommendationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiLearningRecommendations.
     */
    data: XOR<AiLearningRecommendationUpdateManyMutationInput, AiLearningRecommendationUncheckedUpdateManyInput>
    /**
     * Filter which AiLearningRecommendations to update
     */
    where?: AiLearningRecommendationWhereInput
    /**
     * Limit how many AiLearningRecommendations to update.
     */
    limit?: number
  }

  /**
   * AiLearningRecommendation updateManyAndReturn
   */
  export type AiLearningRecommendationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiLearningRecommendation
     */
    select?: AiLearningRecommendationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiLearningRecommendation
     */
    omit?: AiLearningRecommendationOmit<ExtArgs> | null
    /**
     * The data used to update AiLearningRecommendations.
     */
    data: XOR<AiLearningRecommendationUpdateManyMutationInput, AiLearningRecommendationUncheckedUpdateManyInput>
    /**
     * Filter which AiLearningRecommendations to update
     */
    where?: AiLearningRecommendationWhereInput
    /**
     * Limit how many AiLearningRecommendations to update.
     */
    limit?: number
  }

  /**
   * AiLearningRecommendation upsert
   */
  export type AiLearningRecommendationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiLearningRecommendation
     */
    select?: AiLearningRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiLearningRecommendation
     */
    omit?: AiLearningRecommendationOmit<ExtArgs> | null
    /**
     * The filter to search for the AiLearningRecommendation to update in case it exists.
     */
    where: AiLearningRecommendationWhereUniqueInput
    /**
     * In case the AiLearningRecommendation found by the `where` argument doesn't exist, create a new AiLearningRecommendation with this data.
     */
    create: XOR<AiLearningRecommendationCreateInput, AiLearningRecommendationUncheckedCreateInput>
    /**
     * In case the AiLearningRecommendation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiLearningRecommendationUpdateInput, AiLearningRecommendationUncheckedUpdateInput>
  }

  /**
   * AiLearningRecommendation delete
   */
  export type AiLearningRecommendationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiLearningRecommendation
     */
    select?: AiLearningRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiLearningRecommendation
     */
    omit?: AiLearningRecommendationOmit<ExtArgs> | null
    /**
     * Filter which AiLearningRecommendation to delete.
     */
    where: AiLearningRecommendationWhereUniqueInput
  }

  /**
   * AiLearningRecommendation deleteMany
   */
  export type AiLearningRecommendationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiLearningRecommendations to delete
     */
    where?: AiLearningRecommendationWhereInput
    /**
     * Limit how many AiLearningRecommendations to delete.
     */
    limit?: number
  }

  /**
   * AiLearningRecommendation without action
   */
  export type AiLearningRecommendationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiLearningRecommendation
     */
    select?: AiLearningRecommendationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiLearningRecommendation
     */
    omit?: AiLearningRecommendationOmit<ExtArgs> | null
  }


  /**
   * Model Buyer
   */

  export type AggregateBuyer = {
    _count: BuyerCountAggregateOutputType | null
    _avg: BuyerAvgAggregateOutputType | null
    _sum: BuyerSumAggregateOutputType | null
    _min: BuyerMinAggregateOutputType | null
    _max: BuyerMaxAggregateOutputType | null
  }

  export type BuyerAvgAggregateOutputType = {
    priceRangeMin: number | null
    priceRangeMax: number | null
    preferredDealSize: number | null
    buyerQualityScore: number | null
    activityCount: number | null
    meaningfulActivityCount: number | null
  }

  export type BuyerSumAggregateOutputType = {
    priceRangeMin: number | null
    priceRangeMax: number | null
    preferredDealSize: number | null
    buyerQualityScore: number | null
    activityCount: number | null
    meaningfulActivityCount: number | null
  }

  export type BuyerMinAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    email: string | null
    priceRangeMin: number | null
    priceRangeMax: number | null
    financingType: string | null
    tier: $Enums.BuyerTier | null
    preferredDealSize: number | null
    preferredCondition: string | null
    source: string | null
    buyerQualityScore: number | null
    lastActiveAt: Date | null
    activityCount: number | null
    meaningfulActivityCount: number | null
    lastMeaningfulActivityAt: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BuyerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    email: string | null
    priceRangeMin: number | null
    priceRangeMax: number | null
    financingType: string | null
    tier: $Enums.BuyerTier | null
    preferredDealSize: number | null
    preferredCondition: string | null
    source: string | null
    buyerQualityScore: number | null
    lastActiveAt: Date | null
    activityCount: number | null
    meaningfulActivityCount: number | null
    lastMeaningfulActivityAt: Date | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type BuyerCountAggregateOutputType = {
    id: number
    name: number
    phone: number
    email: number
    preferredLocations: number
    priceRangeMin: number
    priceRangeMax: number
    propertyTypes: number
    financingType: number
    tier: number
    preferredDealSize: number
    preferredCondition: number
    source: number
    tags: number
    buyerQualityScore: number
    lastActiveAt: number
    activityCount: number
    meaningfulActivityCount: number
    lastMeaningfulActivityAt: number
    isActive: number
    qualityReasons: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type BuyerAvgAggregateInputType = {
    priceRangeMin?: true
    priceRangeMax?: true
    preferredDealSize?: true
    buyerQualityScore?: true
    activityCount?: true
    meaningfulActivityCount?: true
  }

  export type BuyerSumAggregateInputType = {
    priceRangeMin?: true
    priceRangeMax?: true
    preferredDealSize?: true
    buyerQualityScore?: true
    activityCount?: true
    meaningfulActivityCount?: true
  }

  export type BuyerMinAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    priceRangeMin?: true
    priceRangeMax?: true
    financingType?: true
    tier?: true
    preferredDealSize?: true
    preferredCondition?: true
    source?: true
    buyerQualityScore?: true
    lastActiveAt?: true
    activityCount?: true
    meaningfulActivityCount?: true
    lastMeaningfulActivityAt?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BuyerMaxAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    priceRangeMin?: true
    priceRangeMax?: true
    financingType?: true
    tier?: true
    preferredDealSize?: true
    preferredCondition?: true
    source?: true
    buyerQualityScore?: true
    lastActiveAt?: true
    activityCount?: true
    meaningfulActivityCount?: true
    lastMeaningfulActivityAt?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type BuyerCountAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    preferredLocations?: true
    priceRangeMin?: true
    priceRangeMax?: true
    propertyTypes?: true
    financingType?: true
    tier?: true
    preferredDealSize?: true
    preferredCondition?: true
    source?: true
    tags?: true
    buyerQualityScore?: true
    lastActiveAt?: true
    activityCount?: true
    meaningfulActivityCount?: true
    lastMeaningfulActivityAt?: true
    isActive?: true
    qualityReasons?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type BuyerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Buyer to aggregate.
     */
    where?: BuyerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Buyers to fetch.
     */
    orderBy?: BuyerOrderByWithRelationInput | BuyerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BuyerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Buyers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Buyers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Buyers
    **/
    _count?: true | BuyerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BuyerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BuyerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BuyerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BuyerMaxAggregateInputType
  }

  export type GetBuyerAggregateType<T extends BuyerAggregateArgs> = {
        [P in keyof T & keyof AggregateBuyer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBuyer[P]>
      : GetScalarType<T[P], AggregateBuyer[P]>
  }




  export type BuyerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuyerWhereInput
    orderBy?: BuyerOrderByWithAggregationInput | BuyerOrderByWithAggregationInput[]
    by: BuyerScalarFieldEnum[] | BuyerScalarFieldEnum
    having?: BuyerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BuyerCountAggregateInputType | true
    _avg?: BuyerAvgAggregateInputType
    _sum?: BuyerSumAggregateInputType
    _min?: BuyerMinAggregateInputType
    _max?: BuyerMaxAggregateInputType
  }

  export type BuyerGroupByOutputType = {
    id: string
    name: string
    phone: string | null
    email: string | null
    preferredLocations: JsonValue | null
    priceRangeMin: number | null
    priceRangeMax: number | null
    propertyTypes: JsonValue | null
    financingType: string | null
    tier: $Enums.BuyerTier
    preferredDealSize: number | null
    preferredCondition: string | null
    source: string | null
    tags: JsonValue | null
    buyerQualityScore: number
    lastActiveAt: Date | null
    activityCount: number
    meaningfulActivityCount: number
    lastMeaningfulActivityAt: Date | null
    isActive: boolean
    qualityReasons: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: BuyerCountAggregateOutputType | null
    _avg: BuyerAvgAggregateOutputType | null
    _sum: BuyerSumAggregateOutputType | null
    _min: BuyerMinAggregateOutputType | null
    _max: BuyerMaxAggregateOutputType | null
  }

  type GetBuyerGroupByPayload<T extends BuyerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BuyerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BuyerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BuyerGroupByOutputType[P]>
            : GetScalarType<T[P], BuyerGroupByOutputType[P]>
        }
      >
    >


  export type BuyerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    preferredLocations?: boolean
    priceRangeMin?: boolean
    priceRangeMax?: boolean
    propertyTypes?: boolean
    financingType?: boolean
    tier?: boolean
    preferredDealSize?: boolean
    preferredCondition?: boolean
    source?: boolean
    tags?: boolean
    buyerQualityScore?: boolean
    lastActiveAt?: boolean
    activityCount?: boolean
    meaningfulActivityCount?: boolean
    lastMeaningfulActivityAt?: boolean
    isActive?: boolean
    qualityReasons?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    activities?: boolean | Buyer$activitiesArgs<ExtArgs>
    _count?: boolean | BuyerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["buyer"]>

  export type BuyerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    preferredLocations?: boolean
    priceRangeMin?: boolean
    priceRangeMax?: boolean
    propertyTypes?: boolean
    financingType?: boolean
    tier?: boolean
    preferredDealSize?: boolean
    preferredCondition?: boolean
    source?: boolean
    tags?: boolean
    buyerQualityScore?: boolean
    lastActiveAt?: boolean
    activityCount?: boolean
    meaningfulActivityCount?: boolean
    lastMeaningfulActivityAt?: boolean
    isActive?: boolean
    qualityReasons?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["buyer"]>

  export type BuyerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    preferredLocations?: boolean
    priceRangeMin?: boolean
    priceRangeMax?: boolean
    propertyTypes?: boolean
    financingType?: boolean
    tier?: boolean
    preferredDealSize?: boolean
    preferredCondition?: boolean
    source?: boolean
    tags?: boolean
    buyerQualityScore?: boolean
    lastActiveAt?: boolean
    activityCount?: boolean
    meaningfulActivityCount?: boolean
    lastMeaningfulActivityAt?: boolean
    isActive?: boolean
    qualityReasons?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["buyer"]>

  export type BuyerSelectScalar = {
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    preferredLocations?: boolean
    priceRangeMin?: boolean
    priceRangeMax?: boolean
    propertyTypes?: boolean
    financingType?: boolean
    tier?: boolean
    preferredDealSize?: boolean
    preferredCondition?: boolean
    source?: boolean
    tags?: boolean
    buyerQualityScore?: boolean
    lastActiveAt?: boolean
    activityCount?: boolean
    meaningfulActivityCount?: boolean
    lastMeaningfulActivityAt?: boolean
    isActive?: boolean
    qualityReasons?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type BuyerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "phone" | "email" | "preferredLocations" | "priceRangeMin" | "priceRangeMax" | "propertyTypes" | "financingType" | "tier" | "preferredDealSize" | "preferredCondition" | "source" | "tags" | "buyerQualityScore" | "lastActiveAt" | "activityCount" | "meaningfulActivityCount" | "lastMeaningfulActivityAt" | "isActive" | "qualityReasons" | "createdAt" | "updatedAt", ExtArgs["result"]["buyer"]>
  export type BuyerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activities?: boolean | Buyer$activitiesArgs<ExtArgs>
    _count?: boolean | BuyerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BuyerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type BuyerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BuyerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Buyer"
    objects: {
      activities: Prisma.$BuyerActivityPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      phone: string | null
      email: string | null
      preferredLocations: Prisma.JsonValue | null
      priceRangeMin: number | null
      priceRangeMax: number | null
      propertyTypes: Prisma.JsonValue | null
      financingType: string | null
      tier: $Enums.BuyerTier
      preferredDealSize: number | null
      preferredCondition: string | null
      source: string | null
      tags: Prisma.JsonValue | null
      buyerQualityScore: number
      lastActiveAt: Date | null
      activityCount: number
      meaningfulActivityCount: number
      lastMeaningfulActivityAt: Date | null
      isActive: boolean
      qualityReasons: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["buyer"]>
    composites: {}
  }

  type BuyerGetPayload<S extends boolean | null | undefined | BuyerDefaultArgs> = $Result.GetResult<Prisma.$BuyerPayload, S>

  type BuyerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BuyerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BuyerCountAggregateInputType | true
    }

  export interface BuyerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Buyer'], meta: { name: 'Buyer' } }
    /**
     * Find zero or one Buyer that matches the filter.
     * @param {BuyerFindUniqueArgs} args - Arguments to find a Buyer
     * @example
     * // Get one Buyer
     * const buyer = await prisma.buyer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BuyerFindUniqueArgs>(args: SelectSubset<T, BuyerFindUniqueArgs<ExtArgs>>): Prisma__BuyerClient<$Result.GetResult<Prisma.$BuyerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Buyer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BuyerFindUniqueOrThrowArgs} args - Arguments to find a Buyer
     * @example
     * // Get one Buyer
     * const buyer = await prisma.buyer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BuyerFindUniqueOrThrowArgs>(args: SelectSubset<T, BuyerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BuyerClient<$Result.GetResult<Prisma.$BuyerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Buyer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerFindFirstArgs} args - Arguments to find a Buyer
     * @example
     * // Get one Buyer
     * const buyer = await prisma.buyer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BuyerFindFirstArgs>(args?: SelectSubset<T, BuyerFindFirstArgs<ExtArgs>>): Prisma__BuyerClient<$Result.GetResult<Prisma.$BuyerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Buyer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerFindFirstOrThrowArgs} args - Arguments to find a Buyer
     * @example
     * // Get one Buyer
     * const buyer = await prisma.buyer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BuyerFindFirstOrThrowArgs>(args?: SelectSubset<T, BuyerFindFirstOrThrowArgs<ExtArgs>>): Prisma__BuyerClient<$Result.GetResult<Prisma.$BuyerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Buyers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Buyers
     * const buyers = await prisma.buyer.findMany()
     * 
     * // Get first 10 Buyers
     * const buyers = await prisma.buyer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const buyerWithIdOnly = await prisma.buyer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BuyerFindManyArgs>(args?: SelectSubset<T, BuyerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuyerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Buyer.
     * @param {BuyerCreateArgs} args - Arguments to create a Buyer.
     * @example
     * // Create one Buyer
     * const Buyer = await prisma.buyer.create({
     *   data: {
     *     // ... data to create a Buyer
     *   }
     * })
     * 
     */
    create<T extends BuyerCreateArgs>(args: SelectSubset<T, BuyerCreateArgs<ExtArgs>>): Prisma__BuyerClient<$Result.GetResult<Prisma.$BuyerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Buyers.
     * @param {BuyerCreateManyArgs} args - Arguments to create many Buyers.
     * @example
     * // Create many Buyers
     * const buyer = await prisma.buyer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BuyerCreateManyArgs>(args?: SelectSubset<T, BuyerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Buyers and returns the data saved in the database.
     * @param {BuyerCreateManyAndReturnArgs} args - Arguments to create many Buyers.
     * @example
     * // Create many Buyers
     * const buyer = await prisma.buyer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Buyers and only return the `id`
     * const buyerWithIdOnly = await prisma.buyer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BuyerCreateManyAndReturnArgs>(args?: SelectSubset<T, BuyerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuyerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Buyer.
     * @param {BuyerDeleteArgs} args - Arguments to delete one Buyer.
     * @example
     * // Delete one Buyer
     * const Buyer = await prisma.buyer.delete({
     *   where: {
     *     // ... filter to delete one Buyer
     *   }
     * })
     * 
     */
    delete<T extends BuyerDeleteArgs>(args: SelectSubset<T, BuyerDeleteArgs<ExtArgs>>): Prisma__BuyerClient<$Result.GetResult<Prisma.$BuyerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Buyer.
     * @param {BuyerUpdateArgs} args - Arguments to update one Buyer.
     * @example
     * // Update one Buyer
     * const buyer = await prisma.buyer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BuyerUpdateArgs>(args: SelectSubset<T, BuyerUpdateArgs<ExtArgs>>): Prisma__BuyerClient<$Result.GetResult<Prisma.$BuyerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Buyers.
     * @param {BuyerDeleteManyArgs} args - Arguments to filter Buyers to delete.
     * @example
     * // Delete a few Buyers
     * const { count } = await prisma.buyer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BuyerDeleteManyArgs>(args?: SelectSubset<T, BuyerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Buyers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Buyers
     * const buyer = await prisma.buyer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BuyerUpdateManyArgs>(args: SelectSubset<T, BuyerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Buyers and returns the data updated in the database.
     * @param {BuyerUpdateManyAndReturnArgs} args - Arguments to update many Buyers.
     * @example
     * // Update many Buyers
     * const buyer = await prisma.buyer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Buyers and only return the `id`
     * const buyerWithIdOnly = await prisma.buyer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BuyerUpdateManyAndReturnArgs>(args: SelectSubset<T, BuyerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuyerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Buyer.
     * @param {BuyerUpsertArgs} args - Arguments to update or create a Buyer.
     * @example
     * // Update or create a Buyer
     * const buyer = await prisma.buyer.upsert({
     *   create: {
     *     // ... data to create a Buyer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Buyer we want to update
     *   }
     * })
     */
    upsert<T extends BuyerUpsertArgs>(args: SelectSubset<T, BuyerUpsertArgs<ExtArgs>>): Prisma__BuyerClient<$Result.GetResult<Prisma.$BuyerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Buyers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerCountArgs} args - Arguments to filter Buyers to count.
     * @example
     * // Count the number of Buyers
     * const count = await prisma.buyer.count({
     *   where: {
     *     // ... the filter for the Buyers we want to count
     *   }
     * })
    **/
    count<T extends BuyerCountArgs>(
      args?: Subset<T, BuyerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BuyerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Buyer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BuyerAggregateArgs>(args: Subset<T, BuyerAggregateArgs>): Prisma.PrismaPromise<GetBuyerAggregateType<T>>

    /**
     * Group by Buyer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BuyerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BuyerGroupByArgs['orderBy'] }
        : { orderBy?: BuyerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BuyerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBuyerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Buyer model
   */
  readonly fields: BuyerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Buyer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BuyerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    activities<T extends Buyer$activitiesArgs<ExtArgs> = {}>(args?: Subset<T, Buyer$activitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuyerActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Buyer model
   */
  interface BuyerFieldRefs {
    readonly id: FieldRef<"Buyer", 'String'>
    readonly name: FieldRef<"Buyer", 'String'>
    readonly phone: FieldRef<"Buyer", 'String'>
    readonly email: FieldRef<"Buyer", 'String'>
    readonly preferredLocations: FieldRef<"Buyer", 'Json'>
    readonly priceRangeMin: FieldRef<"Buyer", 'Int'>
    readonly priceRangeMax: FieldRef<"Buyer", 'Int'>
    readonly propertyTypes: FieldRef<"Buyer", 'Json'>
    readonly financingType: FieldRef<"Buyer", 'String'>
    readonly tier: FieldRef<"Buyer", 'BuyerTier'>
    readonly preferredDealSize: FieldRef<"Buyer", 'Int'>
    readonly preferredCondition: FieldRef<"Buyer", 'String'>
    readonly source: FieldRef<"Buyer", 'String'>
    readonly tags: FieldRef<"Buyer", 'Json'>
    readonly buyerQualityScore: FieldRef<"Buyer", 'Int'>
    readonly lastActiveAt: FieldRef<"Buyer", 'DateTime'>
    readonly activityCount: FieldRef<"Buyer", 'Int'>
    readonly meaningfulActivityCount: FieldRef<"Buyer", 'Int'>
    readonly lastMeaningfulActivityAt: FieldRef<"Buyer", 'DateTime'>
    readonly isActive: FieldRef<"Buyer", 'Boolean'>
    readonly qualityReasons: FieldRef<"Buyer", 'Json'>
    readonly createdAt: FieldRef<"Buyer", 'DateTime'>
    readonly updatedAt: FieldRef<"Buyer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Buyer findUnique
   */
  export type BuyerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Buyer
     */
    select?: BuyerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Buyer
     */
    omit?: BuyerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerInclude<ExtArgs> | null
    /**
     * Filter, which Buyer to fetch.
     */
    where: BuyerWhereUniqueInput
  }

  /**
   * Buyer findUniqueOrThrow
   */
  export type BuyerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Buyer
     */
    select?: BuyerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Buyer
     */
    omit?: BuyerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerInclude<ExtArgs> | null
    /**
     * Filter, which Buyer to fetch.
     */
    where: BuyerWhereUniqueInput
  }

  /**
   * Buyer findFirst
   */
  export type BuyerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Buyer
     */
    select?: BuyerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Buyer
     */
    omit?: BuyerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerInclude<ExtArgs> | null
    /**
     * Filter, which Buyer to fetch.
     */
    where?: BuyerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Buyers to fetch.
     */
    orderBy?: BuyerOrderByWithRelationInput | BuyerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Buyers.
     */
    cursor?: BuyerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Buyers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Buyers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Buyers.
     */
    distinct?: BuyerScalarFieldEnum | BuyerScalarFieldEnum[]
  }

  /**
   * Buyer findFirstOrThrow
   */
  export type BuyerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Buyer
     */
    select?: BuyerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Buyer
     */
    omit?: BuyerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerInclude<ExtArgs> | null
    /**
     * Filter, which Buyer to fetch.
     */
    where?: BuyerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Buyers to fetch.
     */
    orderBy?: BuyerOrderByWithRelationInput | BuyerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Buyers.
     */
    cursor?: BuyerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Buyers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Buyers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Buyers.
     */
    distinct?: BuyerScalarFieldEnum | BuyerScalarFieldEnum[]
  }

  /**
   * Buyer findMany
   */
  export type BuyerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Buyer
     */
    select?: BuyerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Buyer
     */
    omit?: BuyerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerInclude<ExtArgs> | null
    /**
     * Filter, which Buyers to fetch.
     */
    where?: BuyerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Buyers to fetch.
     */
    orderBy?: BuyerOrderByWithRelationInput | BuyerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Buyers.
     */
    cursor?: BuyerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Buyers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Buyers.
     */
    skip?: number
    distinct?: BuyerScalarFieldEnum | BuyerScalarFieldEnum[]
  }

  /**
   * Buyer create
   */
  export type BuyerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Buyer
     */
    select?: BuyerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Buyer
     */
    omit?: BuyerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerInclude<ExtArgs> | null
    /**
     * The data needed to create a Buyer.
     */
    data: XOR<BuyerCreateInput, BuyerUncheckedCreateInput>
  }

  /**
   * Buyer createMany
   */
  export type BuyerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Buyers.
     */
    data: BuyerCreateManyInput | BuyerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Buyer createManyAndReturn
   */
  export type BuyerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Buyer
     */
    select?: BuyerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Buyer
     */
    omit?: BuyerOmit<ExtArgs> | null
    /**
     * The data used to create many Buyers.
     */
    data: BuyerCreateManyInput | BuyerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Buyer update
   */
  export type BuyerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Buyer
     */
    select?: BuyerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Buyer
     */
    omit?: BuyerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerInclude<ExtArgs> | null
    /**
     * The data needed to update a Buyer.
     */
    data: XOR<BuyerUpdateInput, BuyerUncheckedUpdateInput>
    /**
     * Choose, which Buyer to update.
     */
    where: BuyerWhereUniqueInput
  }

  /**
   * Buyer updateMany
   */
  export type BuyerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Buyers.
     */
    data: XOR<BuyerUpdateManyMutationInput, BuyerUncheckedUpdateManyInput>
    /**
     * Filter which Buyers to update
     */
    where?: BuyerWhereInput
    /**
     * Limit how many Buyers to update.
     */
    limit?: number
  }

  /**
   * Buyer updateManyAndReturn
   */
  export type BuyerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Buyer
     */
    select?: BuyerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Buyer
     */
    omit?: BuyerOmit<ExtArgs> | null
    /**
     * The data used to update Buyers.
     */
    data: XOR<BuyerUpdateManyMutationInput, BuyerUncheckedUpdateManyInput>
    /**
     * Filter which Buyers to update
     */
    where?: BuyerWhereInput
    /**
     * Limit how many Buyers to update.
     */
    limit?: number
  }

  /**
   * Buyer upsert
   */
  export type BuyerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Buyer
     */
    select?: BuyerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Buyer
     */
    omit?: BuyerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerInclude<ExtArgs> | null
    /**
     * The filter to search for the Buyer to update in case it exists.
     */
    where: BuyerWhereUniqueInput
    /**
     * In case the Buyer found by the `where` argument doesn't exist, create a new Buyer with this data.
     */
    create: XOR<BuyerCreateInput, BuyerUncheckedCreateInput>
    /**
     * In case the Buyer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BuyerUpdateInput, BuyerUncheckedUpdateInput>
  }

  /**
   * Buyer delete
   */
  export type BuyerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Buyer
     */
    select?: BuyerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Buyer
     */
    omit?: BuyerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerInclude<ExtArgs> | null
    /**
     * Filter which Buyer to delete.
     */
    where: BuyerWhereUniqueInput
  }

  /**
   * Buyer deleteMany
   */
  export type BuyerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Buyers to delete
     */
    where?: BuyerWhereInput
    /**
     * Limit how many Buyers to delete.
     */
    limit?: number
  }

  /**
   * Buyer.activities
   */
  export type Buyer$activitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityInclude<ExtArgs> | null
    where?: BuyerActivityWhereInput
    orderBy?: BuyerActivityOrderByWithRelationInput | BuyerActivityOrderByWithRelationInput[]
    cursor?: BuyerActivityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BuyerActivityScalarFieldEnum | BuyerActivityScalarFieldEnum[]
  }

  /**
   * Buyer without action
   */
  export type BuyerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Buyer
     */
    select?: BuyerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Buyer
     */
    omit?: BuyerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerInclude<ExtArgs> | null
  }


  /**
   * Model BuyerActivity
   */

  export type AggregateBuyerActivity = {
    _count: BuyerActivityCountAggregateOutputType | null
    _min: BuyerActivityMinAggregateOutputType | null
    _max: BuyerActivityMaxAggregateOutputType | null
  }

  export type BuyerActivityMinAggregateOutputType = {
    id: string | null
    buyerId: string | null
    dealId: string | null
    eventType: $Enums.BuyerActivityEventType | null
    createdAt: Date | null
  }

  export type BuyerActivityMaxAggregateOutputType = {
    id: string | null
    buyerId: string | null
    dealId: string | null
    eventType: $Enums.BuyerActivityEventType | null
    createdAt: Date | null
  }

  export type BuyerActivityCountAggregateOutputType = {
    id: number
    buyerId: number
    dealId: number
    eventType: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type BuyerActivityMinAggregateInputType = {
    id?: true
    buyerId?: true
    dealId?: true
    eventType?: true
    createdAt?: true
  }

  export type BuyerActivityMaxAggregateInputType = {
    id?: true
    buyerId?: true
    dealId?: true
    eventType?: true
    createdAt?: true
  }

  export type BuyerActivityCountAggregateInputType = {
    id?: true
    buyerId?: true
    dealId?: true
    eventType?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type BuyerActivityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BuyerActivity to aggregate.
     */
    where?: BuyerActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuyerActivities to fetch.
     */
    orderBy?: BuyerActivityOrderByWithRelationInput | BuyerActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BuyerActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuyerActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuyerActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BuyerActivities
    **/
    _count?: true | BuyerActivityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BuyerActivityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BuyerActivityMaxAggregateInputType
  }

  export type GetBuyerActivityAggregateType<T extends BuyerActivityAggregateArgs> = {
        [P in keyof T & keyof AggregateBuyerActivity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBuyerActivity[P]>
      : GetScalarType<T[P], AggregateBuyerActivity[P]>
  }




  export type BuyerActivityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BuyerActivityWhereInput
    orderBy?: BuyerActivityOrderByWithAggregationInput | BuyerActivityOrderByWithAggregationInput[]
    by: BuyerActivityScalarFieldEnum[] | BuyerActivityScalarFieldEnum
    having?: BuyerActivityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BuyerActivityCountAggregateInputType | true
    _min?: BuyerActivityMinAggregateInputType
    _max?: BuyerActivityMaxAggregateInputType
  }

  export type BuyerActivityGroupByOutputType = {
    id: string
    buyerId: string
    dealId: string | null
    eventType: $Enums.BuyerActivityEventType
    metadata: JsonValue | null
    createdAt: Date
    _count: BuyerActivityCountAggregateOutputType | null
    _min: BuyerActivityMinAggregateOutputType | null
    _max: BuyerActivityMaxAggregateOutputType | null
  }

  type GetBuyerActivityGroupByPayload<T extends BuyerActivityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BuyerActivityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BuyerActivityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BuyerActivityGroupByOutputType[P]>
            : GetScalarType<T[P], BuyerActivityGroupByOutputType[P]>
        }
      >
    >


  export type BuyerActivitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    buyerId?: boolean
    dealId?: boolean
    eventType?: boolean
    metadata?: boolean
    createdAt?: boolean
    buyer?: boolean | BuyerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["buyerActivity"]>

  export type BuyerActivitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    buyerId?: boolean
    dealId?: boolean
    eventType?: boolean
    metadata?: boolean
    createdAt?: boolean
    buyer?: boolean | BuyerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["buyerActivity"]>

  export type BuyerActivitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    buyerId?: boolean
    dealId?: boolean
    eventType?: boolean
    metadata?: boolean
    createdAt?: boolean
    buyer?: boolean | BuyerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["buyerActivity"]>

  export type BuyerActivitySelectScalar = {
    id?: boolean
    buyerId?: boolean
    dealId?: boolean
    eventType?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type BuyerActivityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "buyerId" | "dealId" | "eventType" | "metadata" | "createdAt", ExtArgs["result"]["buyerActivity"]>
  export type BuyerActivityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    buyer?: boolean | BuyerDefaultArgs<ExtArgs>
  }
  export type BuyerActivityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    buyer?: boolean | BuyerDefaultArgs<ExtArgs>
  }
  export type BuyerActivityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    buyer?: boolean | BuyerDefaultArgs<ExtArgs>
  }

  export type $BuyerActivityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BuyerActivity"
    objects: {
      buyer: Prisma.$BuyerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      buyerId: string
      dealId: string | null
      eventType: $Enums.BuyerActivityEventType
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["buyerActivity"]>
    composites: {}
  }

  type BuyerActivityGetPayload<S extends boolean | null | undefined | BuyerActivityDefaultArgs> = $Result.GetResult<Prisma.$BuyerActivityPayload, S>

  type BuyerActivityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BuyerActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BuyerActivityCountAggregateInputType | true
    }

  export interface BuyerActivityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BuyerActivity'], meta: { name: 'BuyerActivity' } }
    /**
     * Find zero or one BuyerActivity that matches the filter.
     * @param {BuyerActivityFindUniqueArgs} args - Arguments to find a BuyerActivity
     * @example
     * // Get one BuyerActivity
     * const buyerActivity = await prisma.buyerActivity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BuyerActivityFindUniqueArgs>(args: SelectSubset<T, BuyerActivityFindUniqueArgs<ExtArgs>>): Prisma__BuyerActivityClient<$Result.GetResult<Prisma.$BuyerActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BuyerActivity that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BuyerActivityFindUniqueOrThrowArgs} args - Arguments to find a BuyerActivity
     * @example
     * // Get one BuyerActivity
     * const buyerActivity = await prisma.buyerActivity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BuyerActivityFindUniqueOrThrowArgs>(args: SelectSubset<T, BuyerActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BuyerActivityClient<$Result.GetResult<Prisma.$BuyerActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BuyerActivity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerActivityFindFirstArgs} args - Arguments to find a BuyerActivity
     * @example
     * // Get one BuyerActivity
     * const buyerActivity = await prisma.buyerActivity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BuyerActivityFindFirstArgs>(args?: SelectSubset<T, BuyerActivityFindFirstArgs<ExtArgs>>): Prisma__BuyerActivityClient<$Result.GetResult<Prisma.$BuyerActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BuyerActivity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerActivityFindFirstOrThrowArgs} args - Arguments to find a BuyerActivity
     * @example
     * // Get one BuyerActivity
     * const buyerActivity = await prisma.buyerActivity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BuyerActivityFindFirstOrThrowArgs>(args?: SelectSubset<T, BuyerActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma__BuyerActivityClient<$Result.GetResult<Prisma.$BuyerActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BuyerActivities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerActivityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BuyerActivities
     * const buyerActivities = await prisma.buyerActivity.findMany()
     * 
     * // Get first 10 BuyerActivities
     * const buyerActivities = await prisma.buyerActivity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const buyerActivityWithIdOnly = await prisma.buyerActivity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BuyerActivityFindManyArgs>(args?: SelectSubset<T, BuyerActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuyerActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BuyerActivity.
     * @param {BuyerActivityCreateArgs} args - Arguments to create a BuyerActivity.
     * @example
     * // Create one BuyerActivity
     * const BuyerActivity = await prisma.buyerActivity.create({
     *   data: {
     *     // ... data to create a BuyerActivity
     *   }
     * })
     * 
     */
    create<T extends BuyerActivityCreateArgs>(args: SelectSubset<T, BuyerActivityCreateArgs<ExtArgs>>): Prisma__BuyerActivityClient<$Result.GetResult<Prisma.$BuyerActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BuyerActivities.
     * @param {BuyerActivityCreateManyArgs} args - Arguments to create many BuyerActivities.
     * @example
     * // Create many BuyerActivities
     * const buyerActivity = await prisma.buyerActivity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BuyerActivityCreateManyArgs>(args?: SelectSubset<T, BuyerActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BuyerActivities and returns the data saved in the database.
     * @param {BuyerActivityCreateManyAndReturnArgs} args - Arguments to create many BuyerActivities.
     * @example
     * // Create many BuyerActivities
     * const buyerActivity = await prisma.buyerActivity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BuyerActivities and only return the `id`
     * const buyerActivityWithIdOnly = await prisma.buyerActivity.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BuyerActivityCreateManyAndReturnArgs>(args?: SelectSubset<T, BuyerActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuyerActivityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BuyerActivity.
     * @param {BuyerActivityDeleteArgs} args - Arguments to delete one BuyerActivity.
     * @example
     * // Delete one BuyerActivity
     * const BuyerActivity = await prisma.buyerActivity.delete({
     *   where: {
     *     // ... filter to delete one BuyerActivity
     *   }
     * })
     * 
     */
    delete<T extends BuyerActivityDeleteArgs>(args: SelectSubset<T, BuyerActivityDeleteArgs<ExtArgs>>): Prisma__BuyerActivityClient<$Result.GetResult<Prisma.$BuyerActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BuyerActivity.
     * @param {BuyerActivityUpdateArgs} args - Arguments to update one BuyerActivity.
     * @example
     * // Update one BuyerActivity
     * const buyerActivity = await prisma.buyerActivity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BuyerActivityUpdateArgs>(args: SelectSubset<T, BuyerActivityUpdateArgs<ExtArgs>>): Prisma__BuyerActivityClient<$Result.GetResult<Prisma.$BuyerActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BuyerActivities.
     * @param {BuyerActivityDeleteManyArgs} args - Arguments to filter BuyerActivities to delete.
     * @example
     * // Delete a few BuyerActivities
     * const { count } = await prisma.buyerActivity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BuyerActivityDeleteManyArgs>(args?: SelectSubset<T, BuyerActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BuyerActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerActivityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BuyerActivities
     * const buyerActivity = await prisma.buyerActivity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BuyerActivityUpdateManyArgs>(args: SelectSubset<T, BuyerActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BuyerActivities and returns the data updated in the database.
     * @param {BuyerActivityUpdateManyAndReturnArgs} args - Arguments to update many BuyerActivities.
     * @example
     * // Update many BuyerActivities
     * const buyerActivity = await prisma.buyerActivity.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BuyerActivities and only return the `id`
     * const buyerActivityWithIdOnly = await prisma.buyerActivity.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BuyerActivityUpdateManyAndReturnArgs>(args: SelectSubset<T, BuyerActivityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BuyerActivityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BuyerActivity.
     * @param {BuyerActivityUpsertArgs} args - Arguments to update or create a BuyerActivity.
     * @example
     * // Update or create a BuyerActivity
     * const buyerActivity = await prisma.buyerActivity.upsert({
     *   create: {
     *     // ... data to create a BuyerActivity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BuyerActivity we want to update
     *   }
     * })
     */
    upsert<T extends BuyerActivityUpsertArgs>(args: SelectSubset<T, BuyerActivityUpsertArgs<ExtArgs>>): Prisma__BuyerActivityClient<$Result.GetResult<Prisma.$BuyerActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BuyerActivities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerActivityCountArgs} args - Arguments to filter BuyerActivities to count.
     * @example
     * // Count the number of BuyerActivities
     * const count = await prisma.buyerActivity.count({
     *   where: {
     *     // ... the filter for the BuyerActivities we want to count
     *   }
     * })
    **/
    count<T extends BuyerActivityCountArgs>(
      args?: Subset<T, BuyerActivityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BuyerActivityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BuyerActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerActivityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BuyerActivityAggregateArgs>(args: Subset<T, BuyerActivityAggregateArgs>): Prisma.PrismaPromise<GetBuyerActivityAggregateType<T>>

    /**
     * Group by BuyerActivity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BuyerActivityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BuyerActivityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BuyerActivityGroupByArgs['orderBy'] }
        : { orderBy?: BuyerActivityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BuyerActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBuyerActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BuyerActivity model
   */
  readonly fields: BuyerActivityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BuyerActivity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BuyerActivityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    buyer<T extends BuyerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BuyerDefaultArgs<ExtArgs>>): Prisma__BuyerClient<$Result.GetResult<Prisma.$BuyerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BuyerActivity model
   */
  interface BuyerActivityFieldRefs {
    readonly id: FieldRef<"BuyerActivity", 'String'>
    readonly buyerId: FieldRef<"BuyerActivity", 'String'>
    readonly dealId: FieldRef<"BuyerActivity", 'String'>
    readonly eventType: FieldRef<"BuyerActivity", 'BuyerActivityEventType'>
    readonly metadata: FieldRef<"BuyerActivity", 'Json'>
    readonly createdAt: FieldRef<"BuyerActivity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BuyerActivity findUnique
   */
  export type BuyerActivityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityInclude<ExtArgs> | null
    /**
     * Filter, which BuyerActivity to fetch.
     */
    where: BuyerActivityWhereUniqueInput
  }

  /**
   * BuyerActivity findUniqueOrThrow
   */
  export type BuyerActivityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityInclude<ExtArgs> | null
    /**
     * Filter, which BuyerActivity to fetch.
     */
    where: BuyerActivityWhereUniqueInput
  }

  /**
   * BuyerActivity findFirst
   */
  export type BuyerActivityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityInclude<ExtArgs> | null
    /**
     * Filter, which BuyerActivity to fetch.
     */
    where?: BuyerActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuyerActivities to fetch.
     */
    orderBy?: BuyerActivityOrderByWithRelationInput | BuyerActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BuyerActivities.
     */
    cursor?: BuyerActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuyerActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuyerActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BuyerActivities.
     */
    distinct?: BuyerActivityScalarFieldEnum | BuyerActivityScalarFieldEnum[]
  }

  /**
   * BuyerActivity findFirstOrThrow
   */
  export type BuyerActivityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityInclude<ExtArgs> | null
    /**
     * Filter, which BuyerActivity to fetch.
     */
    where?: BuyerActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuyerActivities to fetch.
     */
    orderBy?: BuyerActivityOrderByWithRelationInput | BuyerActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BuyerActivities.
     */
    cursor?: BuyerActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuyerActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuyerActivities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BuyerActivities.
     */
    distinct?: BuyerActivityScalarFieldEnum | BuyerActivityScalarFieldEnum[]
  }

  /**
   * BuyerActivity findMany
   */
  export type BuyerActivityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityInclude<ExtArgs> | null
    /**
     * Filter, which BuyerActivities to fetch.
     */
    where?: BuyerActivityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BuyerActivities to fetch.
     */
    orderBy?: BuyerActivityOrderByWithRelationInput | BuyerActivityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BuyerActivities.
     */
    cursor?: BuyerActivityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BuyerActivities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BuyerActivities.
     */
    skip?: number
    distinct?: BuyerActivityScalarFieldEnum | BuyerActivityScalarFieldEnum[]
  }

  /**
   * BuyerActivity create
   */
  export type BuyerActivityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityInclude<ExtArgs> | null
    /**
     * The data needed to create a BuyerActivity.
     */
    data: XOR<BuyerActivityCreateInput, BuyerActivityUncheckedCreateInput>
  }

  /**
   * BuyerActivity createMany
   */
  export type BuyerActivityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BuyerActivities.
     */
    data: BuyerActivityCreateManyInput | BuyerActivityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BuyerActivity createManyAndReturn
   */
  export type BuyerActivityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * The data used to create many BuyerActivities.
     */
    data: BuyerActivityCreateManyInput | BuyerActivityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BuyerActivity update
   */
  export type BuyerActivityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityInclude<ExtArgs> | null
    /**
     * The data needed to update a BuyerActivity.
     */
    data: XOR<BuyerActivityUpdateInput, BuyerActivityUncheckedUpdateInput>
    /**
     * Choose, which BuyerActivity to update.
     */
    where: BuyerActivityWhereUniqueInput
  }

  /**
   * BuyerActivity updateMany
   */
  export type BuyerActivityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BuyerActivities.
     */
    data: XOR<BuyerActivityUpdateManyMutationInput, BuyerActivityUncheckedUpdateManyInput>
    /**
     * Filter which BuyerActivities to update
     */
    where?: BuyerActivityWhereInput
    /**
     * Limit how many BuyerActivities to update.
     */
    limit?: number
  }

  /**
   * BuyerActivity updateManyAndReturn
   */
  export type BuyerActivityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * The data used to update BuyerActivities.
     */
    data: XOR<BuyerActivityUpdateManyMutationInput, BuyerActivityUncheckedUpdateManyInput>
    /**
     * Filter which BuyerActivities to update
     */
    where?: BuyerActivityWhereInput
    /**
     * Limit how many BuyerActivities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BuyerActivity upsert
   */
  export type BuyerActivityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityInclude<ExtArgs> | null
    /**
     * The filter to search for the BuyerActivity to update in case it exists.
     */
    where: BuyerActivityWhereUniqueInput
    /**
     * In case the BuyerActivity found by the `where` argument doesn't exist, create a new BuyerActivity with this data.
     */
    create: XOR<BuyerActivityCreateInput, BuyerActivityUncheckedCreateInput>
    /**
     * In case the BuyerActivity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BuyerActivityUpdateInput, BuyerActivityUncheckedUpdateInput>
  }

  /**
   * BuyerActivity delete
   */
  export type BuyerActivityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityInclude<ExtArgs> | null
    /**
     * Filter which BuyerActivity to delete.
     */
    where: BuyerActivityWhereUniqueInput
  }

  /**
   * BuyerActivity deleteMany
   */
  export type BuyerActivityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BuyerActivities to delete
     */
    where?: BuyerActivityWhereInput
    /**
     * Limit how many BuyerActivities to delete.
     */
    limit?: number
  }

  /**
   * BuyerActivity without action
   */
  export type BuyerActivityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BuyerActivity
     */
    select?: BuyerActivitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the BuyerActivity
     */
    omit?: BuyerActivityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BuyerActivityInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const LeadScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phone: 'phone',
    propertyAddress: 'propertyAddress',
    source: 'source',
    status: 'status',
    score: 'score',
    priority: 'priority',
    notes: 'notes',
    payload: 'payload',
    lastContactedAt: 'lastContactedAt',
    nextFollowUpAt: 'nextFollowUpAt',
    followUpCount: 'followUpCount',
    lastFollowUpMessage: 'lastFollowUpMessage',
    automationStatus: 'automationStatus',
    isHot: 'isHot',
    lastSellerReply: 'lastSellerReply',
    lastSellerReplyAt: 'lastSellerReplyAt',
    lastSellerReplyIntent: 'lastSellerReplyIntent',
    lastSellerReplyConfidence: 'lastSellerReplyConfidence',
    suggestedReply: 'suggestedReply',
    requiresHumanApproval: 'requiresHumanApproval',
    doNotContact: 'doNotContact',
    optOutReason: 'optOutReason',
    optOutAt: 'optOutAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LeadScalarFieldEnum = (typeof LeadScalarFieldEnum)[keyof typeof LeadScalarFieldEnum]


  export const AiPerformanceMetricScalarFieldEnum: {
    id: 'id',
    date: 'date',
    totalLeads: 'totalLeads',
    newLeads: 'newLeads',
    contactedLeads: 'contactedLeads',
    negotiatingLeads: 'negotiatingLeads',
    underContractLeads: 'underContractLeads',
    closedLeads: 'closedLeads',
    sellerReplies: 'sellerReplies',
    aiClassifications: 'aiClassifications',
    avgConfidence: 'avgConfidence',
    humanApprovalsNeeded: 'humanApprovalsNeeded',
    suggestedReplies: 'suggestedReplies',
    dncCount: 'dncCount',
    hotLeads: 'hotLeads',
    automationScheduled: 'automationScheduled',
    automationIdle: 'automationIdle',
    staleNewLeads: 'staleNewLeads',
    overdueFollowUps: 'overdueFollowUps',
    systemWarnings: 'systemWarnings',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AiPerformanceMetricScalarFieldEnum = (typeof AiPerformanceMetricScalarFieldEnum)[keyof typeof AiPerformanceMetricScalarFieldEnum]


  export const AiJobScalarFieldEnum: {
    id: 'id',
    status: 'status',
    startedAt: 'startedAt',
    completedAt: 'completedAt',
    errorMessage: 'errorMessage',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AiJobScalarFieldEnum = (typeof AiJobScalarFieldEnum)[keyof typeof AiJobScalarFieldEnum]


  export const AiJobActionScalarFieldEnum: {
    id: 'id',
    jobId: 'jobId',
    action: 'action',
    count: 'count',
    createdAt: 'createdAt'
  };

  export type AiJobActionScalarFieldEnum = (typeof AiJobActionScalarFieldEnum)[keyof typeof AiJobActionScalarFieldEnum]


  export const AiJobLogScalarFieldEnum: {
    id: 'id',
    jobId: 'jobId',
    level: 'level',
    message: 'message',
    createdAt: 'createdAt'
  };

  export type AiJobLogScalarFieldEnum = (typeof AiJobLogScalarFieldEnum)[keyof typeof AiJobLogScalarFieldEnum]


  export const AiMemoryEventScalarFieldEnum: {
    id: 'id',
    leadId: 'leadId',
    jobId: 'jobId',
    actionId: 'actionId',
    eventType: 'eventType',
    source: 'source',
    sellerReply: 'sellerReply',
    aiSuggestedReply: 'aiSuggestedReply',
    humanFinalReply: 'humanFinalReply',
    approvalDecision: 'approvalDecision',
    messageChannel: 'messageChannel',
    messageStatus: 'messageStatus',
    sellerIntent: 'sellerIntent',
    sellerSentiment: 'sellerSentiment',
    confidence: 'confidence',
    outcome: 'outcome',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type AiMemoryEventScalarFieldEnum = (typeof AiMemoryEventScalarFieldEnum)[keyof typeof AiMemoryEventScalarFieldEnum]


  export const AiLearningRecommendationScalarFieldEnum: {
    id: 'id',
    type: 'type',
    title: 'title',
    description: 'description',
    recommendationData: 'recommendationData',
    applicationPlan: 'applicationPlan',
    confidence: 'confidence',
    status: 'status',
    createdAt: 'createdAt',
    reviewedAt: 'reviewedAt',
    appliedAt: 'appliedAt',
    autoPromotable: 'autoPromotable',
    promotedAt: 'promotedAt'
  };

  export type AiLearningRecommendationScalarFieldEnum = (typeof AiLearningRecommendationScalarFieldEnum)[keyof typeof AiLearningRecommendationScalarFieldEnum]


  export const BuyerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phone: 'phone',
    email: 'email',
    preferredLocations: 'preferredLocations',
    priceRangeMin: 'priceRangeMin',
    priceRangeMax: 'priceRangeMax',
    propertyTypes: 'propertyTypes',
    financingType: 'financingType',
    tier: 'tier',
    preferredDealSize: 'preferredDealSize',
    preferredCondition: 'preferredCondition',
    source: 'source',
    tags: 'tags',
    buyerQualityScore: 'buyerQualityScore',
    lastActiveAt: 'lastActiveAt',
    activityCount: 'activityCount',
    meaningfulActivityCount: 'meaningfulActivityCount',
    lastMeaningfulActivityAt: 'lastMeaningfulActivityAt',
    isActive: 'isActive',
    qualityReasons: 'qualityReasons',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type BuyerScalarFieldEnum = (typeof BuyerScalarFieldEnum)[keyof typeof BuyerScalarFieldEnum]


  export const BuyerActivityScalarFieldEnum: {
    id: 'id',
    buyerId: 'buyerId',
    dealId: 'dealId',
    eventType: 'eventType',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type BuyerActivityScalarFieldEnum = (typeof BuyerActivityScalarFieldEnum)[keyof typeof BuyerActivityScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'LeadStatus'
   */
  export type EnumLeadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeadStatus'>
    


  /**
   * Reference to a field of type 'LeadStatus[]'
   */
  export type ListEnumLeadStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LeadStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'BuyerTier'
   */
  export type EnumBuyerTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BuyerTier'>
    


  /**
   * Reference to a field of type 'BuyerTier[]'
   */
  export type ListEnumBuyerTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BuyerTier[]'>
    


  /**
   * Reference to a field of type 'BuyerActivityEventType'
   */
  export type EnumBuyerActivityEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BuyerActivityEventType'>
    


  /**
   * Reference to a field of type 'BuyerActivityEventType[]'
   */
  export type ListEnumBuyerActivityEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BuyerActivityEventType[]'>
    
  /**
   * Deep Input Types
   */


  export type LeadWhereInput = {
    AND?: LeadWhereInput | LeadWhereInput[]
    OR?: LeadWhereInput[]
    NOT?: LeadWhereInput | LeadWhereInput[]
    id?: StringFilter<"Lead"> | string
    name?: StringFilter<"Lead"> | string
    phone?: StringFilter<"Lead"> | string
    propertyAddress?: StringFilter<"Lead"> | string
    source?: StringFilter<"Lead"> | string
    status?: EnumLeadStatusFilter<"Lead"> | $Enums.LeadStatus
    score?: IntFilter<"Lead"> | number
    priority?: StringFilter<"Lead"> | string
    notes?: StringNullableFilter<"Lead"> | string | null
    payload?: StringNullableFilter<"Lead"> | string | null
    lastContactedAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    nextFollowUpAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    followUpCount?: IntFilter<"Lead"> | number
    lastFollowUpMessage?: StringNullableFilter<"Lead"> | string | null
    automationStatus?: StringFilter<"Lead"> | string
    isHot?: BoolFilter<"Lead"> | boolean
    lastSellerReply?: StringNullableFilter<"Lead"> | string | null
    lastSellerReplyAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    lastSellerReplyIntent?: StringNullableFilter<"Lead"> | string | null
    lastSellerReplyConfidence?: FloatNullableFilter<"Lead"> | number | null
    suggestedReply?: StringNullableFilter<"Lead"> | string | null
    requiresHumanApproval?: BoolFilter<"Lead"> | boolean
    doNotContact?: BoolFilter<"Lead"> | boolean
    optOutReason?: StringNullableFilter<"Lead"> | string | null
    optOutAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    updatedAt?: DateTimeFilter<"Lead"> | Date | string
  }

  export type LeadOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    propertyAddress?: SortOrder
    source?: SortOrder
    status?: SortOrder
    score?: SortOrder
    priority?: SortOrder
    notes?: SortOrderInput | SortOrder
    payload?: SortOrderInput | SortOrder
    lastContactedAt?: SortOrderInput | SortOrder
    nextFollowUpAt?: SortOrderInput | SortOrder
    followUpCount?: SortOrder
    lastFollowUpMessage?: SortOrderInput | SortOrder
    automationStatus?: SortOrder
    isHot?: SortOrder
    lastSellerReply?: SortOrderInput | SortOrder
    lastSellerReplyAt?: SortOrderInput | SortOrder
    lastSellerReplyIntent?: SortOrderInput | SortOrder
    lastSellerReplyConfidence?: SortOrderInput | SortOrder
    suggestedReply?: SortOrderInput | SortOrder
    requiresHumanApproval?: SortOrder
    doNotContact?: SortOrder
    optOutReason?: SortOrderInput | SortOrder
    optOutAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    propertyAddress_phone?: LeadPropertyAddressPhoneCompoundUniqueInput
    AND?: LeadWhereInput | LeadWhereInput[]
    OR?: LeadWhereInput[]
    NOT?: LeadWhereInput | LeadWhereInput[]
    name?: StringFilter<"Lead"> | string
    phone?: StringFilter<"Lead"> | string
    propertyAddress?: StringFilter<"Lead"> | string
    source?: StringFilter<"Lead"> | string
    status?: EnumLeadStatusFilter<"Lead"> | $Enums.LeadStatus
    score?: IntFilter<"Lead"> | number
    priority?: StringFilter<"Lead"> | string
    notes?: StringNullableFilter<"Lead"> | string | null
    payload?: StringNullableFilter<"Lead"> | string | null
    lastContactedAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    nextFollowUpAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    followUpCount?: IntFilter<"Lead"> | number
    lastFollowUpMessage?: StringNullableFilter<"Lead"> | string | null
    automationStatus?: StringFilter<"Lead"> | string
    isHot?: BoolFilter<"Lead"> | boolean
    lastSellerReply?: StringNullableFilter<"Lead"> | string | null
    lastSellerReplyAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    lastSellerReplyIntent?: StringNullableFilter<"Lead"> | string | null
    lastSellerReplyConfidence?: FloatNullableFilter<"Lead"> | number | null
    suggestedReply?: StringNullableFilter<"Lead"> | string | null
    requiresHumanApproval?: BoolFilter<"Lead"> | boolean
    doNotContact?: BoolFilter<"Lead"> | boolean
    optOutReason?: StringNullableFilter<"Lead"> | string | null
    optOutAt?: DateTimeNullableFilter<"Lead"> | Date | string | null
    createdAt?: DateTimeFilter<"Lead"> | Date | string
    updatedAt?: DateTimeFilter<"Lead"> | Date | string
  }, "id" | "propertyAddress_phone">

  export type LeadOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    propertyAddress?: SortOrder
    source?: SortOrder
    status?: SortOrder
    score?: SortOrder
    priority?: SortOrder
    notes?: SortOrderInput | SortOrder
    payload?: SortOrderInput | SortOrder
    lastContactedAt?: SortOrderInput | SortOrder
    nextFollowUpAt?: SortOrderInput | SortOrder
    followUpCount?: SortOrder
    lastFollowUpMessage?: SortOrderInput | SortOrder
    automationStatus?: SortOrder
    isHot?: SortOrder
    lastSellerReply?: SortOrderInput | SortOrder
    lastSellerReplyAt?: SortOrderInput | SortOrder
    lastSellerReplyIntent?: SortOrderInput | SortOrder
    lastSellerReplyConfidence?: SortOrderInput | SortOrder
    suggestedReply?: SortOrderInput | SortOrder
    requiresHumanApproval?: SortOrder
    doNotContact?: SortOrder
    optOutReason?: SortOrderInput | SortOrder
    optOutAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LeadCountOrderByAggregateInput
    _avg?: LeadAvgOrderByAggregateInput
    _max?: LeadMaxOrderByAggregateInput
    _min?: LeadMinOrderByAggregateInput
    _sum?: LeadSumOrderByAggregateInput
  }

  export type LeadScalarWhereWithAggregatesInput = {
    AND?: LeadScalarWhereWithAggregatesInput | LeadScalarWhereWithAggregatesInput[]
    OR?: LeadScalarWhereWithAggregatesInput[]
    NOT?: LeadScalarWhereWithAggregatesInput | LeadScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Lead"> | string
    name?: StringWithAggregatesFilter<"Lead"> | string
    phone?: StringWithAggregatesFilter<"Lead"> | string
    propertyAddress?: StringWithAggregatesFilter<"Lead"> | string
    source?: StringWithAggregatesFilter<"Lead"> | string
    status?: EnumLeadStatusWithAggregatesFilter<"Lead"> | $Enums.LeadStatus
    score?: IntWithAggregatesFilter<"Lead"> | number
    priority?: StringWithAggregatesFilter<"Lead"> | string
    notes?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    payload?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    lastContactedAt?: DateTimeNullableWithAggregatesFilter<"Lead"> | Date | string | null
    nextFollowUpAt?: DateTimeNullableWithAggregatesFilter<"Lead"> | Date | string | null
    followUpCount?: IntWithAggregatesFilter<"Lead"> | number
    lastFollowUpMessage?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    automationStatus?: StringWithAggregatesFilter<"Lead"> | string
    isHot?: BoolWithAggregatesFilter<"Lead"> | boolean
    lastSellerReply?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    lastSellerReplyAt?: DateTimeNullableWithAggregatesFilter<"Lead"> | Date | string | null
    lastSellerReplyIntent?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    lastSellerReplyConfidence?: FloatNullableWithAggregatesFilter<"Lead"> | number | null
    suggestedReply?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    requiresHumanApproval?: BoolWithAggregatesFilter<"Lead"> | boolean
    doNotContact?: BoolWithAggregatesFilter<"Lead"> | boolean
    optOutReason?: StringNullableWithAggregatesFilter<"Lead"> | string | null
    optOutAt?: DateTimeNullableWithAggregatesFilter<"Lead"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Lead"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Lead"> | Date | string
  }

  export type AiPerformanceMetricWhereInput = {
    AND?: AiPerformanceMetricWhereInput | AiPerformanceMetricWhereInput[]
    OR?: AiPerformanceMetricWhereInput[]
    NOT?: AiPerformanceMetricWhereInput | AiPerformanceMetricWhereInput[]
    id?: StringFilter<"AiPerformanceMetric"> | string
    date?: DateTimeFilter<"AiPerformanceMetric"> | Date | string
    totalLeads?: IntFilter<"AiPerformanceMetric"> | number
    newLeads?: IntFilter<"AiPerformanceMetric"> | number
    contactedLeads?: IntFilter<"AiPerformanceMetric"> | number
    negotiatingLeads?: IntFilter<"AiPerformanceMetric"> | number
    underContractLeads?: IntFilter<"AiPerformanceMetric"> | number
    closedLeads?: IntFilter<"AiPerformanceMetric"> | number
    sellerReplies?: IntFilter<"AiPerformanceMetric"> | number
    aiClassifications?: IntFilter<"AiPerformanceMetric"> | number
    avgConfidence?: FloatFilter<"AiPerformanceMetric"> | number
    humanApprovalsNeeded?: IntFilter<"AiPerformanceMetric"> | number
    suggestedReplies?: IntFilter<"AiPerformanceMetric"> | number
    dncCount?: IntFilter<"AiPerformanceMetric"> | number
    hotLeads?: IntFilter<"AiPerformanceMetric"> | number
    automationScheduled?: IntFilter<"AiPerformanceMetric"> | number
    automationIdle?: IntFilter<"AiPerformanceMetric"> | number
    staleNewLeads?: IntFilter<"AiPerformanceMetric"> | number
    overdueFollowUps?: IntFilter<"AiPerformanceMetric"> | number
    systemWarnings?: JsonNullableFilter<"AiPerformanceMetric">
    createdAt?: DateTimeFilter<"AiPerformanceMetric"> | Date | string
    updatedAt?: DateTimeFilter<"AiPerformanceMetric"> | Date | string
  }

  export type AiPerformanceMetricOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    totalLeads?: SortOrder
    newLeads?: SortOrder
    contactedLeads?: SortOrder
    negotiatingLeads?: SortOrder
    underContractLeads?: SortOrder
    closedLeads?: SortOrder
    sellerReplies?: SortOrder
    aiClassifications?: SortOrder
    avgConfidence?: SortOrder
    humanApprovalsNeeded?: SortOrder
    suggestedReplies?: SortOrder
    dncCount?: SortOrder
    hotLeads?: SortOrder
    automationScheduled?: SortOrder
    automationIdle?: SortOrder
    staleNewLeads?: SortOrder
    overdueFollowUps?: SortOrder
    systemWarnings?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiPerformanceMetricWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    date?: Date | string
    AND?: AiPerformanceMetricWhereInput | AiPerformanceMetricWhereInput[]
    OR?: AiPerformanceMetricWhereInput[]
    NOT?: AiPerformanceMetricWhereInput | AiPerformanceMetricWhereInput[]
    totalLeads?: IntFilter<"AiPerformanceMetric"> | number
    newLeads?: IntFilter<"AiPerformanceMetric"> | number
    contactedLeads?: IntFilter<"AiPerformanceMetric"> | number
    negotiatingLeads?: IntFilter<"AiPerformanceMetric"> | number
    underContractLeads?: IntFilter<"AiPerformanceMetric"> | number
    closedLeads?: IntFilter<"AiPerformanceMetric"> | number
    sellerReplies?: IntFilter<"AiPerformanceMetric"> | number
    aiClassifications?: IntFilter<"AiPerformanceMetric"> | number
    avgConfidence?: FloatFilter<"AiPerformanceMetric"> | number
    humanApprovalsNeeded?: IntFilter<"AiPerformanceMetric"> | number
    suggestedReplies?: IntFilter<"AiPerformanceMetric"> | number
    dncCount?: IntFilter<"AiPerformanceMetric"> | number
    hotLeads?: IntFilter<"AiPerformanceMetric"> | number
    automationScheduled?: IntFilter<"AiPerformanceMetric"> | number
    automationIdle?: IntFilter<"AiPerformanceMetric"> | number
    staleNewLeads?: IntFilter<"AiPerformanceMetric"> | number
    overdueFollowUps?: IntFilter<"AiPerformanceMetric"> | number
    systemWarnings?: JsonNullableFilter<"AiPerformanceMetric">
    createdAt?: DateTimeFilter<"AiPerformanceMetric"> | Date | string
    updatedAt?: DateTimeFilter<"AiPerformanceMetric"> | Date | string
  }, "id" | "date">

  export type AiPerformanceMetricOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    totalLeads?: SortOrder
    newLeads?: SortOrder
    contactedLeads?: SortOrder
    negotiatingLeads?: SortOrder
    underContractLeads?: SortOrder
    closedLeads?: SortOrder
    sellerReplies?: SortOrder
    aiClassifications?: SortOrder
    avgConfidence?: SortOrder
    humanApprovalsNeeded?: SortOrder
    suggestedReplies?: SortOrder
    dncCount?: SortOrder
    hotLeads?: SortOrder
    automationScheduled?: SortOrder
    automationIdle?: SortOrder
    staleNewLeads?: SortOrder
    overdueFollowUps?: SortOrder
    systemWarnings?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AiPerformanceMetricCountOrderByAggregateInput
    _avg?: AiPerformanceMetricAvgOrderByAggregateInput
    _max?: AiPerformanceMetricMaxOrderByAggregateInput
    _min?: AiPerformanceMetricMinOrderByAggregateInput
    _sum?: AiPerformanceMetricSumOrderByAggregateInput
  }

  export type AiPerformanceMetricScalarWhereWithAggregatesInput = {
    AND?: AiPerformanceMetricScalarWhereWithAggregatesInput | AiPerformanceMetricScalarWhereWithAggregatesInput[]
    OR?: AiPerformanceMetricScalarWhereWithAggregatesInput[]
    NOT?: AiPerformanceMetricScalarWhereWithAggregatesInput | AiPerformanceMetricScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiPerformanceMetric"> | string
    date?: DateTimeWithAggregatesFilter<"AiPerformanceMetric"> | Date | string
    totalLeads?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    newLeads?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    contactedLeads?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    negotiatingLeads?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    underContractLeads?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    closedLeads?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    sellerReplies?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    aiClassifications?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    avgConfidence?: FloatWithAggregatesFilter<"AiPerformanceMetric"> | number
    humanApprovalsNeeded?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    suggestedReplies?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    dncCount?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    hotLeads?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    automationScheduled?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    automationIdle?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    staleNewLeads?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    overdueFollowUps?: IntWithAggregatesFilter<"AiPerformanceMetric"> | number
    systemWarnings?: JsonNullableWithAggregatesFilter<"AiPerformanceMetric">
    createdAt?: DateTimeWithAggregatesFilter<"AiPerformanceMetric"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AiPerformanceMetric"> | Date | string
  }

  export type AiJobWhereInput = {
    AND?: AiJobWhereInput | AiJobWhereInput[]
    OR?: AiJobWhereInput[]
    NOT?: AiJobWhereInput | AiJobWhereInput[]
    id?: StringFilter<"AiJob"> | string
    status?: StringFilter<"AiJob"> | string
    startedAt?: DateTimeFilter<"AiJob"> | Date | string
    completedAt?: DateTimeNullableFilter<"AiJob"> | Date | string | null
    errorMessage?: StringNullableFilter<"AiJob"> | string | null
    createdAt?: DateTimeFilter<"AiJob"> | Date | string
    updatedAt?: DateTimeFilter<"AiJob"> | Date | string
    actions?: AiJobActionListRelationFilter
    logs?: AiJobLogListRelationFilter
  }

  export type AiJobOrderByWithRelationInput = {
    id?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    actions?: AiJobActionOrderByRelationAggregateInput
    logs?: AiJobLogOrderByRelationAggregateInput
  }

  export type AiJobWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiJobWhereInput | AiJobWhereInput[]
    OR?: AiJobWhereInput[]
    NOT?: AiJobWhereInput | AiJobWhereInput[]
    status?: StringFilter<"AiJob"> | string
    startedAt?: DateTimeFilter<"AiJob"> | Date | string
    completedAt?: DateTimeNullableFilter<"AiJob"> | Date | string | null
    errorMessage?: StringNullableFilter<"AiJob"> | string | null
    createdAt?: DateTimeFilter<"AiJob"> | Date | string
    updatedAt?: DateTimeFilter<"AiJob"> | Date | string
    actions?: AiJobActionListRelationFilter
    logs?: AiJobLogListRelationFilter
  }, "id">

  export type AiJobOrderByWithAggregationInput = {
    id?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AiJobCountOrderByAggregateInput
    _max?: AiJobMaxOrderByAggregateInput
    _min?: AiJobMinOrderByAggregateInput
  }

  export type AiJobScalarWhereWithAggregatesInput = {
    AND?: AiJobScalarWhereWithAggregatesInput | AiJobScalarWhereWithAggregatesInput[]
    OR?: AiJobScalarWhereWithAggregatesInput[]
    NOT?: AiJobScalarWhereWithAggregatesInput | AiJobScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiJob"> | string
    status?: StringWithAggregatesFilter<"AiJob"> | string
    startedAt?: DateTimeWithAggregatesFilter<"AiJob"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"AiJob"> | Date | string | null
    errorMessage?: StringNullableWithAggregatesFilter<"AiJob"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AiJob"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"AiJob"> | Date | string
  }

  export type AiJobActionWhereInput = {
    AND?: AiJobActionWhereInput | AiJobActionWhereInput[]
    OR?: AiJobActionWhereInput[]
    NOT?: AiJobActionWhereInput | AiJobActionWhereInput[]
    id?: StringFilter<"AiJobAction"> | string
    jobId?: StringFilter<"AiJobAction"> | string
    action?: StringFilter<"AiJobAction"> | string
    count?: IntFilter<"AiJobAction"> | number
    createdAt?: DateTimeFilter<"AiJobAction"> | Date | string
    job?: XOR<AiJobScalarRelationFilter, AiJobWhereInput>
  }

  export type AiJobActionOrderByWithRelationInput = {
    id?: SortOrder
    jobId?: SortOrder
    action?: SortOrder
    count?: SortOrder
    createdAt?: SortOrder
    job?: AiJobOrderByWithRelationInput
  }

  export type AiJobActionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiJobActionWhereInput | AiJobActionWhereInput[]
    OR?: AiJobActionWhereInput[]
    NOT?: AiJobActionWhereInput | AiJobActionWhereInput[]
    jobId?: StringFilter<"AiJobAction"> | string
    action?: StringFilter<"AiJobAction"> | string
    count?: IntFilter<"AiJobAction"> | number
    createdAt?: DateTimeFilter<"AiJobAction"> | Date | string
    job?: XOR<AiJobScalarRelationFilter, AiJobWhereInput>
  }, "id">

  export type AiJobActionOrderByWithAggregationInput = {
    id?: SortOrder
    jobId?: SortOrder
    action?: SortOrder
    count?: SortOrder
    createdAt?: SortOrder
    _count?: AiJobActionCountOrderByAggregateInput
    _avg?: AiJobActionAvgOrderByAggregateInput
    _max?: AiJobActionMaxOrderByAggregateInput
    _min?: AiJobActionMinOrderByAggregateInput
    _sum?: AiJobActionSumOrderByAggregateInput
  }

  export type AiJobActionScalarWhereWithAggregatesInput = {
    AND?: AiJobActionScalarWhereWithAggregatesInput | AiJobActionScalarWhereWithAggregatesInput[]
    OR?: AiJobActionScalarWhereWithAggregatesInput[]
    NOT?: AiJobActionScalarWhereWithAggregatesInput | AiJobActionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiJobAction"> | string
    jobId?: StringWithAggregatesFilter<"AiJobAction"> | string
    action?: StringWithAggregatesFilter<"AiJobAction"> | string
    count?: IntWithAggregatesFilter<"AiJobAction"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AiJobAction"> | Date | string
  }

  export type AiJobLogWhereInput = {
    AND?: AiJobLogWhereInput | AiJobLogWhereInput[]
    OR?: AiJobLogWhereInput[]
    NOT?: AiJobLogWhereInput | AiJobLogWhereInput[]
    id?: StringFilter<"AiJobLog"> | string
    jobId?: StringFilter<"AiJobLog"> | string
    level?: StringFilter<"AiJobLog"> | string
    message?: StringFilter<"AiJobLog"> | string
    createdAt?: DateTimeFilter<"AiJobLog"> | Date | string
    job?: XOR<AiJobScalarRelationFilter, AiJobWhereInput>
  }

  export type AiJobLogOrderByWithRelationInput = {
    id?: SortOrder
    jobId?: SortOrder
    level?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    job?: AiJobOrderByWithRelationInput
  }

  export type AiJobLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiJobLogWhereInput | AiJobLogWhereInput[]
    OR?: AiJobLogWhereInput[]
    NOT?: AiJobLogWhereInput | AiJobLogWhereInput[]
    jobId?: StringFilter<"AiJobLog"> | string
    level?: StringFilter<"AiJobLog"> | string
    message?: StringFilter<"AiJobLog"> | string
    createdAt?: DateTimeFilter<"AiJobLog"> | Date | string
    job?: XOR<AiJobScalarRelationFilter, AiJobWhereInput>
  }, "id">

  export type AiJobLogOrderByWithAggregationInput = {
    id?: SortOrder
    jobId?: SortOrder
    level?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    _count?: AiJobLogCountOrderByAggregateInput
    _max?: AiJobLogMaxOrderByAggregateInput
    _min?: AiJobLogMinOrderByAggregateInput
  }

  export type AiJobLogScalarWhereWithAggregatesInput = {
    AND?: AiJobLogScalarWhereWithAggregatesInput | AiJobLogScalarWhereWithAggregatesInput[]
    OR?: AiJobLogScalarWhereWithAggregatesInput[]
    NOT?: AiJobLogScalarWhereWithAggregatesInput | AiJobLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiJobLog"> | string
    jobId?: StringWithAggregatesFilter<"AiJobLog"> | string
    level?: StringWithAggregatesFilter<"AiJobLog"> | string
    message?: StringWithAggregatesFilter<"AiJobLog"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AiJobLog"> | Date | string
  }

  export type AiMemoryEventWhereInput = {
    AND?: AiMemoryEventWhereInput | AiMemoryEventWhereInput[]
    OR?: AiMemoryEventWhereInput[]
    NOT?: AiMemoryEventWhereInput | AiMemoryEventWhereInput[]
    id?: StringFilter<"AiMemoryEvent"> | string
    leadId?: StringNullableFilter<"AiMemoryEvent"> | string | null
    jobId?: StringNullableFilter<"AiMemoryEvent"> | string | null
    actionId?: StringNullableFilter<"AiMemoryEvent"> | string | null
    eventType?: StringFilter<"AiMemoryEvent"> | string
    source?: StringFilter<"AiMemoryEvent"> | string
    sellerReply?: StringNullableFilter<"AiMemoryEvent"> | string | null
    aiSuggestedReply?: StringNullableFilter<"AiMemoryEvent"> | string | null
    humanFinalReply?: StringNullableFilter<"AiMemoryEvent"> | string | null
    approvalDecision?: StringNullableFilter<"AiMemoryEvent"> | string | null
    messageChannel?: StringNullableFilter<"AiMemoryEvent"> | string | null
    messageStatus?: StringNullableFilter<"AiMemoryEvent"> | string | null
    sellerIntent?: StringNullableFilter<"AiMemoryEvent"> | string | null
    sellerSentiment?: StringNullableFilter<"AiMemoryEvent"> | string | null
    confidence?: FloatNullableFilter<"AiMemoryEvent"> | number | null
    outcome?: StringNullableFilter<"AiMemoryEvent"> | string | null
    metadata?: JsonNullableFilter<"AiMemoryEvent">
    createdAt?: DateTimeFilter<"AiMemoryEvent"> | Date | string
  }

  export type AiMemoryEventOrderByWithRelationInput = {
    id?: SortOrder
    leadId?: SortOrderInput | SortOrder
    jobId?: SortOrderInput | SortOrder
    actionId?: SortOrderInput | SortOrder
    eventType?: SortOrder
    source?: SortOrder
    sellerReply?: SortOrderInput | SortOrder
    aiSuggestedReply?: SortOrderInput | SortOrder
    humanFinalReply?: SortOrderInput | SortOrder
    approvalDecision?: SortOrderInput | SortOrder
    messageChannel?: SortOrderInput | SortOrder
    messageStatus?: SortOrderInput | SortOrder
    sellerIntent?: SortOrderInput | SortOrder
    sellerSentiment?: SortOrderInput | SortOrder
    confidence?: SortOrderInput | SortOrder
    outcome?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AiMemoryEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiMemoryEventWhereInput | AiMemoryEventWhereInput[]
    OR?: AiMemoryEventWhereInput[]
    NOT?: AiMemoryEventWhereInput | AiMemoryEventWhereInput[]
    leadId?: StringNullableFilter<"AiMemoryEvent"> | string | null
    jobId?: StringNullableFilter<"AiMemoryEvent"> | string | null
    actionId?: StringNullableFilter<"AiMemoryEvent"> | string | null
    eventType?: StringFilter<"AiMemoryEvent"> | string
    source?: StringFilter<"AiMemoryEvent"> | string
    sellerReply?: StringNullableFilter<"AiMemoryEvent"> | string | null
    aiSuggestedReply?: StringNullableFilter<"AiMemoryEvent"> | string | null
    humanFinalReply?: StringNullableFilter<"AiMemoryEvent"> | string | null
    approvalDecision?: StringNullableFilter<"AiMemoryEvent"> | string | null
    messageChannel?: StringNullableFilter<"AiMemoryEvent"> | string | null
    messageStatus?: StringNullableFilter<"AiMemoryEvent"> | string | null
    sellerIntent?: StringNullableFilter<"AiMemoryEvent"> | string | null
    sellerSentiment?: StringNullableFilter<"AiMemoryEvent"> | string | null
    confidence?: FloatNullableFilter<"AiMemoryEvent"> | number | null
    outcome?: StringNullableFilter<"AiMemoryEvent"> | string | null
    metadata?: JsonNullableFilter<"AiMemoryEvent">
    createdAt?: DateTimeFilter<"AiMemoryEvent"> | Date | string
  }, "id">

  export type AiMemoryEventOrderByWithAggregationInput = {
    id?: SortOrder
    leadId?: SortOrderInput | SortOrder
    jobId?: SortOrderInput | SortOrder
    actionId?: SortOrderInput | SortOrder
    eventType?: SortOrder
    source?: SortOrder
    sellerReply?: SortOrderInput | SortOrder
    aiSuggestedReply?: SortOrderInput | SortOrder
    humanFinalReply?: SortOrderInput | SortOrder
    approvalDecision?: SortOrderInput | SortOrder
    messageChannel?: SortOrderInput | SortOrder
    messageStatus?: SortOrderInput | SortOrder
    sellerIntent?: SortOrderInput | SortOrder
    sellerSentiment?: SortOrderInput | SortOrder
    confidence?: SortOrderInput | SortOrder
    outcome?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AiMemoryEventCountOrderByAggregateInput
    _avg?: AiMemoryEventAvgOrderByAggregateInput
    _max?: AiMemoryEventMaxOrderByAggregateInput
    _min?: AiMemoryEventMinOrderByAggregateInput
    _sum?: AiMemoryEventSumOrderByAggregateInput
  }

  export type AiMemoryEventScalarWhereWithAggregatesInput = {
    AND?: AiMemoryEventScalarWhereWithAggregatesInput | AiMemoryEventScalarWhereWithAggregatesInput[]
    OR?: AiMemoryEventScalarWhereWithAggregatesInput[]
    NOT?: AiMemoryEventScalarWhereWithAggregatesInput | AiMemoryEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiMemoryEvent"> | string
    leadId?: StringNullableWithAggregatesFilter<"AiMemoryEvent"> | string | null
    jobId?: StringNullableWithAggregatesFilter<"AiMemoryEvent"> | string | null
    actionId?: StringNullableWithAggregatesFilter<"AiMemoryEvent"> | string | null
    eventType?: StringWithAggregatesFilter<"AiMemoryEvent"> | string
    source?: StringWithAggregatesFilter<"AiMemoryEvent"> | string
    sellerReply?: StringNullableWithAggregatesFilter<"AiMemoryEvent"> | string | null
    aiSuggestedReply?: StringNullableWithAggregatesFilter<"AiMemoryEvent"> | string | null
    humanFinalReply?: StringNullableWithAggregatesFilter<"AiMemoryEvent"> | string | null
    approvalDecision?: StringNullableWithAggregatesFilter<"AiMemoryEvent"> | string | null
    messageChannel?: StringNullableWithAggregatesFilter<"AiMemoryEvent"> | string | null
    messageStatus?: StringNullableWithAggregatesFilter<"AiMemoryEvent"> | string | null
    sellerIntent?: StringNullableWithAggregatesFilter<"AiMemoryEvent"> | string | null
    sellerSentiment?: StringNullableWithAggregatesFilter<"AiMemoryEvent"> | string | null
    confidence?: FloatNullableWithAggregatesFilter<"AiMemoryEvent"> | number | null
    outcome?: StringNullableWithAggregatesFilter<"AiMemoryEvent"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"AiMemoryEvent">
    createdAt?: DateTimeWithAggregatesFilter<"AiMemoryEvent"> | Date | string
  }

  export type AiLearningRecommendationWhereInput = {
    AND?: AiLearningRecommendationWhereInput | AiLearningRecommendationWhereInput[]
    OR?: AiLearningRecommendationWhereInput[]
    NOT?: AiLearningRecommendationWhereInput | AiLearningRecommendationWhereInput[]
    id?: StringFilter<"AiLearningRecommendation"> | string
    type?: StringFilter<"AiLearningRecommendation"> | string
    title?: StringFilter<"AiLearningRecommendation"> | string
    description?: StringFilter<"AiLearningRecommendation"> | string
    recommendationData?: JsonNullableFilter<"AiLearningRecommendation">
    applicationPlan?: JsonNullableFilter<"AiLearningRecommendation">
    confidence?: FloatFilter<"AiLearningRecommendation"> | number
    status?: StringFilter<"AiLearningRecommendation"> | string
    createdAt?: DateTimeFilter<"AiLearningRecommendation"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"AiLearningRecommendation"> | Date | string | null
    appliedAt?: DateTimeNullableFilter<"AiLearningRecommendation"> | Date | string | null
    autoPromotable?: BoolFilter<"AiLearningRecommendation"> | boolean
    promotedAt?: DateTimeNullableFilter<"AiLearningRecommendation"> | Date | string | null
  }

  export type AiLearningRecommendationOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    recommendationData?: SortOrderInput | SortOrder
    applicationPlan?: SortOrderInput | SortOrder
    confidence?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    appliedAt?: SortOrderInput | SortOrder
    autoPromotable?: SortOrder
    promotedAt?: SortOrderInput | SortOrder
  }

  export type AiLearningRecommendationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AiLearningRecommendationWhereInput | AiLearningRecommendationWhereInput[]
    OR?: AiLearningRecommendationWhereInput[]
    NOT?: AiLearningRecommendationWhereInput | AiLearningRecommendationWhereInput[]
    type?: StringFilter<"AiLearningRecommendation"> | string
    title?: StringFilter<"AiLearningRecommendation"> | string
    description?: StringFilter<"AiLearningRecommendation"> | string
    recommendationData?: JsonNullableFilter<"AiLearningRecommendation">
    applicationPlan?: JsonNullableFilter<"AiLearningRecommendation">
    confidence?: FloatFilter<"AiLearningRecommendation"> | number
    status?: StringFilter<"AiLearningRecommendation"> | string
    createdAt?: DateTimeFilter<"AiLearningRecommendation"> | Date | string
    reviewedAt?: DateTimeNullableFilter<"AiLearningRecommendation"> | Date | string | null
    appliedAt?: DateTimeNullableFilter<"AiLearningRecommendation"> | Date | string | null
    autoPromotable?: BoolFilter<"AiLearningRecommendation"> | boolean
    promotedAt?: DateTimeNullableFilter<"AiLearningRecommendation"> | Date | string | null
  }, "id">

  export type AiLearningRecommendationOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    recommendationData?: SortOrderInput | SortOrder
    applicationPlan?: SortOrderInput | SortOrder
    confidence?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    appliedAt?: SortOrderInput | SortOrder
    autoPromotable?: SortOrder
    promotedAt?: SortOrderInput | SortOrder
    _count?: AiLearningRecommendationCountOrderByAggregateInput
    _avg?: AiLearningRecommendationAvgOrderByAggregateInput
    _max?: AiLearningRecommendationMaxOrderByAggregateInput
    _min?: AiLearningRecommendationMinOrderByAggregateInput
    _sum?: AiLearningRecommendationSumOrderByAggregateInput
  }

  export type AiLearningRecommendationScalarWhereWithAggregatesInput = {
    AND?: AiLearningRecommendationScalarWhereWithAggregatesInput | AiLearningRecommendationScalarWhereWithAggregatesInput[]
    OR?: AiLearningRecommendationScalarWhereWithAggregatesInput[]
    NOT?: AiLearningRecommendationScalarWhereWithAggregatesInput | AiLearningRecommendationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AiLearningRecommendation"> | string
    type?: StringWithAggregatesFilter<"AiLearningRecommendation"> | string
    title?: StringWithAggregatesFilter<"AiLearningRecommendation"> | string
    description?: StringWithAggregatesFilter<"AiLearningRecommendation"> | string
    recommendationData?: JsonNullableWithAggregatesFilter<"AiLearningRecommendation">
    applicationPlan?: JsonNullableWithAggregatesFilter<"AiLearningRecommendation">
    confidence?: FloatWithAggregatesFilter<"AiLearningRecommendation"> | number
    status?: StringWithAggregatesFilter<"AiLearningRecommendation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AiLearningRecommendation"> | Date | string
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"AiLearningRecommendation"> | Date | string | null
    appliedAt?: DateTimeNullableWithAggregatesFilter<"AiLearningRecommendation"> | Date | string | null
    autoPromotable?: BoolWithAggregatesFilter<"AiLearningRecommendation"> | boolean
    promotedAt?: DateTimeNullableWithAggregatesFilter<"AiLearningRecommendation"> | Date | string | null
  }

  export type BuyerWhereInput = {
    AND?: BuyerWhereInput | BuyerWhereInput[]
    OR?: BuyerWhereInput[]
    NOT?: BuyerWhereInput | BuyerWhereInput[]
    id?: StringFilter<"Buyer"> | string
    name?: StringFilter<"Buyer"> | string
    phone?: StringNullableFilter<"Buyer"> | string | null
    email?: StringNullableFilter<"Buyer"> | string | null
    preferredLocations?: JsonNullableFilter<"Buyer">
    priceRangeMin?: IntNullableFilter<"Buyer"> | number | null
    priceRangeMax?: IntNullableFilter<"Buyer"> | number | null
    propertyTypes?: JsonNullableFilter<"Buyer">
    financingType?: StringNullableFilter<"Buyer"> | string | null
    tier?: EnumBuyerTierFilter<"Buyer"> | $Enums.BuyerTier
    preferredDealSize?: IntNullableFilter<"Buyer"> | number | null
    preferredCondition?: StringNullableFilter<"Buyer"> | string | null
    source?: StringNullableFilter<"Buyer"> | string | null
    tags?: JsonNullableFilter<"Buyer">
    buyerQualityScore?: IntFilter<"Buyer"> | number
    lastActiveAt?: DateTimeNullableFilter<"Buyer"> | Date | string | null
    activityCount?: IntFilter<"Buyer"> | number
    meaningfulActivityCount?: IntFilter<"Buyer"> | number
    lastMeaningfulActivityAt?: DateTimeNullableFilter<"Buyer"> | Date | string | null
    isActive?: BoolFilter<"Buyer"> | boolean
    qualityReasons?: JsonNullableFilter<"Buyer">
    createdAt?: DateTimeFilter<"Buyer"> | Date | string
    updatedAt?: DateTimeFilter<"Buyer"> | Date | string
    activities?: BuyerActivityListRelationFilter
  }

  export type BuyerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    preferredLocations?: SortOrderInput | SortOrder
    priceRangeMin?: SortOrderInput | SortOrder
    priceRangeMax?: SortOrderInput | SortOrder
    propertyTypes?: SortOrderInput | SortOrder
    financingType?: SortOrderInput | SortOrder
    tier?: SortOrder
    preferredDealSize?: SortOrderInput | SortOrder
    preferredCondition?: SortOrderInput | SortOrder
    source?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    buyerQualityScore?: SortOrder
    lastActiveAt?: SortOrderInput | SortOrder
    activityCount?: SortOrder
    meaningfulActivityCount?: SortOrder
    lastMeaningfulActivityAt?: SortOrderInput | SortOrder
    isActive?: SortOrder
    qualityReasons?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    activities?: BuyerActivityOrderByRelationAggregateInput
  }

  export type BuyerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BuyerWhereInput | BuyerWhereInput[]
    OR?: BuyerWhereInput[]
    NOT?: BuyerWhereInput | BuyerWhereInput[]
    name?: StringFilter<"Buyer"> | string
    phone?: StringNullableFilter<"Buyer"> | string | null
    email?: StringNullableFilter<"Buyer"> | string | null
    preferredLocations?: JsonNullableFilter<"Buyer">
    priceRangeMin?: IntNullableFilter<"Buyer"> | number | null
    priceRangeMax?: IntNullableFilter<"Buyer"> | number | null
    propertyTypes?: JsonNullableFilter<"Buyer">
    financingType?: StringNullableFilter<"Buyer"> | string | null
    tier?: EnumBuyerTierFilter<"Buyer"> | $Enums.BuyerTier
    preferredDealSize?: IntNullableFilter<"Buyer"> | number | null
    preferredCondition?: StringNullableFilter<"Buyer"> | string | null
    source?: StringNullableFilter<"Buyer"> | string | null
    tags?: JsonNullableFilter<"Buyer">
    buyerQualityScore?: IntFilter<"Buyer"> | number
    lastActiveAt?: DateTimeNullableFilter<"Buyer"> | Date | string | null
    activityCount?: IntFilter<"Buyer"> | number
    meaningfulActivityCount?: IntFilter<"Buyer"> | number
    lastMeaningfulActivityAt?: DateTimeNullableFilter<"Buyer"> | Date | string | null
    isActive?: BoolFilter<"Buyer"> | boolean
    qualityReasons?: JsonNullableFilter<"Buyer">
    createdAt?: DateTimeFilter<"Buyer"> | Date | string
    updatedAt?: DateTimeFilter<"Buyer"> | Date | string
    activities?: BuyerActivityListRelationFilter
  }, "id">

  export type BuyerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    preferredLocations?: SortOrderInput | SortOrder
    priceRangeMin?: SortOrderInput | SortOrder
    priceRangeMax?: SortOrderInput | SortOrder
    propertyTypes?: SortOrderInput | SortOrder
    financingType?: SortOrderInput | SortOrder
    tier?: SortOrder
    preferredDealSize?: SortOrderInput | SortOrder
    preferredCondition?: SortOrderInput | SortOrder
    source?: SortOrderInput | SortOrder
    tags?: SortOrderInput | SortOrder
    buyerQualityScore?: SortOrder
    lastActiveAt?: SortOrderInput | SortOrder
    activityCount?: SortOrder
    meaningfulActivityCount?: SortOrder
    lastMeaningfulActivityAt?: SortOrderInput | SortOrder
    isActive?: SortOrder
    qualityReasons?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: BuyerCountOrderByAggregateInput
    _avg?: BuyerAvgOrderByAggregateInput
    _max?: BuyerMaxOrderByAggregateInput
    _min?: BuyerMinOrderByAggregateInput
    _sum?: BuyerSumOrderByAggregateInput
  }

  export type BuyerScalarWhereWithAggregatesInput = {
    AND?: BuyerScalarWhereWithAggregatesInput | BuyerScalarWhereWithAggregatesInput[]
    OR?: BuyerScalarWhereWithAggregatesInput[]
    NOT?: BuyerScalarWhereWithAggregatesInput | BuyerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Buyer"> | string
    name?: StringWithAggregatesFilter<"Buyer"> | string
    phone?: StringNullableWithAggregatesFilter<"Buyer"> | string | null
    email?: StringNullableWithAggregatesFilter<"Buyer"> | string | null
    preferredLocations?: JsonNullableWithAggregatesFilter<"Buyer">
    priceRangeMin?: IntNullableWithAggregatesFilter<"Buyer"> | number | null
    priceRangeMax?: IntNullableWithAggregatesFilter<"Buyer"> | number | null
    propertyTypes?: JsonNullableWithAggregatesFilter<"Buyer">
    financingType?: StringNullableWithAggregatesFilter<"Buyer"> | string | null
    tier?: EnumBuyerTierWithAggregatesFilter<"Buyer"> | $Enums.BuyerTier
    preferredDealSize?: IntNullableWithAggregatesFilter<"Buyer"> | number | null
    preferredCondition?: StringNullableWithAggregatesFilter<"Buyer"> | string | null
    source?: StringNullableWithAggregatesFilter<"Buyer"> | string | null
    tags?: JsonNullableWithAggregatesFilter<"Buyer">
    buyerQualityScore?: IntWithAggregatesFilter<"Buyer"> | number
    lastActiveAt?: DateTimeNullableWithAggregatesFilter<"Buyer"> | Date | string | null
    activityCount?: IntWithAggregatesFilter<"Buyer"> | number
    meaningfulActivityCount?: IntWithAggregatesFilter<"Buyer"> | number
    lastMeaningfulActivityAt?: DateTimeNullableWithAggregatesFilter<"Buyer"> | Date | string | null
    isActive?: BoolWithAggregatesFilter<"Buyer"> | boolean
    qualityReasons?: JsonNullableWithAggregatesFilter<"Buyer">
    createdAt?: DateTimeWithAggregatesFilter<"Buyer"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Buyer"> | Date | string
  }

  export type BuyerActivityWhereInput = {
    AND?: BuyerActivityWhereInput | BuyerActivityWhereInput[]
    OR?: BuyerActivityWhereInput[]
    NOT?: BuyerActivityWhereInput | BuyerActivityWhereInput[]
    id?: StringFilter<"BuyerActivity"> | string
    buyerId?: StringFilter<"BuyerActivity"> | string
    dealId?: StringNullableFilter<"BuyerActivity"> | string | null
    eventType?: EnumBuyerActivityEventTypeFilter<"BuyerActivity"> | $Enums.BuyerActivityEventType
    metadata?: JsonNullableFilter<"BuyerActivity">
    createdAt?: DateTimeFilter<"BuyerActivity"> | Date | string
    buyer?: XOR<BuyerScalarRelationFilter, BuyerWhereInput>
  }

  export type BuyerActivityOrderByWithRelationInput = {
    id?: SortOrder
    buyerId?: SortOrder
    dealId?: SortOrderInput | SortOrder
    eventType?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    buyer?: BuyerOrderByWithRelationInput
  }

  export type BuyerActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BuyerActivityWhereInput | BuyerActivityWhereInput[]
    OR?: BuyerActivityWhereInput[]
    NOT?: BuyerActivityWhereInput | BuyerActivityWhereInput[]
    buyerId?: StringFilter<"BuyerActivity"> | string
    dealId?: StringNullableFilter<"BuyerActivity"> | string | null
    eventType?: EnumBuyerActivityEventTypeFilter<"BuyerActivity"> | $Enums.BuyerActivityEventType
    metadata?: JsonNullableFilter<"BuyerActivity">
    createdAt?: DateTimeFilter<"BuyerActivity"> | Date | string
    buyer?: XOR<BuyerScalarRelationFilter, BuyerWhereInput>
  }, "id">

  export type BuyerActivityOrderByWithAggregationInput = {
    id?: SortOrder
    buyerId?: SortOrder
    dealId?: SortOrderInput | SortOrder
    eventType?: SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: BuyerActivityCountOrderByAggregateInput
    _max?: BuyerActivityMaxOrderByAggregateInput
    _min?: BuyerActivityMinOrderByAggregateInput
  }

  export type BuyerActivityScalarWhereWithAggregatesInput = {
    AND?: BuyerActivityScalarWhereWithAggregatesInput | BuyerActivityScalarWhereWithAggregatesInput[]
    OR?: BuyerActivityScalarWhereWithAggregatesInput[]
    NOT?: BuyerActivityScalarWhereWithAggregatesInput | BuyerActivityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BuyerActivity"> | string
    buyerId?: StringWithAggregatesFilter<"BuyerActivity"> | string
    dealId?: StringNullableWithAggregatesFilter<"BuyerActivity"> | string | null
    eventType?: EnumBuyerActivityEventTypeWithAggregatesFilter<"BuyerActivity"> | $Enums.BuyerActivityEventType
    metadata?: JsonNullableWithAggregatesFilter<"BuyerActivity">
    createdAt?: DateTimeWithAggregatesFilter<"BuyerActivity"> | Date | string
  }

  export type LeadCreateInput = {
    id?: string
    name: string
    phone: string
    propertyAddress: string
    source: string
    status?: $Enums.LeadStatus
    score?: number
    priority?: string
    notes?: string | null
    payload?: string | null
    lastContactedAt?: Date | string | null
    nextFollowUpAt?: Date | string | null
    followUpCount?: number
    lastFollowUpMessage?: string | null
    automationStatus?: string
    isHot?: boolean
    lastSellerReply?: string | null
    lastSellerReplyAt?: Date | string | null
    lastSellerReplyIntent?: string | null
    lastSellerReplyConfidence?: number | null
    suggestedReply?: string | null
    requiresHumanApproval?: boolean
    doNotContact?: boolean
    optOutReason?: string | null
    optOutAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeadUncheckedCreateInput = {
    id?: string
    name: string
    phone: string
    propertyAddress: string
    source: string
    status?: $Enums.LeadStatus
    score?: number
    priority?: string
    notes?: string | null
    payload?: string | null
    lastContactedAt?: Date | string | null
    nextFollowUpAt?: Date | string | null
    followUpCount?: number
    lastFollowUpMessage?: string | null
    automationStatus?: string
    isHot?: boolean
    lastSellerReply?: string | null
    lastSellerReplyAt?: Date | string | null
    lastSellerReplyIntent?: string | null
    lastSellerReplyConfidence?: number | null
    suggestedReply?: string | null
    requiresHumanApproval?: boolean
    doNotContact?: boolean
    optOutReason?: string | null
    optOutAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeadUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    propertyAddress?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: IntFieldUpdateOperationsInput | number
    priority?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpCount?: IntFieldUpdateOperationsInput | number
    lastFollowUpMessage?: NullableStringFieldUpdateOperationsInput | string | null
    automationStatus?: StringFieldUpdateOperationsInput | string
    isHot?: BoolFieldUpdateOperationsInput | boolean
    lastSellerReply?: NullableStringFieldUpdateOperationsInput | string | null
    lastSellerReplyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSellerReplyIntent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSellerReplyConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    suggestedReply?: NullableStringFieldUpdateOperationsInput | string | null
    requiresHumanApproval?: BoolFieldUpdateOperationsInput | boolean
    doNotContact?: BoolFieldUpdateOperationsInput | boolean
    optOutReason?: NullableStringFieldUpdateOperationsInput | string | null
    optOutAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    propertyAddress?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: IntFieldUpdateOperationsInput | number
    priority?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpCount?: IntFieldUpdateOperationsInput | number
    lastFollowUpMessage?: NullableStringFieldUpdateOperationsInput | string | null
    automationStatus?: StringFieldUpdateOperationsInput | string
    isHot?: BoolFieldUpdateOperationsInput | boolean
    lastSellerReply?: NullableStringFieldUpdateOperationsInput | string | null
    lastSellerReplyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSellerReplyIntent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSellerReplyConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    suggestedReply?: NullableStringFieldUpdateOperationsInput | string | null
    requiresHumanApproval?: BoolFieldUpdateOperationsInput | boolean
    doNotContact?: BoolFieldUpdateOperationsInput | boolean
    optOutReason?: NullableStringFieldUpdateOperationsInput | string | null
    optOutAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadCreateManyInput = {
    id?: string
    name: string
    phone: string
    propertyAddress: string
    source: string
    status?: $Enums.LeadStatus
    score?: number
    priority?: string
    notes?: string | null
    payload?: string | null
    lastContactedAt?: Date | string | null
    nextFollowUpAt?: Date | string | null
    followUpCount?: number
    lastFollowUpMessage?: string | null
    automationStatus?: string
    isHot?: boolean
    lastSellerReply?: string | null
    lastSellerReplyAt?: Date | string | null
    lastSellerReplyIntent?: string | null
    lastSellerReplyConfidence?: number | null
    suggestedReply?: string | null
    requiresHumanApproval?: boolean
    doNotContact?: boolean
    optOutReason?: string | null
    optOutAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeadUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    propertyAddress?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: IntFieldUpdateOperationsInput | number
    priority?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpCount?: IntFieldUpdateOperationsInput | number
    lastFollowUpMessage?: NullableStringFieldUpdateOperationsInput | string | null
    automationStatus?: StringFieldUpdateOperationsInput | string
    isHot?: BoolFieldUpdateOperationsInput | boolean
    lastSellerReply?: NullableStringFieldUpdateOperationsInput | string | null
    lastSellerReplyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSellerReplyIntent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSellerReplyConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    suggestedReply?: NullableStringFieldUpdateOperationsInput | string | null
    requiresHumanApproval?: BoolFieldUpdateOperationsInput | boolean
    doNotContact?: BoolFieldUpdateOperationsInput | boolean
    optOutReason?: NullableStringFieldUpdateOperationsInput | string | null
    optOutAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeadUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    propertyAddress?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    status?: EnumLeadStatusFieldUpdateOperationsInput | $Enums.LeadStatus
    score?: IntFieldUpdateOperationsInput | number
    priority?: StringFieldUpdateOperationsInput | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    payload?: NullableStringFieldUpdateOperationsInput | string | null
    lastContactedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    nextFollowUpAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    followUpCount?: IntFieldUpdateOperationsInput | number
    lastFollowUpMessage?: NullableStringFieldUpdateOperationsInput | string | null
    automationStatus?: StringFieldUpdateOperationsInput | string
    isHot?: BoolFieldUpdateOperationsInput | boolean
    lastSellerReply?: NullableStringFieldUpdateOperationsInput | string | null
    lastSellerReplyAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastSellerReplyIntent?: NullableStringFieldUpdateOperationsInput | string | null
    lastSellerReplyConfidence?: NullableFloatFieldUpdateOperationsInput | number | null
    suggestedReply?: NullableStringFieldUpdateOperationsInput | string | null
    requiresHumanApproval?: BoolFieldUpdateOperationsInput | boolean
    doNotContact?: BoolFieldUpdateOperationsInput | boolean
    optOutReason?: NullableStringFieldUpdateOperationsInput | string | null
    optOutAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPerformanceMetricCreateInput = {
    id?: string
    date: Date | string
    totalLeads?: number
    newLeads?: number
    contactedLeads?: number
    negotiatingLeads?: number
    underContractLeads?: number
    closedLeads?: number
    sellerReplies?: number
    aiClassifications?: number
    avgConfidence?: number
    humanApprovalsNeeded?: number
    suggestedReplies?: number
    dncCount?: number
    hotLeads?: number
    automationScheduled?: number
    automationIdle?: number
    staleNewLeads?: number
    overdueFollowUps?: number
    systemWarnings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiPerformanceMetricUncheckedCreateInput = {
    id?: string
    date: Date | string
    totalLeads?: number
    newLeads?: number
    contactedLeads?: number
    negotiatingLeads?: number
    underContractLeads?: number
    closedLeads?: number
    sellerReplies?: number
    aiClassifications?: number
    avgConfidence?: number
    humanApprovalsNeeded?: number
    suggestedReplies?: number
    dncCount?: number
    hotLeads?: number
    automationScheduled?: number
    automationIdle?: number
    staleNewLeads?: number
    overdueFollowUps?: number
    systemWarnings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiPerformanceMetricUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalLeads?: IntFieldUpdateOperationsInput | number
    newLeads?: IntFieldUpdateOperationsInput | number
    contactedLeads?: IntFieldUpdateOperationsInput | number
    negotiatingLeads?: IntFieldUpdateOperationsInput | number
    underContractLeads?: IntFieldUpdateOperationsInput | number
    closedLeads?: IntFieldUpdateOperationsInput | number
    sellerReplies?: IntFieldUpdateOperationsInput | number
    aiClassifications?: IntFieldUpdateOperationsInput | number
    avgConfidence?: FloatFieldUpdateOperationsInput | number
    humanApprovalsNeeded?: IntFieldUpdateOperationsInput | number
    suggestedReplies?: IntFieldUpdateOperationsInput | number
    dncCount?: IntFieldUpdateOperationsInput | number
    hotLeads?: IntFieldUpdateOperationsInput | number
    automationScheduled?: IntFieldUpdateOperationsInput | number
    automationIdle?: IntFieldUpdateOperationsInput | number
    staleNewLeads?: IntFieldUpdateOperationsInput | number
    overdueFollowUps?: IntFieldUpdateOperationsInput | number
    systemWarnings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPerformanceMetricUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalLeads?: IntFieldUpdateOperationsInput | number
    newLeads?: IntFieldUpdateOperationsInput | number
    contactedLeads?: IntFieldUpdateOperationsInput | number
    negotiatingLeads?: IntFieldUpdateOperationsInput | number
    underContractLeads?: IntFieldUpdateOperationsInput | number
    closedLeads?: IntFieldUpdateOperationsInput | number
    sellerReplies?: IntFieldUpdateOperationsInput | number
    aiClassifications?: IntFieldUpdateOperationsInput | number
    avgConfidence?: FloatFieldUpdateOperationsInput | number
    humanApprovalsNeeded?: IntFieldUpdateOperationsInput | number
    suggestedReplies?: IntFieldUpdateOperationsInput | number
    dncCount?: IntFieldUpdateOperationsInput | number
    hotLeads?: IntFieldUpdateOperationsInput | number
    automationScheduled?: IntFieldUpdateOperationsInput | number
    automationIdle?: IntFieldUpdateOperationsInput | number
    staleNewLeads?: IntFieldUpdateOperationsInput | number
    overdueFollowUps?: IntFieldUpdateOperationsInput | number
    systemWarnings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPerformanceMetricCreateManyInput = {
    id?: string
    date: Date | string
    totalLeads?: number
    newLeads?: number
    contactedLeads?: number
    negotiatingLeads?: number
    underContractLeads?: number
    closedLeads?: number
    sellerReplies?: number
    aiClassifications?: number
    avgConfidence?: number
    humanApprovalsNeeded?: number
    suggestedReplies?: number
    dncCount?: number
    hotLeads?: number
    automationScheduled?: number
    automationIdle?: number
    staleNewLeads?: number
    overdueFollowUps?: number
    systemWarnings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiPerformanceMetricUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalLeads?: IntFieldUpdateOperationsInput | number
    newLeads?: IntFieldUpdateOperationsInput | number
    contactedLeads?: IntFieldUpdateOperationsInput | number
    negotiatingLeads?: IntFieldUpdateOperationsInput | number
    underContractLeads?: IntFieldUpdateOperationsInput | number
    closedLeads?: IntFieldUpdateOperationsInput | number
    sellerReplies?: IntFieldUpdateOperationsInput | number
    aiClassifications?: IntFieldUpdateOperationsInput | number
    avgConfidence?: FloatFieldUpdateOperationsInput | number
    humanApprovalsNeeded?: IntFieldUpdateOperationsInput | number
    suggestedReplies?: IntFieldUpdateOperationsInput | number
    dncCount?: IntFieldUpdateOperationsInput | number
    hotLeads?: IntFieldUpdateOperationsInput | number
    automationScheduled?: IntFieldUpdateOperationsInput | number
    automationIdle?: IntFieldUpdateOperationsInput | number
    staleNewLeads?: IntFieldUpdateOperationsInput | number
    overdueFollowUps?: IntFieldUpdateOperationsInput | number
    systemWarnings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiPerformanceMetricUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalLeads?: IntFieldUpdateOperationsInput | number
    newLeads?: IntFieldUpdateOperationsInput | number
    contactedLeads?: IntFieldUpdateOperationsInput | number
    negotiatingLeads?: IntFieldUpdateOperationsInput | number
    underContractLeads?: IntFieldUpdateOperationsInput | number
    closedLeads?: IntFieldUpdateOperationsInput | number
    sellerReplies?: IntFieldUpdateOperationsInput | number
    aiClassifications?: IntFieldUpdateOperationsInput | number
    avgConfidence?: FloatFieldUpdateOperationsInput | number
    humanApprovalsNeeded?: IntFieldUpdateOperationsInput | number
    suggestedReplies?: IntFieldUpdateOperationsInput | number
    dncCount?: IntFieldUpdateOperationsInput | number
    hotLeads?: IntFieldUpdateOperationsInput | number
    automationScheduled?: IntFieldUpdateOperationsInput | number
    automationIdle?: IntFieldUpdateOperationsInput | number
    staleNewLeads?: IntFieldUpdateOperationsInput | number
    overdueFollowUps?: IntFieldUpdateOperationsInput | number
    systemWarnings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobCreateInput = {
    id?: string
    status?: string
    startedAt?: Date | string
    completedAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    actions?: AiJobActionCreateNestedManyWithoutJobInput
    logs?: AiJobLogCreateNestedManyWithoutJobInput
  }

  export type AiJobUncheckedCreateInput = {
    id?: string
    status?: string
    startedAt?: Date | string
    completedAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    actions?: AiJobActionUncheckedCreateNestedManyWithoutJobInput
    logs?: AiJobLogUncheckedCreateNestedManyWithoutJobInput
  }

  export type AiJobUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actions?: AiJobActionUpdateManyWithoutJobNestedInput
    logs?: AiJobLogUpdateManyWithoutJobNestedInput
  }

  export type AiJobUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actions?: AiJobActionUncheckedUpdateManyWithoutJobNestedInput
    logs?: AiJobLogUncheckedUpdateManyWithoutJobNestedInput
  }

  export type AiJobCreateManyInput = {
    id?: string
    status?: string
    startedAt?: Date | string
    completedAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AiJobUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobActionCreateInput = {
    id?: string
    action: string
    count?: number
    createdAt?: Date | string
    job: AiJobCreateNestedOneWithoutActionsInput
  }

  export type AiJobActionUncheckedCreateInput = {
    id?: string
    jobId: string
    action: string
    count?: number
    createdAt?: Date | string
  }

  export type AiJobActionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: AiJobUpdateOneRequiredWithoutActionsNestedInput
  }

  export type AiJobActionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobActionCreateManyInput = {
    id?: string
    jobId: string
    action: string
    count?: number
    createdAt?: Date | string
  }

  export type AiJobActionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobActionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobLogCreateInput = {
    id?: string
    level?: string
    message: string
    createdAt?: Date | string
    job: AiJobCreateNestedOneWithoutLogsInput
  }

  export type AiJobLogUncheckedCreateInput = {
    id?: string
    jobId: string
    level?: string
    message: string
    createdAt?: Date | string
  }

  export type AiJobLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    job?: AiJobUpdateOneRequiredWithoutLogsNestedInput
  }

  export type AiJobLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobLogCreateManyInput = {
    id?: string
    jobId: string
    level?: string
    message: string
    createdAt?: Date | string
  }

  export type AiJobLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    jobId?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMemoryEventCreateInput = {
    id?: string
    leadId?: string | null
    jobId?: string | null
    actionId?: string | null
    eventType: string
    source: string
    sellerReply?: string | null
    aiSuggestedReply?: string | null
    humanFinalReply?: string | null
    approvalDecision?: string | null
    messageChannel?: string | null
    messageStatus?: string | null
    sellerIntent?: string | null
    sellerSentiment?: string | null
    confidence?: number | null
    outcome?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AiMemoryEventUncheckedCreateInput = {
    id?: string
    leadId?: string | null
    jobId?: string | null
    actionId?: string | null
    eventType: string
    source: string
    sellerReply?: string | null
    aiSuggestedReply?: string | null
    humanFinalReply?: string | null
    approvalDecision?: string | null
    messageChannel?: string | null
    messageStatus?: string | null
    sellerIntent?: string | null
    sellerSentiment?: string | null
    confidence?: number | null
    outcome?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AiMemoryEventUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    actionId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    sellerReply?: NullableStringFieldUpdateOperationsInput | string | null
    aiSuggestedReply?: NullableStringFieldUpdateOperationsInput | string | null
    humanFinalReply?: NullableStringFieldUpdateOperationsInput | string | null
    approvalDecision?: NullableStringFieldUpdateOperationsInput | string | null
    messageChannel?: NullableStringFieldUpdateOperationsInput | string | null
    messageStatus?: NullableStringFieldUpdateOperationsInput | string | null
    sellerIntent?: NullableStringFieldUpdateOperationsInput | string | null
    sellerSentiment?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMemoryEventUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    actionId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    sellerReply?: NullableStringFieldUpdateOperationsInput | string | null
    aiSuggestedReply?: NullableStringFieldUpdateOperationsInput | string | null
    humanFinalReply?: NullableStringFieldUpdateOperationsInput | string | null
    approvalDecision?: NullableStringFieldUpdateOperationsInput | string | null
    messageChannel?: NullableStringFieldUpdateOperationsInput | string | null
    messageStatus?: NullableStringFieldUpdateOperationsInput | string | null
    sellerIntent?: NullableStringFieldUpdateOperationsInput | string | null
    sellerSentiment?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMemoryEventCreateManyInput = {
    id?: string
    leadId?: string | null
    jobId?: string | null
    actionId?: string | null
    eventType: string
    source: string
    sellerReply?: string | null
    aiSuggestedReply?: string | null
    humanFinalReply?: string | null
    approvalDecision?: string | null
    messageChannel?: string | null
    messageStatus?: string | null
    sellerIntent?: string | null
    sellerSentiment?: string | null
    confidence?: number | null
    outcome?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AiMemoryEventUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    actionId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    sellerReply?: NullableStringFieldUpdateOperationsInput | string | null
    aiSuggestedReply?: NullableStringFieldUpdateOperationsInput | string | null
    humanFinalReply?: NullableStringFieldUpdateOperationsInput | string | null
    approvalDecision?: NullableStringFieldUpdateOperationsInput | string | null
    messageChannel?: NullableStringFieldUpdateOperationsInput | string | null
    messageStatus?: NullableStringFieldUpdateOperationsInput | string | null
    sellerIntent?: NullableStringFieldUpdateOperationsInput | string | null
    sellerSentiment?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiMemoryEventUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    leadId?: NullableStringFieldUpdateOperationsInput | string | null
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    actionId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    sellerReply?: NullableStringFieldUpdateOperationsInput | string | null
    aiSuggestedReply?: NullableStringFieldUpdateOperationsInput | string | null
    humanFinalReply?: NullableStringFieldUpdateOperationsInput | string | null
    approvalDecision?: NullableStringFieldUpdateOperationsInput | string | null
    messageChannel?: NullableStringFieldUpdateOperationsInput | string | null
    messageStatus?: NullableStringFieldUpdateOperationsInput | string | null
    sellerIntent?: NullableStringFieldUpdateOperationsInput | string | null
    sellerSentiment?: NullableStringFieldUpdateOperationsInput | string | null
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    outcome?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiLearningRecommendationCreateInput = {
    id?: string
    type: string
    title: string
    description: string
    recommendationData?: NullableJsonNullValueInput | InputJsonValue
    applicationPlan?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number
    status?: string
    createdAt?: Date | string
    reviewedAt?: Date | string | null
    appliedAt?: Date | string | null
    autoPromotable?: boolean
    promotedAt?: Date | string | null
  }

  export type AiLearningRecommendationUncheckedCreateInput = {
    id?: string
    type: string
    title: string
    description: string
    recommendationData?: NullableJsonNullValueInput | InputJsonValue
    applicationPlan?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number
    status?: string
    createdAt?: Date | string
    reviewedAt?: Date | string | null
    appliedAt?: Date | string | null
    autoPromotable?: boolean
    promotedAt?: Date | string | null
  }

  export type AiLearningRecommendationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    recommendationData?: NullableJsonNullValueInput | InputJsonValue
    applicationPlan?: NullableJsonNullValueInput | InputJsonValue
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoPromotable?: BoolFieldUpdateOperationsInput | boolean
    promotedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AiLearningRecommendationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    recommendationData?: NullableJsonNullValueInput | InputJsonValue
    applicationPlan?: NullableJsonNullValueInput | InputJsonValue
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoPromotable?: BoolFieldUpdateOperationsInput | boolean
    promotedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AiLearningRecommendationCreateManyInput = {
    id?: string
    type: string
    title: string
    description: string
    recommendationData?: NullableJsonNullValueInput | InputJsonValue
    applicationPlan?: NullableJsonNullValueInput | InputJsonValue
    confidence?: number
    status?: string
    createdAt?: Date | string
    reviewedAt?: Date | string | null
    appliedAt?: Date | string | null
    autoPromotable?: boolean
    promotedAt?: Date | string | null
  }

  export type AiLearningRecommendationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    recommendationData?: NullableJsonNullValueInput | InputJsonValue
    applicationPlan?: NullableJsonNullValueInput | InputJsonValue
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoPromotable?: BoolFieldUpdateOperationsInput | boolean
    promotedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AiLearningRecommendationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    recommendationData?: NullableJsonNullValueInput | InputJsonValue
    applicationPlan?: NullableJsonNullValueInput | InputJsonValue
    confidence?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    appliedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoPromotable?: BoolFieldUpdateOperationsInput | boolean
    promotedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BuyerCreateInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    preferredLocations?: NullableJsonNullValueInput | InputJsonValue
    priceRangeMin?: number | null
    priceRangeMax?: number | null
    propertyTypes?: NullableJsonNullValueInput | InputJsonValue
    financingType?: string | null
    tier?: $Enums.BuyerTier
    preferredDealSize?: number | null
    preferredCondition?: string | null
    source?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    buyerQualityScore?: number
    lastActiveAt?: Date | string | null
    activityCount?: number
    meaningfulActivityCount?: number
    lastMeaningfulActivityAt?: Date | string | null
    isActive?: boolean
    qualityReasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: BuyerActivityCreateNestedManyWithoutBuyerInput
  }

  export type BuyerUncheckedCreateInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    preferredLocations?: NullableJsonNullValueInput | InputJsonValue
    priceRangeMin?: number | null
    priceRangeMax?: number | null
    propertyTypes?: NullableJsonNullValueInput | InputJsonValue
    financingType?: string | null
    tier?: $Enums.BuyerTier
    preferredDealSize?: number | null
    preferredCondition?: string | null
    source?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    buyerQualityScore?: number
    lastActiveAt?: Date | string | null
    activityCount?: number
    meaningfulActivityCount?: number
    lastMeaningfulActivityAt?: Date | string | null
    isActive?: boolean
    qualityReasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activities?: BuyerActivityUncheckedCreateNestedManyWithoutBuyerInput
  }

  export type BuyerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLocations?: NullableJsonNullValueInput | InputJsonValue
    priceRangeMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceRangeMax?: NullableIntFieldUpdateOperationsInput | number | null
    propertyTypes?: NullableJsonNullValueInput | InputJsonValue
    financingType?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: EnumBuyerTierFieldUpdateOperationsInput | $Enums.BuyerTier
    preferredDealSize?: NullableIntFieldUpdateOperationsInput | number | null
    preferredCondition?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    buyerQualityScore?: IntFieldUpdateOperationsInput | number
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activityCount?: IntFieldUpdateOperationsInput | number
    meaningfulActivityCount?: IntFieldUpdateOperationsInput | number
    lastMeaningfulActivityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    qualityReasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: BuyerActivityUpdateManyWithoutBuyerNestedInput
  }

  export type BuyerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLocations?: NullableJsonNullValueInput | InputJsonValue
    priceRangeMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceRangeMax?: NullableIntFieldUpdateOperationsInput | number | null
    propertyTypes?: NullableJsonNullValueInput | InputJsonValue
    financingType?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: EnumBuyerTierFieldUpdateOperationsInput | $Enums.BuyerTier
    preferredDealSize?: NullableIntFieldUpdateOperationsInput | number | null
    preferredCondition?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    buyerQualityScore?: IntFieldUpdateOperationsInput | number
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activityCount?: IntFieldUpdateOperationsInput | number
    meaningfulActivityCount?: IntFieldUpdateOperationsInput | number
    lastMeaningfulActivityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    qualityReasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activities?: BuyerActivityUncheckedUpdateManyWithoutBuyerNestedInput
  }

  export type BuyerCreateManyInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    preferredLocations?: NullableJsonNullValueInput | InputJsonValue
    priceRangeMin?: number | null
    priceRangeMax?: number | null
    propertyTypes?: NullableJsonNullValueInput | InputJsonValue
    financingType?: string | null
    tier?: $Enums.BuyerTier
    preferredDealSize?: number | null
    preferredCondition?: string | null
    source?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    buyerQualityScore?: number
    lastActiveAt?: Date | string | null
    activityCount?: number
    meaningfulActivityCount?: number
    lastMeaningfulActivityAt?: Date | string | null
    isActive?: boolean
    qualityReasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BuyerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLocations?: NullableJsonNullValueInput | InputJsonValue
    priceRangeMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceRangeMax?: NullableIntFieldUpdateOperationsInput | number | null
    propertyTypes?: NullableJsonNullValueInput | InputJsonValue
    financingType?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: EnumBuyerTierFieldUpdateOperationsInput | $Enums.BuyerTier
    preferredDealSize?: NullableIntFieldUpdateOperationsInput | number | null
    preferredCondition?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    buyerQualityScore?: IntFieldUpdateOperationsInput | number
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activityCount?: IntFieldUpdateOperationsInput | number
    meaningfulActivityCount?: IntFieldUpdateOperationsInput | number
    lastMeaningfulActivityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    qualityReasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLocations?: NullableJsonNullValueInput | InputJsonValue
    priceRangeMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceRangeMax?: NullableIntFieldUpdateOperationsInput | number | null
    propertyTypes?: NullableJsonNullValueInput | InputJsonValue
    financingType?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: EnumBuyerTierFieldUpdateOperationsInput | $Enums.BuyerTier
    preferredDealSize?: NullableIntFieldUpdateOperationsInput | number | null
    preferredCondition?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    buyerQualityScore?: IntFieldUpdateOperationsInput | number
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activityCount?: IntFieldUpdateOperationsInput | number
    meaningfulActivityCount?: IntFieldUpdateOperationsInput | number
    lastMeaningfulActivityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    qualityReasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerActivityCreateInput = {
    id?: string
    dealId?: string | null
    eventType: $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    buyer: BuyerCreateNestedOneWithoutActivitiesInput
  }

  export type BuyerActivityUncheckedCreateInput = {
    id?: string
    buyerId: string
    dealId?: string | null
    eventType: $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type BuyerActivityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dealId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumBuyerActivityEventTypeFieldUpdateOperationsInput | $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    buyer?: BuyerUpdateOneRequiredWithoutActivitiesNestedInput
  }

  export type BuyerActivityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerId?: StringFieldUpdateOperationsInput | string
    dealId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumBuyerActivityEventTypeFieldUpdateOperationsInput | $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerActivityCreateManyInput = {
    id?: string
    buyerId: string
    dealId?: string | null
    eventType: $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type BuyerActivityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dealId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumBuyerActivityEventTypeFieldUpdateOperationsInput | $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerActivityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerId?: StringFieldUpdateOperationsInput | string
    dealId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumBuyerActivityEventTypeFieldUpdateOperationsInput | $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumLeadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadStatus | EnumLeadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadStatusFilter<$PrismaModel> | $Enums.LeadStatus
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LeadPropertyAddressPhoneCompoundUniqueInput = {
    propertyAddress: string
    phone: string
  }

  export type LeadCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    propertyAddress?: SortOrder
    source?: SortOrder
    status?: SortOrder
    score?: SortOrder
    priority?: SortOrder
    notes?: SortOrder
    payload?: SortOrder
    lastContactedAt?: SortOrder
    nextFollowUpAt?: SortOrder
    followUpCount?: SortOrder
    lastFollowUpMessage?: SortOrder
    automationStatus?: SortOrder
    isHot?: SortOrder
    lastSellerReply?: SortOrder
    lastSellerReplyAt?: SortOrder
    lastSellerReplyIntent?: SortOrder
    lastSellerReplyConfidence?: SortOrder
    suggestedReply?: SortOrder
    requiresHumanApproval?: SortOrder
    doNotContact?: SortOrder
    optOutReason?: SortOrder
    optOutAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadAvgOrderByAggregateInput = {
    score?: SortOrder
    followUpCount?: SortOrder
    lastSellerReplyConfidence?: SortOrder
  }

  export type LeadMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    propertyAddress?: SortOrder
    source?: SortOrder
    status?: SortOrder
    score?: SortOrder
    priority?: SortOrder
    notes?: SortOrder
    payload?: SortOrder
    lastContactedAt?: SortOrder
    nextFollowUpAt?: SortOrder
    followUpCount?: SortOrder
    lastFollowUpMessage?: SortOrder
    automationStatus?: SortOrder
    isHot?: SortOrder
    lastSellerReply?: SortOrder
    lastSellerReplyAt?: SortOrder
    lastSellerReplyIntent?: SortOrder
    lastSellerReplyConfidence?: SortOrder
    suggestedReply?: SortOrder
    requiresHumanApproval?: SortOrder
    doNotContact?: SortOrder
    optOutReason?: SortOrder
    optOutAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    propertyAddress?: SortOrder
    source?: SortOrder
    status?: SortOrder
    score?: SortOrder
    priority?: SortOrder
    notes?: SortOrder
    payload?: SortOrder
    lastContactedAt?: SortOrder
    nextFollowUpAt?: SortOrder
    followUpCount?: SortOrder
    lastFollowUpMessage?: SortOrder
    automationStatus?: SortOrder
    isHot?: SortOrder
    lastSellerReply?: SortOrder
    lastSellerReplyAt?: SortOrder
    lastSellerReplyIntent?: SortOrder
    lastSellerReplyConfidence?: SortOrder
    suggestedReply?: SortOrder
    requiresHumanApproval?: SortOrder
    doNotContact?: SortOrder
    optOutReason?: SortOrder
    optOutAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeadSumOrderByAggregateInput = {
    score?: SortOrder
    followUpCount?: SortOrder
    lastSellerReplyConfidence?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumLeadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadStatus | EnumLeadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadStatusWithAggregatesFilter<$PrismaModel> | $Enums.LeadStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLeadStatusFilter<$PrismaModel>
    _max?: NestedEnumLeadStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AiPerformanceMetricCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    totalLeads?: SortOrder
    newLeads?: SortOrder
    contactedLeads?: SortOrder
    negotiatingLeads?: SortOrder
    underContractLeads?: SortOrder
    closedLeads?: SortOrder
    sellerReplies?: SortOrder
    aiClassifications?: SortOrder
    avgConfidence?: SortOrder
    humanApprovalsNeeded?: SortOrder
    suggestedReplies?: SortOrder
    dncCount?: SortOrder
    hotLeads?: SortOrder
    automationScheduled?: SortOrder
    automationIdle?: SortOrder
    staleNewLeads?: SortOrder
    overdueFollowUps?: SortOrder
    systemWarnings?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiPerformanceMetricAvgOrderByAggregateInput = {
    totalLeads?: SortOrder
    newLeads?: SortOrder
    contactedLeads?: SortOrder
    negotiatingLeads?: SortOrder
    underContractLeads?: SortOrder
    closedLeads?: SortOrder
    sellerReplies?: SortOrder
    aiClassifications?: SortOrder
    avgConfidence?: SortOrder
    humanApprovalsNeeded?: SortOrder
    suggestedReplies?: SortOrder
    dncCount?: SortOrder
    hotLeads?: SortOrder
    automationScheduled?: SortOrder
    automationIdle?: SortOrder
    staleNewLeads?: SortOrder
    overdueFollowUps?: SortOrder
  }

  export type AiPerformanceMetricMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    totalLeads?: SortOrder
    newLeads?: SortOrder
    contactedLeads?: SortOrder
    negotiatingLeads?: SortOrder
    underContractLeads?: SortOrder
    closedLeads?: SortOrder
    sellerReplies?: SortOrder
    aiClassifications?: SortOrder
    avgConfidence?: SortOrder
    humanApprovalsNeeded?: SortOrder
    suggestedReplies?: SortOrder
    dncCount?: SortOrder
    hotLeads?: SortOrder
    automationScheduled?: SortOrder
    automationIdle?: SortOrder
    staleNewLeads?: SortOrder
    overdueFollowUps?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiPerformanceMetricMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    totalLeads?: SortOrder
    newLeads?: SortOrder
    contactedLeads?: SortOrder
    negotiatingLeads?: SortOrder
    underContractLeads?: SortOrder
    closedLeads?: SortOrder
    sellerReplies?: SortOrder
    aiClassifications?: SortOrder
    avgConfidence?: SortOrder
    humanApprovalsNeeded?: SortOrder
    suggestedReplies?: SortOrder
    dncCount?: SortOrder
    hotLeads?: SortOrder
    automationScheduled?: SortOrder
    automationIdle?: SortOrder
    staleNewLeads?: SortOrder
    overdueFollowUps?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiPerformanceMetricSumOrderByAggregateInput = {
    totalLeads?: SortOrder
    newLeads?: SortOrder
    contactedLeads?: SortOrder
    negotiatingLeads?: SortOrder
    underContractLeads?: SortOrder
    closedLeads?: SortOrder
    sellerReplies?: SortOrder
    aiClassifications?: SortOrder
    avgConfidence?: SortOrder
    humanApprovalsNeeded?: SortOrder
    suggestedReplies?: SortOrder
    dncCount?: SortOrder
    hotLeads?: SortOrder
    automationScheduled?: SortOrder
    automationIdle?: SortOrder
    staleNewLeads?: SortOrder
    overdueFollowUps?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type AiJobActionListRelationFilter = {
    every?: AiJobActionWhereInput
    some?: AiJobActionWhereInput
    none?: AiJobActionWhereInput
  }

  export type AiJobLogListRelationFilter = {
    every?: AiJobLogWhereInput
    some?: AiJobLogWhereInput
    none?: AiJobLogWhereInput
  }

  export type AiJobActionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AiJobLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AiJobCountOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiJobMaxOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiJobMinOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AiJobScalarRelationFilter = {
    is?: AiJobWhereInput
    isNot?: AiJobWhereInput
  }

  export type AiJobActionCountOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    action?: SortOrder
    count?: SortOrder
    createdAt?: SortOrder
  }

  export type AiJobActionAvgOrderByAggregateInput = {
    count?: SortOrder
  }

  export type AiJobActionMaxOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    action?: SortOrder
    count?: SortOrder
    createdAt?: SortOrder
  }

  export type AiJobActionMinOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    action?: SortOrder
    count?: SortOrder
    createdAt?: SortOrder
  }

  export type AiJobActionSumOrderByAggregateInput = {
    count?: SortOrder
  }

  export type AiJobLogCountOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    level?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type AiJobLogMaxOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    level?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type AiJobLogMinOrderByAggregateInput = {
    id?: SortOrder
    jobId?: SortOrder
    level?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
  }

  export type AiMemoryEventCountOrderByAggregateInput = {
    id?: SortOrder
    leadId?: SortOrder
    jobId?: SortOrder
    actionId?: SortOrder
    eventType?: SortOrder
    source?: SortOrder
    sellerReply?: SortOrder
    aiSuggestedReply?: SortOrder
    humanFinalReply?: SortOrder
    approvalDecision?: SortOrder
    messageChannel?: SortOrder
    messageStatus?: SortOrder
    sellerIntent?: SortOrder
    sellerSentiment?: SortOrder
    confidence?: SortOrder
    outcome?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type AiMemoryEventAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type AiMemoryEventMaxOrderByAggregateInput = {
    id?: SortOrder
    leadId?: SortOrder
    jobId?: SortOrder
    actionId?: SortOrder
    eventType?: SortOrder
    source?: SortOrder
    sellerReply?: SortOrder
    aiSuggestedReply?: SortOrder
    humanFinalReply?: SortOrder
    approvalDecision?: SortOrder
    messageChannel?: SortOrder
    messageStatus?: SortOrder
    sellerIntent?: SortOrder
    sellerSentiment?: SortOrder
    confidence?: SortOrder
    outcome?: SortOrder
    createdAt?: SortOrder
  }

  export type AiMemoryEventMinOrderByAggregateInput = {
    id?: SortOrder
    leadId?: SortOrder
    jobId?: SortOrder
    actionId?: SortOrder
    eventType?: SortOrder
    source?: SortOrder
    sellerReply?: SortOrder
    aiSuggestedReply?: SortOrder
    humanFinalReply?: SortOrder
    approvalDecision?: SortOrder
    messageChannel?: SortOrder
    messageStatus?: SortOrder
    sellerIntent?: SortOrder
    sellerSentiment?: SortOrder
    confidence?: SortOrder
    outcome?: SortOrder
    createdAt?: SortOrder
  }

  export type AiMemoryEventSumOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type AiLearningRecommendationCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    recommendationData?: SortOrder
    applicationPlan?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    reviewedAt?: SortOrder
    appliedAt?: SortOrder
    autoPromotable?: SortOrder
    promotedAt?: SortOrder
  }

  export type AiLearningRecommendationAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type AiLearningRecommendationMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    reviewedAt?: SortOrder
    appliedAt?: SortOrder
    autoPromotable?: SortOrder
    promotedAt?: SortOrder
  }

  export type AiLearningRecommendationMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    confidence?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    reviewedAt?: SortOrder
    appliedAt?: SortOrder
    autoPromotable?: SortOrder
    promotedAt?: SortOrder
  }

  export type AiLearningRecommendationSumOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumBuyerTierFilter<$PrismaModel = never> = {
    equals?: $Enums.BuyerTier | EnumBuyerTierFieldRefInput<$PrismaModel>
    in?: $Enums.BuyerTier[] | ListEnumBuyerTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuyerTier[] | ListEnumBuyerTierFieldRefInput<$PrismaModel>
    not?: NestedEnumBuyerTierFilter<$PrismaModel> | $Enums.BuyerTier
  }

  export type BuyerActivityListRelationFilter = {
    every?: BuyerActivityWhereInput
    some?: BuyerActivityWhereInput
    none?: BuyerActivityWhereInput
  }

  export type BuyerActivityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BuyerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    preferredLocations?: SortOrder
    priceRangeMin?: SortOrder
    priceRangeMax?: SortOrder
    propertyTypes?: SortOrder
    financingType?: SortOrder
    tier?: SortOrder
    preferredDealSize?: SortOrder
    preferredCondition?: SortOrder
    source?: SortOrder
    tags?: SortOrder
    buyerQualityScore?: SortOrder
    lastActiveAt?: SortOrder
    activityCount?: SortOrder
    meaningfulActivityCount?: SortOrder
    lastMeaningfulActivityAt?: SortOrder
    isActive?: SortOrder
    qualityReasons?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BuyerAvgOrderByAggregateInput = {
    priceRangeMin?: SortOrder
    priceRangeMax?: SortOrder
    preferredDealSize?: SortOrder
    buyerQualityScore?: SortOrder
    activityCount?: SortOrder
    meaningfulActivityCount?: SortOrder
  }

  export type BuyerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    priceRangeMin?: SortOrder
    priceRangeMax?: SortOrder
    financingType?: SortOrder
    tier?: SortOrder
    preferredDealSize?: SortOrder
    preferredCondition?: SortOrder
    source?: SortOrder
    buyerQualityScore?: SortOrder
    lastActiveAt?: SortOrder
    activityCount?: SortOrder
    meaningfulActivityCount?: SortOrder
    lastMeaningfulActivityAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BuyerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    priceRangeMin?: SortOrder
    priceRangeMax?: SortOrder
    financingType?: SortOrder
    tier?: SortOrder
    preferredDealSize?: SortOrder
    preferredCondition?: SortOrder
    source?: SortOrder
    buyerQualityScore?: SortOrder
    lastActiveAt?: SortOrder
    activityCount?: SortOrder
    meaningfulActivityCount?: SortOrder
    lastMeaningfulActivityAt?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BuyerSumOrderByAggregateInput = {
    priceRangeMin?: SortOrder
    priceRangeMax?: SortOrder
    preferredDealSize?: SortOrder
    buyerQualityScore?: SortOrder
    activityCount?: SortOrder
    meaningfulActivityCount?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumBuyerTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BuyerTier | EnumBuyerTierFieldRefInput<$PrismaModel>
    in?: $Enums.BuyerTier[] | ListEnumBuyerTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuyerTier[] | ListEnumBuyerTierFieldRefInput<$PrismaModel>
    not?: NestedEnumBuyerTierWithAggregatesFilter<$PrismaModel> | $Enums.BuyerTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBuyerTierFilter<$PrismaModel>
    _max?: NestedEnumBuyerTierFilter<$PrismaModel>
  }

  export type EnumBuyerActivityEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BuyerActivityEventType | EnumBuyerActivityEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BuyerActivityEventType[] | ListEnumBuyerActivityEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuyerActivityEventType[] | ListEnumBuyerActivityEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBuyerActivityEventTypeFilter<$PrismaModel> | $Enums.BuyerActivityEventType
  }

  export type BuyerScalarRelationFilter = {
    is?: BuyerWhereInput
    isNot?: BuyerWhereInput
  }

  export type BuyerActivityCountOrderByAggregateInput = {
    id?: SortOrder
    buyerId?: SortOrder
    dealId?: SortOrder
    eventType?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type BuyerActivityMaxOrderByAggregateInput = {
    id?: SortOrder
    buyerId?: SortOrder
    dealId?: SortOrder
    eventType?: SortOrder
    createdAt?: SortOrder
  }

  export type BuyerActivityMinOrderByAggregateInput = {
    id?: SortOrder
    buyerId?: SortOrder
    dealId?: SortOrder
    eventType?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumBuyerActivityEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BuyerActivityEventType | EnumBuyerActivityEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BuyerActivityEventType[] | ListEnumBuyerActivityEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuyerActivityEventType[] | ListEnumBuyerActivityEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBuyerActivityEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.BuyerActivityEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBuyerActivityEventTypeFilter<$PrismaModel>
    _max?: NestedEnumBuyerActivityEventTypeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumLeadStatusFieldUpdateOperationsInput = {
    set?: $Enums.LeadStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AiJobActionCreateNestedManyWithoutJobInput = {
    create?: XOR<AiJobActionCreateWithoutJobInput, AiJobActionUncheckedCreateWithoutJobInput> | AiJobActionCreateWithoutJobInput[] | AiJobActionUncheckedCreateWithoutJobInput[]
    connectOrCreate?: AiJobActionCreateOrConnectWithoutJobInput | AiJobActionCreateOrConnectWithoutJobInput[]
    createMany?: AiJobActionCreateManyJobInputEnvelope
    connect?: AiJobActionWhereUniqueInput | AiJobActionWhereUniqueInput[]
  }

  export type AiJobLogCreateNestedManyWithoutJobInput = {
    create?: XOR<AiJobLogCreateWithoutJobInput, AiJobLogUncheckedCreateWithoutJobInput> | AiJobLogCreateWithoutJobInput[] | AiJobLogUncheckedCreateWithoutJobInput[]
    connectOrCreate?: AiJobLogCreateOrConnectWithoutJobInput | AiJobLogCreateOrConnectWithoutJobInput[]
    createMany?: AiJobLogCreateManyJobInputEnvelope
    connect?: AiJobLogWhereUniqueInput | AiJobLogWhereUniqueInput[]
  }

  export type AiJobActionUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<AiJobActionCreateWithoutJobInput, AiJobActionUncheckedCreateWithoutJobInput> | AiJobActionCreateWithoutJobInput[] | AiJobActionUncheckedCreateWithoutJobInput[]
    connectOrCreate?: AiJobActionCreateOrConnectWithoutJobInput | AiJobActionCreateOrConnectWithoutJobInput[]
    createMany?: AiJobActionCreateManyJobInputEnvelope
    connect?: AiJobActionWhereUniqueInput | AiJobActionWhereUniqueInput[]
  }

  export type AiJobLogUncheckedCreateNestedManyWithoutJobInput = {
    create?: XOR<AiJobLogCreateWithoutJobInput, AiJobLogUncheckedCreateWithoutJobInput> | AiJobLogCreateWithoutJobInput[] | AiJobLogUncheckedCreateWithoutJobInput[]
    connectOrCreate?: AiJobLogCreateOrConnectWithoutJobInput | AiJobLogCreateOrConnectWithoutJobInput[]
    createMany?: AiJobLogCreateManyJobInputEnvelope
    connect?: AiJobLogWhereUniqueInput | AiJobLogWhereUniqueInput[]
  }

  export type AiJobActionUpdateManyWithoutJobNestedInput = {
    create?: XOR<AiJobActionCreateWithoutJobInput, AiJobActionUncheckedCreateWithoutJobInput> | AiJobActionCreateWithoutJobInput[] | AiJobActionUncheckedCreateWithoutJobInput[]
    connectOrCreate?: AiJobActionCreateOrConnectWithoutJobInput | AiJobActionCreateOrConnectWithoutJobInput[]
    upsert?: AiJobActionUpsertWithWhereUniqueWithoutJobInput | AiJobActionUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: AiJobActionCreateManyJobInputEnvelope
    set?: AiJobActionWhereUniqueInput | AiJobActionWhereUniqueInput[]
    disconnect?: AiJobActionWhereUniqueInput | AiJobActionWhereUniqueInput[]
    delete?: AiJobActionWhereUniqueInput | AiJobActionWhereUniqueInput[]
    connect?: AiJobActionWhereUniqueInput | AiJobActionWhereUniqueInput[]
    update?: AiJobActionUpdateWithWhereUniqueWithoutJobInput | AiJobActionUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: AiJobActionUpdateManyWithWhereWithoutJobInput | AiJobActionUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: AiJobActionScalarWhereInput | AiJobActionScalarWhereInput[]
  }

  export type AiJobLogUpdateManyWithoutJobNestedInput = {
    create?: XOR<AiJobLogCreateWithoutJobInput, AiJobLogUncheckedCreateWithoutJobInput> | AiJobLogCreateWithoutJobInput[] | AiJobLogUncheckedCreateWithoutJobInput[]
    connectOrCreate?: AiJobLogCreateOrConnectWithoutJobInput | AiJobLogCreateOrConnectWithoutJobInput[]
    upsert?: AiJobLogUpsertWithWhereUniqueWithoutJobInput | AiJobLogUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: AiJobLogCreateManyJobInputEnvelope
    set?: AiJobLogWhereUniqueInput | AiJobLogWhereUniqueInput[]
    disconnect?: AiJobLogWhereUniqueInput | AiJobLogWhereUniqueInput[]
    delete?: AiJobLogWhereUniqueInput | AiJobLogWhereUniqueInput[]
    connect?: AiJobLogWhereUniqueInput | AiJobLogWhereUniqueInput[]
    update?: AiJobLogUpdateWithWhereUniqueWithoutJobInput | AiJobLogUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: AiJobLogUpdateManyWithWhereWithoutJobInput | AiJobLogUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: AiJobLogScalarWhereInput | AiJobLogScalarWhereInput[]
  }

  export type AiJobActionUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<AiJobActionCreateWithoutJobInput, AiJobActionUncheckedCreateWithoutJobInput> | AiJobActionCreateWithoutJobInput[] | AiJobActionUncheckedCreateWithoutJobInput[]
    connectOrCreate?: AiJobActionCreateOrConnectWithoutJobInput | AiJobActionCreateOrConnectWithoutJobInput[]
    upsert?: AiJobActionUpsertWithWhereUniqueWithoutJobInput | AiJobActionUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: AiJobActionCreateManyJobInputEnvelope
    set?: AiJobActionWhereUniqueInput | AiJobActionWhereUniqueInput[]
    disconnect?: AiJobActionWhereUniqueInput | AiJobActionWhereUniqueInput[]
    delete?: AiJobActionWhereUniqueInput | AiJobActionWhereUniqueInput[]
    connect?: AiJobActionWhereUniqueInput | AiJobActionWhereUniqueInput[]
    update?: AiJobActionUpdateWithWhereUniqueWithoutJobInput | AiJobActionUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: AiJobActionUpdateManyWithWhereWithoutJobInput | AiJobActionUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: AiJobActionScalarWhereInput | AiJobActionScalarWhereInput[]
  }

  export type AiJobLogUncheckedUpdateManyWithoutJobNestedInput = {
    create?: XOR<AiJobLogCreateWithoutJobInput, AiJobLogUncheckedCreateWithoutJobInput> | AiJobLogCreateWithoutJobInput[] | AiJobLogUncheckedCreateWithoutJobInput[]
    connectOrCreate?: AiJobLogCreateOrConnectWithoutJobInput | AiJobLogCreateOrConnectWithoutJobInput[]
    upsert?: AiJobLogUpsertWithWhereUniqueWithoutJobInput | AiJobLogUpsertWithWhereUniqueWithoutJobInput[]
    createMany?: AiJobLogCreateManyJobInputEnvelope
    set?: AiJobLogWhereUniqueInput | AiJobLogWhereUniqueInput[]
    disconnect?: AiJobLogWhereUniqueInput | AiJobLogWhereUniqueInput[]
    delete?: AiJobLogWhereUniqueInput | AiJobLogWhereUniqueInput[]
    connect?: AiJobLogWhereUniqueInput | AiJobLogWhereUniqueInput[]
    update?: AiJobLogUpdateWithWhereUniqueWithoutJobInput | AiJobLogUpdateWithWhereUniqueWithoutJobInput[]
    updateMany?: AiJobLogUpdateManyWithWhereWithoutJobInput | AiJobLogUpdateManyWithWhereWithoutJobInput[]
    deleteMany?: AiJobLogScalarWhereInput | AiJobLogScalarWhereInput[]
  }

  export type AiJobCreateNestedOneWithoutActionsInput = {
    create?: XOR<AiJobCreateWithoutActionsInput, AiJobUncheckedCreateWithoutActionsInput>
    connectOrCreate?: AiJobCreateOrConnectWithoutActionsInput
    connect?: AiJobWhereUniqueInput
  }

  export type AiJobUpdateOneRequiredWithoutActionsNestedInput = {
    create?: XOR<AiJobCreateWithoutActionsInput, AiJobUncheckedCreateWithoutActionsInput>
    connectOrCreate?: AiJobCreateOrConnectWithoutActionsInput
    upsert?: AiJobUpsertWithoutActionsInput
    connect?: AiJobWhereUniqueInput
    update?: XOR<XOR<AiJobUpdateToOneWithWhereWithoutActionsInput, AiJobUpdateWithoutActionsInput>, AiJobUncheckedUpdateWithoutActionsInput>
  }

  export type AiJobCreateNestedOneWithoutLogsInput = {
    create?: XOR<AiJobCreateWithoutLogsInput, AiJobUncheckedCreateWithoutLogsInput>
    connectOrCreate?: AiJobCreateOrConnectWithoutLogsInput
    connect?: AiJobWhereUniqueInput
  }

  export type AiJobUpdateOneRequiredWithoutLogsNestedInput = {
    create?: XOR<AiJobCreateWithoutLogsInput, AiJobUncheckedCreateWithoutLogsInput>
    connectOrCreate?: AiJobCreateOrConnectWithoutLogsInput
    upsert?: AiJobUpsertWithoutLogsInput
    connect?: AiJobWhereUniqueInput
    update?: XOR<XOR<AiJobUpdateToOneWithWhereWithoutLogsInput, AiJobUpdateWithoutLogsInput>, AiJobUncheckedUpdateWithoutLogsInput>
  }

  export type BuyerActivityCreateNestedManyWithoutBuyerInput = {
    create?: XOR<BuyerActivityCreateWithoutBuyerInput, BuyerActivityUncheckedCreateWithoutBuyerInput> | BuyerActivityCreateWithoutBuyerInput[] | BuyerActivityUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: BuyerActivityCreateOrConnectWithoutBuyerInput | BuyerActivityCreateOrConnectWithoutBuyerInput[]
    createMany?: BuyerActivityCreateManyBuyerInputEnvelope
    connect?: BuyerActivityWhereUniqueInput | BuyerActivityWhereUniqueInput[]
  }

  export type BuyerActivityUncheckedCreateNestedManyWithoutBuyerInput = {
    create?: XOR<BuyerActivityCreateWithoutBuyerInput, BuyerActivityUncheckedCreateWithoutBuyerInput> | BuyerActivityCreateWithoutBuyerInput[] | BuyerActivityUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: BuyerActivityCreateOrConnectWithoutBuyerInput | BuyerActivityCreateOrConnectWithoutBuyerInput[]
    createMany?: BuyerActivityCreateManyBuyerInputEnvelope
    connect?: BuyerActivityWhereUniqueInput | BuyerActivityWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumBuyerTierFieldUpdateOperationsInput = {
    set?: $Enums.BuyerTier
  }

  export type BuyerActivityUpdateManyWithoutBuyerNestedInput = {
    create?: XOR<BuyerActivityCreateWithoutBuyerInput, BuyerActivityUncheckedCreateWithoutBuyerInput> | BuyerActivityCreateWithoutBuyerInput[] | BuyerActivityUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: BuyerActivityCreateOrConnectWithoutBuyerInput | BuyerActivityCreateOrConnectWithoutBuyerInput[]
    upsert?: BuyerActivityUpsertWithWhereUniqueWithoutBuyerInput | BuyerActivityUpsertWithWhereUniqueWithoutBuyerInput[]
    createMany?: BuyerActivityCreateManyBuyerInputEnvelope
    set?: BuyerActivityWhereUniqueInput | BuyerActivityWhereUniqueInput[]
    disconnect?: BuyerActivityWhereUniqueInput | BuyerActivityWhereUniqueInput[]
    delete?: BuyerActivityWhereUniqueInput | BuyerActivityWhereUniqueInput[]
    connect?: BuyerActivityWhereUniqueInput | BuyerActivityWhereUniqueInput[]
    update?: BuyerActivityUpdateWithWhereUniqueWithoutBuyerInput | BuyerActivityUpdateWithWhereUniqueWithoutBuyerInput[]
    updateMany?: BuyerActivityUpdateManyWithWhereWithoutBuyerInput | BuyerActivityUpdateManyWithWhereWithoutBuyerInput[]
    deleteMany?: BuyerActivityScalarWhereInput | BuyerActivityScalarWhereInput[]
  }

  export type BuyerActivityUncheckedUpdateManyWithoutBuyerNestedInput = {
    create?: XOR<BuyerActivityCreateWithoutBuyerInput, BuyerActivityUncheckedCreateWithoutBuyerInput> | BuyerActivityCreateWithoutBuyerInput[] | BuyerActivityUncheckedCreateWithoutBuyerInput[]
    connectOrCreate?: BuyerActivityCreateOrConnectWithoutBuyerInput | BuyerActivityCreateOrConnectWithoutBuyerInput[]
    upsert?: BuyerActivityUpsertWithWhereUniqueWithoutBuyerInput | BuyerActivityUpsertWithWhereUniqueWithoutBuyerInput[]
    createMany?: BuyerActivityCreateManyBuyerInputEnvelope
    set?: BuyerActivityWhereUniqueInput | BuyerActivityWhereUniqueInput[]
    disconnect?: BuyerActivityWhereUniqueInput | BuyerActivityWhereUniqueInput[]
    delete?: BuyerActivityWhereUniqueInput | BuyerActivityWhereUniqueInput[]
    connect?: BuyerActivityWhereUniqueInput | BuyerActivityWhereUniqueInput[]
    update?: BuyerActivityUpdateWithWhereUniqueWithoutBuyerInput | BuyerActivityUpdateWithWhereUniqueWithoutBuyerInput[]
    updateMany?: BuyerActivityUpdateManyWithWhereWithoutBuyerInput | BuyerActivityUpdateManyWithWhereWithoutBuyerInput[]
    deleteMany?: BuyerActivityScalarWhereInput | BuyerActivityScalarWhereInput[]
  }

  export type BuyerCreateNestedOneWithoutActivitiesInput = {
    create?: XOR<BuyerCreateWithoutActivitiesInput, BuyerUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: BuyerCreateOrConnectWithoutActivitiesInput
    connect?: BuyerWhereUniqueInput
  }

  export type EnumBuyerActivityEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.BuyerActivityEventType
  }

  export type BuyerUpdateOneRequiredWithoutActivitiesNestedInput = {
    create?: XOR<BuyerCreateWithoutActivitiesInput, BuyerUncheckedCreateWithoutActivitiesInput>
    connectOrCreate?: BuyerCreateOrConnectWithoutActivitiesInput
    upsert?: BuyerUpsertWithoutActivitiesInput
    connect?: BuyerWhereUniqueInput
    update?: XOR<XOR<BuyerUpdateToOneWithWhereWithoutActivitiesInput, BuyerUpdateWithoutActivitiesInput>, BuyerUncheckedUpdateWithoutActivitiesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumLeadStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadStatus | EnumLeadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadStatusFilter<$PrismaModel> | $Enums.LeadStatus
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumLeadStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LeadStatus | EnumLeadStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LeadStatus[] | ListEnumLeadStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLeadStatusWithAggregatesFilter<$PrismaModel> | $Enums.LeadStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLeadStatusFilter<$PrismaModel>
    _max?: NestedEnumLeadStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumBuyerTierFilter<$PrismaModel = never> = {
    equals?: $Enums.BuyerTier | EnumBuyerTierFieldRefInput<$PrismaModel>
    in?: $Enums.BuyerTier[] | ListEnumBuyerTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuyerTier[] | ListEnumBuyerTierFieldRefInput<$PrismaModel>
    not?: NestedEnumBuyerTierFilter<$PrismaModel> | $Enums.BuyerTier
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedEnumBuyerTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BuyerTier | EnumBuyerTierFieldRefInput<$PrismaModel>
    in?: $Enums.BuyerTier[] | ListEnumBuyerTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuyerTier[] | ListEnumBuyerTierFieldRefInput<$PrismaModel>
    not?: NestedEnumBuyerTierWithAggregatesFilter<$PrismaModel> | $Enums.BuyerTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBuyerTierFilter<$PrismaModel>
    _max?: NestedEnumBuyerTierFilter<$PrismaModel>
  }

  export type NestedEnumBuyerActivityEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.BuyerActivityEventType | EnumBuyerActivityEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BuyerActivityEventType[] | ListEnumBuyerActivityEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuyerActivityEventType[] | ListEnumBuyerActivityEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBuyerActivityEventTypeFilter<$PrismaModel> | $Enums.BuyerActivityEventType
  }

  export type NestedEnumBuyerActivityEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BuyerActivityEventType | EnumBuyerActivityEventTypeFieldRefInput<$PrismaModel>
    in?: $Enums.BuyerActivityEventType[] | ListEnumBuyerActivityEventTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.BuyerActivityEventType[] | ListEnumBuyerActivityEventTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumBuyerActivityEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.BuyerActivityEventType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBuyerActivityEventTypeFilter<$PrismaModel>
    _max?: NestedEnumBuyerActivityEventTypeFilter<$PrismaModel>
  }

  export type AiJobActionCreateWithoutJobInput = {
    id?: string
    action: string
    count?: number
    createdAt?: Date | string
  }

  export type AiJobActionUncheckedCreateWithoutJobInput = {
    id?: string
    action: string
    count?: number
    createdAt?: Date | string
  }

  export type AiJobActionCreateOrConnectWithoutJobInput = {
    where: AiJobActionWhereUniqueInput
    create: XOR<AiJobActionCreateWithoutJobInput, AiJobActionUncheckedCreateWithoutJobInput>
  }

  export type AiJobActionCreateManyJobInputEnvelope = {
    data: AiJobActionCreateManyJobInput | AiJobActionCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type AiJobLogCreateWithoutJobInput = {
    id?: string
    level?: string
    message: string
    createdAt?: Date | string
  }

  export type AiJobLogUncheckedCreateWithoutJobInput = {
    id?: string
    level?: string
    message: string
    createdAt?: Date | string
  }

  export type AiJobLogCreateOrConnectWithoutJobInput = {
    where: AiJobLogWhereUniqueInput
    create: XOR<AiJobLogCreateWithoutJobInput, AiJobLogUncheckedCreateWithoutJobInput>
  }

  export type AiJobLogCreateManyJobInputEnvelope = {
    data: AiJobLogCreateManyJobInput | AiJobLogCreateManyJobInput[]
    skipDuplicates?: boolean
  }

  export type AiJobActionUpsertWithWhereUniqueWithoutJobInput = {
    where: AiJobActionWhereUniqueInput
    update: XOR<AiJobActionUpdateWithoutJobInput, AiJobActionUncheckedUpdateWithoutJobInput>
    create: XOR<AiJobActionCreateWithoutJobInput, AiJobActionUncheckedCreateWithoutJobInput>
  }

  export type AiJobActionUpdateWithWhereUniqueWithoutJobInput = {
    where: AiJobActionWhereUniqueInput
    data: XOR<AiJobActionUpdateWithoutJobInput, AiJobActionUncheckedUpdateWithoutJobInput>
  }

  export type AiJobActionUpdateManyWithWhereWithoutJobInput = {
    where: AiJobActionScalarWhereInput
    data: XOR<AiJobActionUpdateManyMutationInput, AiJobActionUncheckedUpdateManyWithoutJobInput>
  }

  export type AiJobActionScalarWhereInput = {
    AND?: AiJobActionScalarWhereInput | AiJobActionScalarWhereInput[]
    OR?: AiJobActionScalarWhereInput[]
    NOT?: AiJobActionScalarWhereInput | AiJobActionScalarWhereInput[]
    id?: StringFilter<"AiJobAction"> | string
    jobId?: StringFilter<"AiJobAction"> | string
    action?: StringFilter<"AiJobAction"> | string
    count?: IntFilter<"AiJobAction"> | number
    createdAt?: DateTimeFilter<"AiJobAction"> | Date | string
  }

  export type AiJobLogUpsertWithWhereUniqueWithoutJobInput = {
    where: AiJobLogWhereUniqueInput
    update: XOR<AiJobLogUpdateWithoutJobInput, AiJobLogUncheckedUpdateWithoutJobInput>
    create: XOR<AiJobLogCreateWithoutJobInput, AiJobLogUncheckedCreateWithoutJobInput>
  }

  export type AiJobLogUpdateWithWhereUniqueWithoutJobInput = {
    where: AiJobLogWhereUniqueInput
    data: XOR<AiJobLogUpdateWithoutJobInput, AiJobLogUncheckedUpdateWithoutJobInput>
  }

  export type AiJobLogUpdateManyWithWhereWithoutJobInput = {
    where: AiJobLogScalarWhereInput
    data: XOR<AiJobLogUpdateManyMutationInput, AiJobLogUncheckedUpdateManyWithoutJobInput>
  }

  export type AiJobLogScalarWhereInput = {
    AND?: AiJobLogScalarWhereInput | AiJobLogScalarWhereInput[]
    OR?: AiJobLogScalarWhereInput[]
    NOT?: AiJobLogScalarWhereInput | AiJobLogScalarWhereInput[]
    id?: StringFilter<"AiJobLog"> | string
    jobId?: StringFilter<"AiJobLog"> | string
    level?: StringFilter<"AiJobLog"> | string
    message?: StringFilter<"AiJobLog"> | string
    createdAt?: DateTimeFilter<"AiJobLog"> | Date | string
  }

  export type AiJobCreateWithoutActionsInput = {
    id?: string
    status?: string
    startedAt?: Date | string
    completedAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: AiJobLogCreateNestedManyWithoutJobInput
  }

  export type AiJobUncheckedCreateWithoutActionsInput = {
    id?: string
    status?: string
    startedAt?: Date | string
    completedAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    logs?: AiJobLogUncheckedCreateNestedManyWithoutJobInput
  }

  export type AiJobCreateOrConnectWithoutActionsInput = {
    where: AiJobWhereUniqueInput
    create: XOR<AiJobCreateWithoutActionsInput, AiJobUncheckedCreateWithoutActionsInput>
  }

  export type AiJobUpsertWithoutActionsInput = {
    update: XOR<AiJobUpdateWithoutActionsInput, AiJobUncheckedUpdateWithoutActionsInput>
    create: XOR<AiJobCreateWithoutActionsInput, AiJobUncheckedCreateWithoutActionsInput>
    where?: AiJobWhereInput
  }

  export type AiJobUpdateToOneWithWhereWithoutActionsInput = {
    where?: AiJobWhereInput
    data: XOR<AiJobUpdateWithoutActionsInput, AiJobUncheckedUpdateWithoutActionsInput>
  }

  export type AiJobUpdateWithoutActionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: AiJobLogUpdateManyWithoutJobNestedInput
  }

  export type AiJobUncheckedUpdateWithoutActionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    logs?: AiJobLogUncheckedUpdateManyWithoutJobNestedInput
  }

  export type AiJobCreateWithoutLogsInput = {
    id?: string
    status?: string
    startedAt?: Date | string
    completedAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    actions?: AiJobActionCreateNestedManyWithoutJobInput
  }

  export type AiJobUncheckedCreateWithoutLogsInput = {
    id?: string
    status?: string
    startedAt?: Date | string
    completedAt?: Date | string | null
    errorMessage?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    actions?: AiJobActionUncheckedCreateNestedManyWithoutJobInput
  }

  export type AiJobCreateOrConnectWithoutLogsInput = {
    where: AiJobWhereUniqueInput
    create: XOR<AiJobCreateWithoutLogsInput, AiJobUncheckedCreateWithoutLogsInput>
  }

  export type AiJobUpsertWithoutLogsInput = {
    update: XOR<AiJobUpdateWithoutLogsInput, AiJobUncheckedUpdateWithoutLogsInput>
    create: XOR<AiJobCreateWithoutLogsInput, AiJobUncheckedCreateWithoutLogsInput>
    where?: AiJobWhereInput
  }

  export type AiJobUpdateToOneWithWhereWithoutLogsInput = {
    where?: AiJobWhereInput
    data: XOR<AiJobUpdateWithoutLogsInput, AiJobUncheckedUpdateWithoutLogsInput>
  }

  export type AiJobUpdateWithoutLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actions?: AiJobActionUpdateManyWithoutJobNestedInput
  }

  export type AiJobUncheckedUpdateWithoutLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    actions?: AiJobActionUncheckedUpdateManyWithoutJobNestedInput
  }

  export type BuyerActivityCreateWithoutBuyerInput = {
    id?: string
    dealId?: string | null
    eventType: $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type BuyerActivityUncheckedCreateWithoutBuyerInput = {
    id?: string
    dealId?: string | null
    eventType: $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type BuyerActivityCreateOrConnectWithoutBuyerInput = {
    where: BuyerActivityWhereUniqueInput
    create: XOR<BuyerActivityCreateWithoutBuyerInput, BuyerActivityUncheckedCreateWithoutBuyerInput>
  }

  export type BuyerActivityCreateManyBuyerInputEnvelope = {
    data: BuyerActivityCreateManyBuyerInput | BuyerActivityCreateManyBuyerInput[]
    skipDuplicates?: boolean
  }

  export type BuyerActivityUpsertWithWhereUniqueWithoutBuyerInput = {
    where: BuyerActivityWhereUniqueInput
    update: XOR<BuyerActivityUpdateWithoutBuyerInput, BuyerActivityUncheckedUpdateWithoutBuyerInput>
    create: XOR<BuyerActivityCreateWithoutBuyerInput, BuyerActivityUncheckedCreateWithoutBuyerInput>
  }

  export type BuyerActivityUpdateWithWhereUniqueWithoutBuyerInput = {
    where: BuyerActivityWhereUniqueInput
    data: XOR<BuyerActivityUpdateWithoutBuyerInput, BuyerActivityUncheckedUpdateWithoutBuyerInput>
  }

  export type BuyerActivityUpdateManyWithWhereWithoutBuyerInput = {
    where: BuyerActivityScalarWhereInput
    data: XOR<BuyerActivityUpdateManyMutationInput, BuyerActivityUncheckedUpdateManyWithoutBuyerInput>
  }

  export type BuyerActivityScalarWhereInput = {
    AND?: BuyerActivityScalarWhereInput | BuyerActivityScalarWhereInput[]
    OR?: BuyerActivityScalarWhereInput[]
    NOT?: BuyerActivityScalarWhereInput | BuyerActivityScalarWhereInput[]
    id?: StringFilter<"BuyerActivity"> | string
    buyerId?: StringFilter<"BuyerActivity"> | string
    dealId?: StringNullableFilter<"BuyerActivity"> | string | null
    eventType?: EnumBuyerActivityEventTypeFilter<"BuyerActivity"> | $Enums.BuyerActivityEventType
    metadata?: JsonNullableFilter<"BuyerActivity">
    createdAt?: DateTimeFilter<"BuyerActivity"> | Date | string
  }

  export type BuyerCreateWithoutActivitiesInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    preferredLocations?: NullableJsonNullValueInput | InputJsonValue
    priceRangeMin?: number | null
    priceRangeMax?: number | null
    propertyTypes?: NullableJsonNullValueInput | InputJsonValue
    financingType?: string | null
    tier?: $Enums.BuyerTier
    preferredDealSize?: number | null
    preferredCondition?: string | null
    source?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    buyerQualityScore?: number
    lastActiveAt?: Date | string | null
    activityCount?: number
    meaningfulActivityCount?: number
    lastMeaningfulActivityAt?: Date | string | null
    isActive?: boolean
    qualityReasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BuyerUncheckedCreateWithoutActivitiesInput = {
    id?: string
    name: string
    phone?: string | null
    email?: string | null
    preferredLocations?: NullableJsonNullValueInput | InputJsonValue
    priceRangeMin?: number | null
    priceRangeMax?: number | null
    propertyTypes?: NullableJsonNullValueInput | InputJsonValue
    financingType?: string | null
    tier?: $Enums.BuyerTier
    preferredDealSize?: number | null
    preferredCondition?: string | null
    source?: string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    buyerQualityScore?: number
    lastActiveAt?: Date | string | null
    activityCount?: number
    meaningfulActivityCount?: number
    lastMeaningfulActivityAt?: Date | string | null
    isActive?: boolean
    qualityReasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type BuyerCreateOrConnectWithoutActivitiesInput = {
    where: BuyerWhereUniqueInput
    create: XOR<BuyerCreateWithoutActivitiesInput, BuyerUncheckedCreateWithoutActivitiesInput>
  }

  export type BuyerUpsertWithoutActivitiesInput = {
    update: XOR<BuyerUpdateWithoutActivitiesInput, BuyerUncheckedUpdateWithoutActivitiesInput>
    create: XOR<BuyerCreateWithoutActivitiesInput, BuyerUncheckedCreateWithoutActivitiesInput>
    where?: BuyerWhereInput
  }

  export type BuyerUpdateToOneWithWhereWithoutActivitiesInput = {
    where?: BuyerWhereInput
    data: XOR<BuyerUpdateWithoutActivitiesInput, BuyerUncheckedUpdateWithoutActivitiesInput>
  }

  export type BuyerUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLocations?: NullableJsonNullValueInput | InputJsonValue
    priceRangeMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceRangeMax?: NullableIntFieldUpdateOperationsInput | number | null
    propertyTypes?: NullableJsonNullValueInput | InputJsonValue
    financingType?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: EnumBuyerTierFieldUpdateOperationsInput | $Enums.BuyerTier
    preferredDealSize?: NullableIntFieldUpdateOperationsInput | number | null
    preferredCondition?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    buyerQualityScore?: IntFieldUpdateOperationsInput | number
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activityCount?: IntFieldUpdateOperationsInput | number
    meaningfulActivityCount?: IntFieldUpdateOperationsInput | number
    lastMeaningfulActivityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    qualityReasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerUncheckedUpdateWithoutActivitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    preferredLocations?: NullableJsonNullValueInput | InputJsonValue
    priceRangeMin?: NullableIntFieldUpdateOperationsInput | number | null
    priceRangeMax?: NullableIntFieldUpdateOperationsInput | number | null
    propertyTypes?: NullableJsonNullValueInput | InputJsonValue
    financingType?: NullableStringFieldUpdateOperationsInput | string | null
    tier?: EnumBuyerTierFieldUpdateOperationsInput | $Enums.BuyerTier
    preferredDealSize?: NullableIntFieldUpdateOperationsInput | number | null
    preferredCondition?: NullableStringFieldUpdateOperationsInput | string | null
    source?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: NullableJsonNullValueInput | InputJsonValue
    buyerQualityScore?: IntFieldUpdateOperationsInput | number
    lastActiveAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activityCount?: IntFieldUpdateOperationsInput | number
    meaningfulActivityCount?: IntFieldUpdateOperationsInput | number
    lastMeaningfulActivityAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    qualityReasons?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobActionCreateManyJobInput = {
    id?: string
    action: string
    count?: number
    createdAt?: Date | string
  }

  export type AiJobLogCreateManyJobInput = {
    id?: string
    level?: string
    message: string
    createdAt?: Date | string
  }

  export type AiJobActionUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobActionUncheckedUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobActionUncheckedUpdateManyWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobLogUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobLogUncheckedUpdateWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiJobLogUncheckedUpdateManyWithoutJobInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerActivityCreateManyBuyerInput = {
    id?: string
    dealId?: string | null
    eventType: $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type BuyerActivityUpdateWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    dealId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumBuyerActivityEventTypeFieldUpdateOperationsInput | $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerActivityUncheckedUpdateWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    dealId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumBuyerActivityEventTypeFieldUpdateOperationsInput | $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BuyerActivityUncheckedUpdateManyWithoutBuyerInput = {
    id?: StringFieldUpdateOperationsInput | string
    dealId?: NullableStringFieldUpdateOperationsInput | string | null
    eventType?: EnumBuyerActivityEventTypeFieldUpdateOperationsInput | $Enums.BuyerActivityEventType
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}