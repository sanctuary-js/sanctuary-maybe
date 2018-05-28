'use strict';

const assert        = require ('assert');

const laws          = require ('fantasy-laws');
const jsc           = require ('jsverify');
const Either        = require ('sanctuary-either');
const Identity      = require ('sanctuary-identity');
const show          = require ('sanctuary-show');
const Z             = require ('sanctuary-type-classes');
const type          = require ('sanctuary-type-identifiers');
const Useless       = require ('sanctuary-useless');

const Maybe         = require ('..');


const {Nothing, Just} = Maybe;


//    EitherArb :: Arbitrary a -> Arbitrary b -> Arbitrary (Either a b)
const EitherArb = arbL => arbR =>
  jsc.oneof (arbL.smap (Either.Left, left => left.value, show),
             arbR.smap (Either.Right, right => right.value, show));

//    IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
const IdentityArb = arb => arb.smap (Identity, Z.extract, show);

//    MaybeArb :: Arbitrary a -> Arbitrary (Maybe a)
const MaybeArb = arb =>
  jsc.oneof (jsc.constant (Nothing),
             arb.smap (Just, just => just.value, show));

//    eitherToMaybe :: Either a b -> Maybe b
const eitherToMaybe = e => Z.reduce ((_, x) => Just (x), Nothing, e);

//    head :: Array a -> Maybe a
const head = xs => xs.length === 0 ? Nothing : Just (xs[0]);

//    parseFloat_ :: String -> Maybe Number
const parseFloat_ = s => Z.reject (isNaN, Just (parseFloat (s)));

//    testLaws :: Object -> Object -> Undefined
const testLaws = laws => arbs => {
  (Object.keys (laws)).forEach (name => {
    eq (laws[name].length) (arbs[name].length);
    test (name.replace (/[A-Z]/g, c => ' ' + c.toLowerCase ()),
          laws[name] (...arbs[name]));
  });
};

//    eq :: a -> b -> Undefined !
function eq(actual) {
  assert.strictEqual (arguments.length, eq.length);
  return function eq$1(expected) {
    assert.strictEqual (arguments.length, eq$1.length);
    assert.strictEqual (show (actual), show (expected));
    assert.strictEqual (Z.equals (actual, expected), true);
  };
}


suite ('Maybe', () => {

  test ('metadata', () => {
    eq (typeof Nothing) ('object');
    eq (typeof Just) ('function');
    eq (Just.length) (1);
  });

  test ('tags', () => {
    const just = Just (0);
    eq (Nothing.isNothing) (true);
    eq (Nothing.isJust) (false);
    eq (just.isNothing) (false);
    eq (just.isJust) (true);
  });

  test ('@@type', () => {
    eq (type (Nothing)) ('sanctuary-maybe/Maybe@1');
    eq (type (Just (0))) ('sanctuary-maybe/Maybe@1');
    eq (type.parse (type (Just (0))))
       ({namespace: 'sanctuary-maybe', name: 'Maybe', version: 1});
  });

  test ('@@show', () => {
    eq (show (Nothing)) ('Nothing');
    eq (show (Just (['foo', 'bar', 'baz']))) ('Just (["foo", "bar", "baz"])');
    eq (show (Just (Just (Just (-0))))) ('Just (Just (Just (-0)))');
  });

});

suite ('type-class predicates', () => {

  test ('Setoid', () => {
    eq (Z.Setoid.test (Nothing)) (true);
    eq (Z.Setoid.test (Just (Useless))) (false);
    eq (Z.Setoid.test (Just (/(?:)/))) (true);
  });

  test ('Ord', () => {
    eq (Z.Ord.test (Nothing)) (true);
    eq (Z.Ord.test (Just (Useless))) (false);
    eq (Z.Ord.test (Just (/(?:)/))) (false);
    eq (Z.Ord.test (Just (0))) (true);
  });

  test ('Semigroupoid', () => {
    eq (Z.Semigroupoid.test (Nothing)) (false);
    eq (Z.Semigroupoid.test (Just ([]))) (false);
  });

  test ('Category', () => {
    eq (Z.Category.test (Nothing)) (false);
    eq (Z.Category.test (Just ([]))) (false);
  });

  test ('Semigroup', () => {
    eq (Z.Semigroup.test (Nothing)) (true);
    eq (Z.Semigroup.test (Just (Useless))) (false);
    eq (Z.Semigroup.test (Just (0))) (false);
    eq (Z.Semigroup.test (Just ([]))) (true);
  });

  test ('Monoid', () => {
    eq (Z.Monoid.test (Nothing)) (true);
    eq (Z.Monoid.test (Just (Useless))) (false);
    eq (Z.Monoid.test (Just (0))) (false);
    eq (Z.Monoid.test (Just ([]))) (true);
  });

  test ('Group', () => {
    eq (Z.Group.test (Nothing)) (false);
    eq (Z.Group.test (Just ([]))) (false);
  });

  test ('Filterable', () => {
    eq (Z.Filterable.test (Nothing)) (true);
    eq (Z.Filterable.test (Just (Useless))) (true);
  });

  test ('Functor', () => {
    eq (Z.Functor.test (Nothing)) (true);
    eq (Z.Functor.test (Just (Useless))) (true);
  });

  test ('Bifunctor', () => {
    eq (Z.Bifunctor.test (Nothing)) (false);
    eq (Z.Bifunctor.test (Just ([]))) (false);
  });

  test ('Profunctor', () => {
    eq (Z.Profunctor.test (Nothing)) (false);
    eq (Z.Profunctor.test (Just (Math.sqrt))) (false);
  });

  test ('Apply', () => {
    eq (Z.Apply.test (Nothing)) (true);
    eq (Z.Apply.test (Just (Useless))) (true);
  });

  test ('Applicative', () => {
    eq (Z.Applicative.test (Nothing)) (true);
    eq (Z.Applicative.test (Just (Useless))) (true);
  });

  test ('Chain', () => {
    eq (Z.Chain.test (Nothing)) (true);
    eq (Z.Chain.test (Just (Useless))) (true);
  });

  test ('ChainRec', () => {
    eq (Z.ChainRec.test (Nothing)) (true);
    eq (Z.ChainRec.test (Just (Useless))) (true);
  });

  test ('Monad', () => {
    eq (Z.Monad.test (Nothing)) (true);
    eq (Z.Monad.test (Just (Useless))) (true);
  });

  test ('Alt', () => {
    eq (Z.Alt.test (Nothing)) (true);
    eq (Z.Alt.test (Just (Useless))) (true);
  });

  test ('Plus', () => {
    eq (Z.Plus.test (Nothing)) (true);
    eq (Z.Plus.test (Just (Useless))) (true);
  });

  test ('Alternative', () => {
    eq (Z.Alternative.test (Nothing)) (true);
    eq (Z.Alternative.test (Just (Useless))) (true);
  });

  test ('Foldable', () => {
    eq (Z.Foldable.test (Nothing)) (true);
    eq (Z.Foldable.test (Just (Useless))) (true);
  });

  test ('Traversable', () => {
    eq (Z.Traversable.test (Nothing)) (true);
    eq (Z.Traversable.test (Just (Useless))) (true);
  });

  test ('Extend', () => {
    eq (Z.Extend.test (Nothing)) (true);
    eq (Z.Extend.test (Just (Useless))) (true);
  });

  test ('Comonad', () => {
    eq (Z.Comonad.test (Nothing)) (false);
    eq (Z.Comonad.test (Just (Identity (0)))) (false);
  });

  test ('Contravariant', () => {
    eq (Z.Contravariant.test (Nothing)) (false);
    eq (Z.Contravariant.test (Just (Math.sqrt))) (false);
  });

});

suite ('Setoid laws', () => {
  testLaws (laws.Setoid) ({
    reflexivity: [
      MaybeArb (jsc.falsy),
    ],
    symmetry: [
      MaybeArb (jsc.bool),
      MaybeArb (jsc.bool),
    ],
    transitivity: [
      MaybeArb (jsc.bool),
      MaybeArb (jsc.bool),
      MaybeArb (jsc.bool),
    ],
  });
});

suite ('Ord laws', () => {
  testLaws (laws.Ord) ({
    totality: [
      MaybeArb (jsc.string),
      MaybeArb (jsc.string),
    ],
    antisymmetry: [
      MaybeArb (jsc.string),
      MaybeArb (jsc.string),
    ],
    transitivity: [
      MaybeArb (jsc.string),
      MaybeArb (jsc.string),
      MaybeArb (jsc.string),
    ],
  });
});

suite ('Semigroup laws', () => {
  testLaws (laws.Semigroup (Z.equals)) ({
    associativity: [
      MaybeArb (jsc.string),
      MaybeArb (jsc.string),
      MaybeArb (jsc.string),
    ],
  });
});

suite ('Monoid laws', () => {
  testLaws (laws.Monoid (Z.equals, Maybe)) ({
    leftIdentity: [
      MaybeArb (jsc.string),
    ],
    rightIdentity: [
      MaybeArb (jsc.string),
    ],
  });
});

suite ('Filterable laws', () => {
  testLaws (laws.Filterable (Z.equals)) ({
    distributivity: [
      MaybeArb (jsc.number),
      jsc.constant (x => x > -10),
      jsc.constant (x => x < 10),
    ],
    identity: [
      MaybeArb (jsc.number),
    ],
    annihilation: [
      MaybeArb (jsc.number),
      MaybeArb (jsc.number),
    ],
  });
});

suite ('Functor laws', () => {
  testLaws (laws.Functor (Z.equals)) ({
    identity: [
      MaybeArb (jsc.number),
    ],
    composition: [
      MaybeArb (jsc.number),
      jsc.constant (Math.sqrt),
      jsc.constant (Math.abs),
    ],
  });
});

suite ('Apply laws', () => {
  testLaws (laws.Apply (Z.equals)) ({
    composition: [
      MaybeArb (jsc.constant (Math.sqrt)),
      MaybeArb (jsc.constant (Math.abs)),
      MaybeArb (jsc.number),
    ],
  });
});

suite ('Applicative laws', () => {
  testLaws (laws.Applicative (Z.equals, Maybe)) ({
    identity: [
      MaybeArb (jsc.number),
    ],
    homomorphism: [
      jsc.constant (Math.abs),
      jsc.number,
    ],
    interchange: [
      MaybeArb (jsc.constant (Math.abs)),
      jsc.number,
    ],
  });
});

suite ('Chain laws', () => {
  testLaws (laws.Chain (Z.equals)) ({
    associativity: [
      MaybeArb (jsc.array (jsc.asciistring)),
      jsc.constant (head),
      jsc.constant (parseFloat_),
    ],
  });
});

suite ('ChainRec laws', () => {
  testLaws (laws.ChainRec (Z.equals, Maybe)) ({
    equivalence: [
      jsc.constant (x => x >= 1000),
      jsc.constant (x => x <= 1 ? Nothing : Just (x * x)),
      jsc.constant (Just),
      jsc.integer,
    ],
  });
});

suite ('Monad laws', () => {
  testLaws (laws.Monad (Z.equals, Maybe)) ({
    leftIdentity: [
      jsc.constant (head),
      jsc.array (jsc.number),
    ],
    rightIdentity: [
      MaybeArb (jsc.number),
    ],
  });
});

suite ('Alt laws', () => {
  testLaws (laws.Alt (Z.equals)) ({
    associativity: [
      MaybeArb (jsc.number),
      MaybeArb (jsc.number),
      MaybeArb (jsc.number),
    ],
    distributivity: [
      MaybeArb (jsc.number),
      MaybeArb (jsc.number),
      jsc.constant (Math.sqrt),
    ],
  });
});

suite ('Plus laws', () => {
  testLaws (laws.Plus (Z.equals, Maybe)) ({
    leftIdentity: [
      MaybeArb (jsc.number),
    ],
    rightIdentity: [
      MaybeArb (jsc.number),
    ],
    annihilation: [
      jsc.constant (Math.sqrt),
    ],
  });
});

suite ('Alternative laws', () => {
  testLaws (laws.Alternative (Z.equals, Maybe)) ({
    distributivity: [
      MaybeArb (jsc.number),
      MaybeArb (jsc.constant (Math.sqrt)),
      MaybeArb (jsc.constant (Math.abs)),
    ],
    annihilation: [
      MaybeArb (jsc.number),
    ],
  });
});

suite ('Foldable laws', () => {
  testLaws (laws.Foldable (Z.equals)) ({
    associativity: [
      jsc.constant ((x, y) => x + y),
      jsc.number,
      MaybeArb (jsc.number),
    ],
  });
});

suite ('Traversable laws', () => {
  testLaws (laws.Traversable (Z.equals)) ({
    naturality: [
      jsc.constant (Either),
      jsc.constant (Maybe),
      jsc.constant (eitherToMaybe),
      MaybeArb (EitherArb (jsc.string) (jsc.number)),
    ],
    identity: [
      jsc.constant (Identity),
      MaybeArb (jsc.number),
    ],
    composition: [
      jsc.constant (Identity),
      jsc.constant (Maybe),
      MaybeArb (IdentityArb (MaybeArb (jsc.number))),
    ],
  });
});

suite ('Extend laws', () => {
  testLaws (laws.Extend (Z.equals)) ({
    associativity: [
      MaybeArb (jsc.integer),
      jsc.constant (maybe => Z.reduce ((x, y) => x + y, 1, maybe)),
      jsc.constant (maybe => Z.reduce ((x, y) => y * y, 1, maybe)),
    ],
  });
});
