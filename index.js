/*
    ,______  ______,  ,________,,_____,,_____,,__________  ,__________,
    |      \/      |  |        ||     ||     ||          \ |          |
    |_,          ,_|  |_      _||_    ||    _||_,   __    ||_,   _____|
      |   \  /   |     /      \   \   \/   /    |        /   |      |
    ,_|    ||    |_,,_/   /\   \_, \      /   ,_|   __   \ ,_|   ___|_,
    |      ||      ||     ||     |  |    |    |           ||          |
    |______||______||_____||_____|  |____|    |__________/ |__________|
                                                                         */

//. <a href="https://github.com/fantasyland/fantasy-land"><img alt="Fantasy Land" src="https://raw.githubusercontent.com/fantasyland/fantasy-land/master/logo.png" width="75" height="75" align="left"></a>
//.
//. # sanctuary-maybe
//.
//. The Maybe type represents optional values: a value of type `Maybe a` is
//. either Nothing (the empty value) or a Just whose value is of type `a`.

(function(f) {

  'use strict';

  var util = {inspect: {}};

  /* istanbul ignore else */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f (require ('util'),
                        require ('sanctuary-show'),
                        require ('sanctuary-type-classes'));
  } else if (typeof define === 'function' && define.amd != null) {
    define (['sanctuary-show', 'sanctuary-type-classes'], function(show, Z) {
      return f (util, show, Z);
    });
  } else {
    self.sanctuaryMaybe = f (util,
                             self.sanctuaryShow,
                             self.sanctuaryTypeClasses);
  }

} (function(util, show, Z) {

  'use strict';

  /* istanbul ignore if */
  if (typeof __doctest !== 'undefined') {
    var $ = __doctest.require ('sanctuary-def');
    var type = __doctest.require ('sanctuary-type-identifiers');
    var S = (function() {
      var S = __doctest.require ('sanctuary');
      var MaybeType = $.UnaryType
        ('sanctuary-maybe/Maybe')
        ('')
        (function(x) { return type (x) === Maybe['@@type']; })
        (function(m) { return m.isJust ? [m.value] : []; });
      var env = Z.concat (S.env, [$.TypeClass, MaybeType ($.Unknown)]);
      return S.create ({checkTypes: true, env: env});
    } ());
  }

  var Maybe = {};

  var Nothing$prototype = {
    /* eslint-disable key-spacing */
    'constructor':            Maybe,
    'isNothing':              true,
    'isJust':                 false,
    '@@show':                 Nothing$prototype$show,
    'fantasy-land/equals':    Nothing$prototype$equals,
    'fantasy-land/lte':       Nothing$prototype$lte,
    'fantasy-land/concat':    Nothing$prototype$concat,
    'fantasy-land/filter':    Nothing$prototype$filter,
    'fantasy-land/map':       Nothing$prototype$map,
    'fantasy-land/ap':        Nothing$prototype$ap,
    'fantasy-land/chain':     Nothing$prototype$chain,
    'fantasy-land/alt':       Nothing$prototype$alt,
    'fantasy-land/reduce':    Nothing$prototype$reduce,
    'fantasy-land/traverse':  Nothing$prototype$traverse,
    'fantasy-land/extend':    Nothing$prototype$extend
    /* eslint-enable key-spacing */
  };

  var Just$prototype = {
    /* eslint-disable key-spacing */
    'constructor':            Maybe,
    'isNothing':              false,
    'isJust':                 true,
    '@@show':                 Just$prototype$show,
    'fantasy-land/filter':    Just$prototype$filter,
    'fantasy-land/map':       Just$prototype$map,
    'fantasy-land/ap':        Just$prototype$ap,
    'fantasy-land/chain':     Just$prototype$chain,
    'fantasy-land/alt':       Just$prototype$alt,
    'fantasy-land/reduce':    Just$prototype$reduce,
    'fantasy-land/traverse':  Just$prototype$traverse,
    'fantasy-land/extend':    Just$prototype$extend
    /* eslint-enable key-spacing */
  };

  var custom = util.inspect.custom;
  /* istanbul ignore else */
  if (typeof custom === 'symbol') {
    Nothing$prototype[custom] = Nothing$prototype$show;
    Just$prototype[custom] = Just$prototype$show;
  } else {
    Nothing$prototype.inspect = Nothing$prototype$show;
    Just$prototype.inspect = Just$prototype$show;
  }

  //. `Maybe a` satisfies the following [Fantasy Land][] specifications:
  //.
  //. ```javascript
  //. > const Useless = require ('sanctuary-useless')
  //.
  //. > S.map (k => k + ' '.repeat (16 - k.length) +
  //. .             (Z[k].test (Just (Useless)) ? '\u2705   ' :
  //. .              Z[k].test (Nothing)        ? '\u2705 * ' :
  //. .              /* otherwise */              '\u274C   '))
  //. .       (S.keys (S.unchecked.filter (S.is ($.TypeClass)) (Z)))
  //. [ 'Setoid          ✅ * ',  // if ‘a’ satisfies Setoid
  //. . 'Ord             ✅ * ',  // if ‘a’ satisfies Ord
  //. . 'Semigroupoid    ❌   ',
  //. . 'Category        ❌   ',
  //. . 'Semigroup       ✅ * ',  // if ‘a’ satisfies Semigroup
  //. . 'Monoid          ✅ * ',  // if ‘a’ satisfies Semigroup
  //. . 'Group           ❌   ',
  //. . 'Filterable      ✅   ',
  //. . 'Functor         ✅   ',
  //. . 'Bifunctor       ❌   ',
  //. . 'Profunctor      ❌   ',
  //. . 'Apply           ✅   ',
  //. . 'Applicative     ✅   ',
  //. . 'Chain           ✅   ',
  //. . 'ChainRec        ✅   ',
  //. . 'Monad           ✅   ',
  //. . 'Alt             ✅   ',
  //. . 'Plus            ✅   ',
  //. . 'Alternative     ✅   ',
  //. . 'Foldable        ✅   ',
  //. . 'Traversable     ✅   ',
  //. . 'Extend          ✅   ',
  //. . 'Comonad         ❌   ',
  //. . 'Contravariant   ❌   ' ]
  //. ```

  //# Maybe :: TypeRep Maybe
  //.
  //. Maybe [type representative][].

  //# Maybe.Nothing :: Maybe a
  //.
  //. The empty value of type `Maybe a`.
  //.
  //. ```javascript
  //. > Nothing
  //. Nothing
  //. ```
  var Nothing = Maybe.Nothing = Object.create (Nothing$prototype);

  //# Maybe.Just :: a -> Maybe a
  //.
  //. Constructs a value of type `Maybe a` from a value of type `a`.
  //.
  //. ```javascript
  //. > Just (42)
  //. Just (42)
  //. ```
  var Just = Maybe.Just = function(value) {
    var just = Object.create (Just$prototype);
    if (Z.Setoid.test (value)) {
      just['fantasy-land/equals'] = Just$prototype$equals;
      if (Z.Ord.test (value)) {
        just['fantasy-land/lte'] = Just$prototype$lte;
      }
    }
    if (Z.Semigroup.test (value)) {
      just['fantasy-land/concat'] = Just$prototype$concat;
    }
    just.value = value;
    return just;
  };

  //# Maybe.@@type :: String
  //.
  //. Maybe [type identifier][].
  //.
  //. ```javascript
  //. > type (Just (42))
  //. 'sanctuary-maybe/Maybe@1'
  //.
  //. > type.parse (type (Just (42)))
  //. {namespace: 'sanctuary-maybe', name: 'Maybe', version: 1}
  //. ```
  Maybe['@@type'] = 'sanctuary-maybe/Maybe@1';

  //# Maybe.fantasy-land/empty :: () -> Maybe a
  //.
  //.   - `empty (Maybe)` is equivalent to `Nothing`
  //.
  //. ```javascript
  //. > S.empty (Maybe)
  //. Nothing
  //. ```
  Maybe['fantasy-land/empty'] = function() { return Nothing; };

  //# Maybe.fantasy-land/of :: a -> Maybe a
  //.
  //.   - `of (Maybe) (x)` is equivalent to `Just (x)`
  //.
  //. ```javascript
  //. > S.of (Maybe) (42)
  //. Just (42)
  //. ```
  Maybe['fantasy-land/of'] = Just;

  function next(x) { return {tag: next, value: x}; }
  function done(x) { return {tag: done, value: x}; }

  //# Maybe.fantasy-land/chainRec :: ((a -> c, b -> c, a) -> Maybe c, a) -> Maybe b
  //.
  //. ```javascript
  //. > Z.chainRec (
  //. .   Maybe,
  //. .   (next, done, x) =>
  //. .     x <= 1 ? Nothing : Just (x >= 1000 ? done (x) : next (x * x)),
  //. .   1
  //. . )
  //. Nothing
  //.
  //. > Z.chainRec (
  //. .   Maybe,
  //. .   (next, done, x) =>
  //. .     x <= 1 ? Nothing : Just (x >= 1000 ? done (x) : next (x * x)),
  //. .   2
  //. . )
  //. Just (65536)
  //. ```
  Maybe['fantasy-land/chainRec'] = function(f, x) {
    var r = next (x);
    while (r.tag === next) {
      var maybe = f (next, done, r.value);
      if (maybe.isNothing) return maybe;
      r = maybe.value;
    }
    return Just (r.value);
  };

  //# Maybe.fantasy-land/zero :: () -> Maybe a
  //.
  //.   - `zero (Maybe)` is equivalent to `Nothing`
  //.
  //. ```javascript
  //. > S.zero (Maybe)
  //. Nothing
  //. ```
  Maybe['fantasy-land/zero'] = function() { return Nothing; };

  //# Maybe#@@show :: Showable a => Maybe a ~> () -> String
  //.
  //.   - `show (Nothing)` is equivalent to `'Nothing'`
  //.   - `show (Just (x))` is equivalent to `'Just (' + show (x) + ')'`
  //.
  //. ```javascript
  //. > show (Nothing)
  //. 'Nothing'
  //.
  //. > show (Just (['foo', 'bar', 'baz']))
  //. 'Just (["foo", "bar", "baz"])'
  //. ```
  function Nothing$prototype$show() {
    return 'Nothing';
  }
  function Just$prototype$show() {
    return 'Just (' + show (this.value) + ')';
  }

  //# Maybe#fantasy-land/equals :: Setoid a => Maybe a ~> Maybe a -> Boolean
  //.
  //.   - `Nothing` is equal to `Nothing`
  //.   - `Just (x)` is equal to `Just (y)` [iff][] `x` is equal to `y`
  //.     according to [`Z.equals`][]
  //.   - `Nothing` is never equal to `Just (x)`
  //.
  //. ```javascript
  //. > S.equals (Nothing) (Nothing)
  //. true
  //.
  //. > S.equals (Just ([1, 2, 3])) (Just ([1, 2, 3]))
  //. true
  //.
  //. > S.equals (Just ([1, 2, 3])) (Just ([3, 2, 1]))
  //. false
  //.
  //. > S.equals (Just ([1, 2, 3])) (Nothing)
  //. false
  //. ```
  function Nothing$prototype$equals(other) {
    return other.isNothing;
  }
  function Just$prototype$equals(other) {
    return other.isJust && Z.equals (this.value, other.value);
  }

  //# Maybe#fantasy-land/lte :: Ord a => Maybe a ~> Maybe a -> Boolean
  //.
  //.   - `Nothing` is (less than or) equal to `Nothing`
  //.   - `Just (x)` is less than or equal to `Just (y)` [iff][] `x` is less
  //.     than or equal to `y` according to [`Z.lte`][]
  //.   - `Nothing` is always less than `Just (x)`
  //.
  //. ```javascript
  //. > S.filter (S.lte (Nothing)) ([Nothing, Just (0), Just (1), Just (2)])
  //. [Nothing]
  //.
  //. > S.filter (S.lte (Just (1))) ([Nothing, Just (0), Just (1), Just (2)])
  //. [Nothing, Just (0), Just (1)]
  //. ```
  function Nothing$prototype$lte(other) {
    return true;
  }
  function Just$prototype$lte(other) {
    return other.isJust && Z.lte (this.value, other.value);
  }

  //# Maybe#fantasy-land/concat :: Semigroup a => Maybe a ~> Maybe a -> Maybe a
  //.
  //.   - `concat (Nothing) (Nothing)` is equivalent to `Nothing`
  //.   - `concat (Just (x)) (Just (y))` is equivalent to
  //.     `Just (concat (x) (y))`
  //.   - `concat (Nothing) (Just (x))` is equivalent to `Just (x)`
  //.   - `concat (Just (x)) (Nothing)` is equivalent to `Just (x)`
  //.
  //. ```javascript
  //. > S.concat (Nothing) (Nothing)
  //. Nothing
  //.
  //. > S.concat (Just ([1, 2, 3])) (Just ([4, 5, 6]))
  //. Just ([1, 2, 3, 4, 5, 6])
  //.
  //. > S.concat (Nothing) (Just ([1, 2, 3]))
  //. Just ([1, 2, 3])
  //.
  //. > S.concat (Just ([1, 2, 3])) (Nothing)
  //. Just ([1, 2, 3])
  //. ```
  function Nothing$prototype$concat(other) {
    return other;
  }
  function Just$prototype$concat(other) {
    return other.isJust ? Just (Z.concat (this.value, other.value)) : this;
  }

  //# Maybe#fantasy-land/filter :: Maybe a ~> (a -> Boolean) -> Maybe a
  //.
  //.   - `filter (p) (Nothing)` is equivalent to `Nothing`
  //.   - `filter (p) (Just (x))` is equivalent to `p (x) ? Just (x) : Nothing`
  //.
  //. ```javascript
  //. > S.filter (isFinite) (Nothing)
  //. Nothing
  //.
  //. > S.filter (isFinite) (Just (Infinity))
  //. Nothing
  //.
  //. > S.filter (isFinite) (Just (Number.MAX_SAFE_INTEGER))
  //. Just (9007199254740991)
  //. ```
  function Nothing$prototype$filter(pred) {
    return this;
  }
  function Just$prototype$filter(pred) {
    return pred (this.value) ? this : Nothing;
  }

  //# Maybe#fantasy-land/map :: Maybe a ~> (a -> b) -> Maybe b
  //.
  //.   - `map (f) (Nothing)` is equivalent to `Nothing`
  //.   - `map (f) (Just (x))` is equivalent to `Just (f (x))`
  //.
  //. ```javascript
  //. > S.map (Math.sqrt) (Nothing)
  //. Nothing
  //.
  //. > S.map (Math.sqrt) (Just (9))
  //. Just (3)
  //. ```
  function Nothing$prototype$map(f) {
    return this;
  }
  function Just$prototype$map(f) {
    return Just (f (this.value));
  }

  //# Maybe#fantasy-land/ap :: Maybe a ~> Maybe (a -> b) -> Maybe b
  //.
  //.   - `ap (Nothing) (Nothing)` is equivalent to `Nothing`
  //.   - `ap (Nothing) (Just (x))` is equivalent to `Nothing`
  //.   - `ap (Just (f)) (Nothing)` is equivalent to `Nothing`
  //.   - `ap (Just (f)) (Just (x))` is equivalent to `Just (f (x))`
  //.
  //. ```javascript
  //. > S.ap (Nothing) (Nothing)
  //. Nothing
  //.
  //. > S.ap (Nothing) (Just (9))
  //. Nothing
  //.
  //. > S.ap (Just (Math.sqrt)) (Nothing)
  //. Nothing
  //.
  //. > S.ap (Just (Math.sqrt)) (Just (9))
  //. Just (3)
  //. ```
  function Nothing$prototype$ap(other) {
    return this;
  }
  function Just$prototype$ap(other) {
    return other.isJust ? Just (other.value (this.value)) : other;
  }

  //# Maybe#fantasy-land/chain :: Maybe a ~> (a -> Maybe b) -> Maybe b
  //.
  //.   - `chain (f) (Nothing)` is equivalent to `Nothing`
  //.   - `chain (f) (Just (x))` is equivalent to `f (x)`
  //.
  //. ```javascript
  //. > const head = xs => xs.length === 0 ? Nothing : Just (xs[0])
  //.
  //. > S.chain (head) (Nothing)
  //. Nothing
  //.
  //. > S.chain (head) (Just ([]))
  //. Nothing
  //.
  //. > S.chain (head) (Just (['foo', 'bar', 'baz']))
  //. Just ('foo')
  //. ```
  function Nothing$prototype$chain(f) {
    return this;
  }
  function Just$prototype$chain(f) {
    return f (this.value);
  }

  //# Maybe#fantasy-land/alt :: Maybe a ~> Maybe a -> Maybe a
  //.
  //.   - `alt (Nothing) (Nothing)` is equivalent to `Nothing`
  //.   - `alt (Nothing) (Just (x))` is equivalent to `Just (x)`
  //.   - `alt (Just (x)) (Nothing)` is equivalent to `Just (x)`
  //.   - `alt (Just (x)) (Just (y))` is equivalent to `Just (x)`
  //.
  //. ```javascript
  //. > S.alt (Nothing) (Nothing)
  //. Nothing
  //.
  //. > S.alt (Nothing) (Just (1))
  //. Just (1)
  //.
  //. > S.alt (Just (2)) (Nothing)
  //. Just (2)
  //.
  //. > S.alt (Just (3)) (Just (4))
  //. Just (3)
  //. ```
  function Nothing$prototype$alt(other) {
    return other;
  }
  function Just$prototype$alt(other) {
    return this;
  }

  //# Maybe#fantasy-land/reduce :: Maybe a ~> ((b, a) -> b, b) -> b
  //.
  //.   - `reduce (f) (x) (Nothing)` is equivalent to `x`
  //.   - `reduce (f) (x) (Just (y))` is equivalent to `f (x) (y)`
  //.
  //. ```javascript
  //. > S.reduce (S.concat) ('abc') (Nothing)
  //. 'abc'
  //.
  //. > S.reduce (S.concat) ('abc') (Just ('xyz'))
  //. 'abcxyz'
  //. ```
  function Nothing$prototype$reduce(f, x) {
    return x;
  }
  function Just$prototype$reduce(f, x) {
    return f (x, this.value);
  }

  //# Maybe#fantasy-land/traverse :: Applicative f => Maybe a ~> (TypeRep f, a -> f b) -> f (Maybe b)
  //.
  //.   - `traverse (A) (f) (Nothing)` is equivalent to `of (A) (Nothing)`
  //.   - `traverse (A) (f) (Just (x))` is equivalent to `map (Just) (f (x))`
  //.
  //. ```javascript
  //. > S.traverse (Array) (S.words) (Nothing)
  //. [Nothing]
  //.
  //. > S.traverse (Array) (S.words) (Just ('foo bar baz'))
  //. [Just ('foo'), Just ('bar'), Just ('baz')]
  //. ```
  function Nothing$prototype$traverse(typeRep, f) {
    return Z.of (typeRep, this);
  }
  function Just$prototype$traverse(typeRep, f) {
    return Z.map (Just, f (this.value));
  }

  //# Maybe#fantasy-land/extend :: Maybe a ~> (Maybe a -> b) -> Maybe b
  //.
  //.   - `extend (f) (Nothing)` is equivalent to `Nothing`
  //.   - `extend (f) (Just (x))` is equivalent to `Just (f (Just (x)))`
  //.
  //. ```javascript
  //. > S.extend (S.reduce (S.add) (1)) (Nothing)
  //. Nothing
  //.
  //. > S.extend (S.reduce (S.add) (1)) (Just (99))
  //. Just (100)
  //. ```
  function Nothing$prototype$extend(f) {
    return this;
  }
  function Just$prototype$extend(f) {
    return Just (f (this));
  }

  return Maybe;

}));

//. [Fantasy Land]:             v:fantasyland/fantasy-land
//. [`Z.equals`]:               v:sanctuary-js/sanctuary-type-classes#equals
//. [`Z.lte`]:                  v:sanctuary-js/sanctuary-type-classes#lte
//. [iff]:                      https://en.wikipedia.org/wiki/If_and_only_if
//. [type identifier]:          v:sanctuary-js/sanctuary-type-identifiers
//. [type representative]:      v:fantasyland/fantasy-land#type-representatives
