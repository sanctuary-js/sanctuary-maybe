<a href="https://github.com/fantasyland/fantasy-land"><img alt="Fantasy Land" src="https://raw.githubusercontent.com/fantasyland/fantasy-land/master/logo.png" width="75" height="75" align="left"></a>

# sanctuary-maybe

The Maybe type represents optional values: a value of type `Maybe a` is
either Nothing (the empty value) or a Just whose value is of type `a`.

`Maybe a` satisfies the following [Fantasy Land][] specifications:

```javascript
> const Useless = require ('sanctuary-useless')

> S.map (k => k + ' '.repeat (16 - k.length) +
.             (Z[k].test (Just (Useless)) ? '\u2705   ' :
.              Z[k].test (Nothing)        ? '\u2705 * ' :
.              /* otherwise */              '\u274C   '))
.       (S.keys (S.unchecked.filter (S.is ($.TypeClass)) (Z)))
[ 'Setoid          ✅ * ',  // if ‘a’ satisfies Setoid
. 'Ord             ✅ * ',  // if ‘a’ satisfies Ord
. 'Semigroupoid    ❌   ',
. 'Category        ❌   ',
. 'Semigroup       ✅ * ',  // if ‘a’ satisfies Semigroup
. 'Monoid          ✅ * ',  // if ‘a’ satisfies Semigroup
. 'Group           ❌   ',
. 'Filterable      ✅   ',
. 'Functor         ✅   ',
. 'Bifunctor       ❌   ',
. 'Profunctor      ❌   ',
. 'Apply           ✅   ',
. 'Applicative     ✅   ',
. 'Chain           ✅   ',
. 'ChainRec        ✅   ',
. 'Monad           ✅   ',
. 'Alt             ✅   ',
. 'Plus            ✅   ',
. 'Alternative     ✅   ',
. 'Foldable        ✅   ',
. 'Traversable     ✅   ',
. 'Extend          ✅   ',
. 'Comonad         ❌   ',
. 'Contravariant   ❌   ' ]
```

#### <a name="Maybe" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L144">`Maybe :: TypeRep Maybe`</a>

Maybe [type representative][].

#### <a name="Maybe.Nothing" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L148">`Maybe.Nothing :: Maybe a`</a>

The empty value of type `Maybe a`.

```javascript
> Nothing
Nothing
```

#### <a name="Maybe.Just" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L158">`Maybe.Just :: a -⁠> Maybe a`</a>

Constructs a value of type `Maybe a` from a value of type `a`.

```javascript
> Just (42)
Just (42)
```

#### <a name="Maybe.@@type" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L181">`Maybe.@@type :: String`</a>

Maybe [type identifier][].

```javascript
> type (Just (42))
'sanctuary-maybe/Maybe@1'

> type.parse (type (Just (42)))
{namespace: 'sanctuary-maybe', name: 'Maybe', version: 1}
```

#### <a name="Maybe.fantasy-land/empty" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L194">`Maybe.fantasy-land/empty :: () -⁠> Maybe a`</a>

  - `empty (Maybe)` is equivalent to `Nothing`

```javascript
> S.empty (Maybe)
Nothing
```

#### <a name="Maybe.fantasy-land/of" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L204">`Maybe.fantasy-land/of :: a -⁠> Maybe a`</a>

  - `of (Maybe) (x)` is equivalent to `Just (x)`

```javascript
> S.of (Maybe) (42)
Just (42)
```

#### <a name="Maybe.fantasy-land/chainRec" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L217">`Maybe.fantasy-land/chainRec :: ((a -⁠> c, b -⁠> c, a) -⁠> Maybe c, a) -⁠> Maybe b`</a>

```javascript
> Z.chainRec (
.   Maybe,
.   (next, done, x) =>
.     x <= 1 ? Nothing : Just (x >= 1000 ? done (x) : next (x * x)),
.   1
. )
Nothing

> Z.chainRec (
.   Maybe,
.   (next, done, x) =>
.     x <= 1 ? Nothing : Just (x >= 1000 ? done (x) : next (x * x)),
.   2
. )
Just (65536)
```

#### <a name="Maybe.fantasy-land/zero" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L246">`Maybe.fantasy-land/zero :: () -⁠> Maybe a`</a>

  - `zero (Maybe)` is equivalent to `Nothing`

```javascript
> S.zero (Maybe)
Nothing
```

#### <a name="Maybe.prototype.@@show" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L256">`Maybe#@@show :: Showable a => Maybe a ~> () -⁠> String`</a>

  - `show (Nothing)` is equivalent to `'Nothing'`
  - `show (Just (x))` is equivalent to `'Just (' + show (x) + ')'`

```javascript
> show (Nothing)
'Nothing'

> show (Just (['foo', 'bar', 'baz']))
'Just (["foo", "bar", "baz"])'
```

#### <a name="Maybe.prototype.fantasy-land/equals" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L275">`Maybe#fantasy-land/equals :: Setoid a => Maybe a ~> Maybe a -⁠> Boolean`</a>

  - `Nothing` is equal to `Nothing`
  - `Just (x)` is equal to `Just (y)` [iff][] `x` is equal to `y`
    according to [`Z.equals`][]
  - `Nothing` is never equal to `Just (x)`

```javascript
> S.equals (Nothing) (Nothing)
true

> S.equals (Just ([1, 2, 3])) (Just ([1, 2, 3]))
true

> S.equals (Just ([1, 2, 3])) (Just ([3, 2, 1]))
false

> S.equals (Just ([1, 2, 3])) (Nothing)
false
```

#### <a name="Maybe.prototype.fantasy-land/lte" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L302">`Maybe#fantasy-land/lte :: Ord a => Maybe a ~> Maybe a -⁠> Boolean`</a>

  - `Nothing` is (less than or) equal to `Nothing`
  - `Just (x)` is less than or equal to `Just (y)` [iff][] `x` is less
    than or equal to `y` according to [`Z.lte`][]
  - `Nothing` is always less than `Just (x)`

```javascript
> S.filter (S.lte (Nothing)) ([Nothing, Just (0), Just (1), Just (2)])
[Nothing]

> S.filter (S.lte (Just (1))) ([Nothing, Just (0), Just (1), Just (2)])
[Nothing, Just (0), Just (1)]
```

#### <a name="Maybe.prototype.fantasy-land/concat" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L323">`Maybe#fantasy-land/concat :: Semigroup a => Maybe a ~> Maybe a -⁠> Maybe a`</a>

  - `concat (Nothing) (Nothing)` is equivalent to `Nothing`
  - `concat (Just (x)) (Just (y))` is equivalent to
    `Just (concat (x) (y))`
  - `concat (Nothing) (Just (x))` is equivalent to `Just (x)`
  - `concat (Just (x)) (Nothing)` is equivalent to `Just (x)`

```javascript
> S.concat (Nothing) (Nothing)
Nothing

> S.concat (Just ([1, 2, 3])) (Just ([4, 5, 6]))
Just ([1, 2, 3, 4, 5, 6])

> S.concat (Nothing) (Just ([1, 2, 3]))
Just ([1, 2, 3])

> S.concat (Just ([1, 2, 3])) (Nothing)
Just ([1, 2, 3])
```

#### <a name="Maybe.prototype.fantasy-land/filter" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L351">`Maybe#fantasy-land/filter :: Maybe a ~> (a -⁠> Boolean) -⁠> Maybe a`</a>

  - `filter (p) (Nothing)` is equivalent to `Nothing`
  - `filter (p) (Just (x))` is equivalent to `p (x) ? Just (x) : Nothing`

```javascript
> S.filter (isFinite) (Nothing)
Nothing

> S.filter (isFinite) (Just (Infinity))
Nothing

> S.filter (isFinite) (Just (Number.MAX_SAFE_INTEGER))
Just (9007199254740991)
```

#### <a name="Maybe.prototype.fantasy-land/map" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L373">`Maybe#fantasy-land/map :: Maybe a ~> (a -⁠> b) -⁠> Maybe b`</a>

  - `map (f) (Nothing)` is equivalent to `Nothing`
  - `map (f) (Just (x))` is equivalent to `Just (f (x))`

```javascript
> S.map (Math.sqrt) (Nothing)
Nothing

> S.map (Math.sqrt) (Just (9))
Just (3)
```

#### <a name="Maybe.prototype.fantasy-land/ap" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L392">`Maybe#fantasy-land/ap :: Maybe a ~> Maybe (a -⁠> b) -⁠> Maybe b`</a>

  - `ap (Nothing) (Nothing)` is equivalent to `Nothing`
  - `ap (Nothing) (Just (x))` is equivalent to `Nothing`
  - `ap (Just (f)) (Nothing)` is equivalent to `Nothing`
  - `ap (Just (f)) (Just (x))` is equivalent to `Just (f (x))`

```javascript
> S.ap (Nothing) (Nothing)
Nothing

> S.ap (Nothing) (Just (9))
Nothing

> S.ap (Just (Math.sqrt)) (Nothing)
Nothing

> S.ap (Just (Math.sqrt)) (Just (9))
Just (3)
```

#### <a name="Maybe.prototype.fantasy-land/chain" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L419">`Maybe#fantasy-land/chain :: Maybe a ~> (a -⁠> Maybe b) -⁠> Maybe b`</a>

  - `chain (f) (Nothing)` is equivalent to `Nothing`
  - `chain (f) (Just (x))` is equivalent to `f (x)`

```javascript
> const head = xs => xs.length === 0 ? Nothing : Just (xs[0])

> S.chain (head) (Nothing)
Nothing

> S.chain (head) (Just ([]))
Nothing

> S.chain (head) (Just (['foo', 'bar', 'baz']))
Just ('foo')
```

#### <a name="Maybe.prototype.fantasy-land/alt" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L443">`Maybe#fantasy-land/alt :: Maybe a ~> Maybe a -⁠> Maybe a`</a>

  - `alt (Nothing) (Nothing)` is equivalent to `Nothing`
  - `alt (Nothing) (Just (x))` is equivalent to `Just (x)`
  - `alt (Just (x)) (Nothing)` is equivalent to `Just (x)`
  - `alt (Just (x)) (Just (y))` is equivalent to `Just (x)`

```javascript
> S.alt (Nothing) (Nothing)
Nothing

> S.alt (Nothing) (Just (1))
Just (1)

> S.alt (Just (2)) (Nothing)
Just (2)

> S.alt (Just (3)) (Just (4))
Just (3)
```

#### <a name="Maybe.prototype.fantasy-land/reduce" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L470">`Maybe#fantasy-land/reduce :: Maybe a ~> ((b, a) -⁠> b, b) -⁠> b`</a>

  - `reduce (f) (x) (Nothing)` is equivalent to `x`
  - `reduce (f) (x) (Just (y))` is equivalent to `f (x) (y)`

```javascript
> S.reduce (S.concat) ('abc') (Nothing)
'abc'

> S.reduce (S.concat) ('abc') (Just ('xyz'))
'abcxyz'
```

#### <a name="Maybe.prototype.fantasy-land/traverse" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L489">`Maybe#fantasy-land/traverse :: Applicative f => Maybe a ~> (TypeRep f, a -⁠> f b) -⁠> f (Maybe b)`</a>

  - `traverse (A) (f) (Nothing)` is equivalent to `of (A) (Nothing)`
  - `traverse (A) (f) (Just (x))` is equivalent to `map (Just) (f (x))`

```javascript
> S.traverse (Array) (S.words) (Nothing)
[Nothing]

> S.traverse (Array) (S.words) (Just ('foo bar baz'))
[Just ('foo'), Just ('bar'), Just ('baz')]
```

#### <a name="Maybe.prototype.fantasy-land/extend" href="https://github.com/sanctuary-js/sanctuary-maybe/blob/v1.2.0/index.js#L508">`Maybe#fantasy-land/extend :: Maybe a ~> (Maybe a -⁠> b) -⁠> Maybe b`</a>

  - `extend (f) (Nothing)` is equivalent to `Nothing`
  - `extend (f) (Just (x))` is equivalent to `Just (f (Just (x)))`

```javascript
> S.extend (S.reduce (S.add) (1)) (Nothing)
Nothing

> S.extend (S.reduce (S.add) (1)) (Just (99))
Just (100)
```

[Fantasy Land]:             https://github.com/fantasyland/fantasy-land/tree/v4.0.1
[`Z.equals`]:               https://github.com/sanctuary-js/sanctuary-type-classes/tree/v11.0.0#equals
[`Z.lte`]:                  https://github.com/sanctuary-js/sanctuary-type-classes/tree/v11.0.0#lte
[iff]:                      https://en.wikipedia.org/wiki/If_and_only_if
[type identifier]:          https://github.com/sanctuary-js/sanctuary-type-identifiers/tree/v2.0.1
[type representative]:      https://github.com/fantasyland/fantasy-land/tree/v4.0.1#type-representatives
