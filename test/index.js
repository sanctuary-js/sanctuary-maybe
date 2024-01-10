import {deepStrictEqual as eq} from 'node:assert';

import laws from 'fantasy-laws';
import jsc from 'jsverify';
import test from 'oletus';
import Either from 'sanctuary-either';
import Identity from 'sanctuary-identity';
import show from 'sanctuary-show';
import Z from 'sanctuary-type-classes';
import type from 'sanctuary-type-identifiers';
import Useless from 'sanctuary-useless';

import Maybe from '../index.js';


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

//    testLaws :: String -> Object -> Object -> Undefined
const testLaws = typeClass => laws => arbs => {
  (Object.keys (laws)).forEach (name => {
    eq (laws[name].length, arbs[name].length);
    const prettyName = name.replace (/[A-Z]/g, c => ' ' + c.toLowerCase ());
    test (`${typeClass} laws \x1B[2m›\x1B[0m ${prettyName}`,
          laws[name] (...arbs[name]));
  });
};


test ('metadata', () => {
  eq (typeof Nothing, 'object');
  eq (typeof Just, 'function');
  eq (Just.length, 1);
});

test ('tags', () => {
  const just = Just (0);
  eq (Nothing.isNothing, true);
  eq (Nothing.isJust, false);
  eq (just.isNothing, false);
  eq (just.isJust, true);
});

test ('@@type', () => {
  eq (type (Nothing), 'sanctuary-maybe/Maybe@1');
  eq (type (Just (0)), 'sanctuary-maybe/Maybe@1');
  eq (type.parse (type (Just (0))),
      {namespace: 'sanctuary-maybe', name: 'Maybe', version: 1});
});

test ('@@show', () => {
  eq (show (Nothing), 'Nothing');
  eq (show (Just (['foo', 'bar', 'baz'])), 'Just (["foo", "bar", "baz"])');
  eq (show (Just (Just (Just (-0)))), 'Just (Just (Just (-0)))');
});

test ('Maybe.maybe', () => {
  eq (Maybe.maybe ('Nothing')
                  (a => 'Just (' + show (a) + ')')
                  (Nothing),
      'Nothing');
  eq (Maybe.maybe ('Nothing')
                  (a => 'Just (' + show (a) + ')')
                  (Just ([1, 2, 3])),
      'Just ([1, 2, 3])');
});

test ('Setoid', () => {
  eq (Z.Setoid.test (Nothing), true);
  eq (Z.Setoid.test (Just (Useless)), false);
  eq (Z.Setoid.test (Just (/(?:)/)), true);
});

test ('Ord', () => {
  eq (Z.Ord.test (Nothing), true);
  eq (Z.Ord.test (Just (Useless)), false);
  eq (Z.Ord.test (Just (/(?:)/)), false);
  eq (Z.Ord.test (Just (0)), true);
});

test ('Semigroupoid', () => {
  eq (Z.Semigroupoid.test (Nothing), false);
  eq (Z.Semigroupoid.test (Just ([])), false);
});

test ('Category', () => {
  eq (Z.Category.test (Nothing), false);
  eq (Z.Category.test (Just ([])), false);
});

test ('Semigroup', () => {
  eq (Z.Semigroup.test (Nothing), true);
  eq (Z.Semigroup.test (Just (Useless)), false);
  eq (Z.Semigroup.test (Just (0)), false);
  eq (Z.Semigroup.test (Just ([])), true);
});

test ('Monoid', () => {
  eq (Z.Monoid.test (Nothing), true);
  eq (Z.Monoid.test (Just (Useless)), false);
  eq (Z.Monoid.test (Just (0)), false);
  eq (Z.Monoid.test (Just ([])), true);
});

test ('Group', () => {
  eq (Z.Group.test (Nothing), false);
  eq (Z.Group.test (Just ([])), false);
});

test ('Filterable', () => {
  eq (Z.Filterable.test (Nothing), true);
  eq (Z.Filterable.test (Just (Useless)), true);
});

test ('Functor', () => {
  eq (Z.Functor.test (Nothing), true);
  eq (Z.Functor.test (Just (Useless)), true);
});

test ('Bifunctor', () => {
  eq (Z.Bifunctor.test (Nothing), false);
  eq (Z.Bifunctor.test (Just ([])), false);
});

test ('Profunctor', () => {
  eq (Z.Profunctor.test (Nothing), false);
  eq (Z.Profunctor.test (Just (Math.sqrt)), false);
});

test ('Apply', () => {
  eq (Z.Apply.test (Nothing), true);
  eq (Z.Apply.test (Just (Useless)), true);
});

test ('Applicative', () => {
  eq (Z.Applicative.test (Nothing), true);
  eq (Z.Applicative.test (Just (Useless)), true);
});

test ('Chain', () => {
  eq (Z.Chain.test (Nothing), true);
  eq (Z.Chain.test (Just (Useless)), true);
});

test ('ChainRec', () => {
  eq (Z.ChainRec.test (Nothing), true);
  eq (Z.ChainRec.test (Just (Useless)), true);
});

test ('Monad', () => {
  eq (Z.Monad.test (Nothing), true);
  eq (Z.Monad.test (Just (Useless)), true);
});

test ('Alt', () => {
  eq (Z.Alt.test (Nothing), true);
  eq (Z.Alt.test (Just (Useless)), true);
});

test ('Plus', () => {
  eq (Z.Plus.test (Nothing), true);
  eq (Z.Plus.test (Just (Useless)), true);
});

test ('Alternative', () => {
  eq (Z.Alternative.test (Nothing), true);
  eq (Z.Alternative.test (Just (Useless)), true);
});

test ('Foldable', () => {
  eq (Z.Foldable.test (Nothing), true);
  eq (Z.Foldable.test (Just (Useless)), true);
});

test ('Traversable', () => {
  eq (Z.Traversable.test (Nothing), true);
  eq (Z.Traversable.test (Just (Useless)), true);
});

test ('Extend', () => {
  eq (Z.Extend.test (Nothing), true);
  eq (Z.Extend.test (Just (Useless)), true);
});

test ('Comonad', () => {
  eq (Z.Comonad.test (Nothing), false);
  eq (Z.Comonad.test (Just (Identity (0))), false);
});

test ('Contravariant', () => {
  eq (Z.Contravariant.test (Nothing), false);
  eq (Z.Contravariant.test (Just (Math.sqrt)), false);
});

testLaws ('Setoid') (laws.Setoid) ({
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

testLaws ('Ord') (laws.Ord) ({
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

testLaws ('Semigroup') (laws.Semigroup (Z.equals)) ({
  associativity: [
    MaybeArb (jsc.string),
    MaybeArb (jsc.string),
    MaybeArb (jsc.string),
  ],
});

testLaws ('Monoid') (laws.Monoid (Z.equals, Maybe)) ({
  leftIdentity: [
    MaybeArb (jsc.string),
  ],
  rightIdentity: [
    MaybeArb (jsc.string),
  ],
});

testLaws ('Filterable') (laws.Filterable (Z.equals)) ({
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

testLaws ('Functor') (laws.Functor (Z.equals)) ({
  identity: [
    MaybeArb (jsc.number),
  ],
  composition: [
    MaybeArb (jsc.number),
    jsc.constant (Math.sqrt),
    jsc.constant (Math.abs),
  ],
});

testLaws ('Apply') (laws.Apply (Z.equals)) ({
  composition: [
    MaybeArb (jsc.constant (Math.sqrt)),
    MaybeArb (jsc.constant (Math.abs)),
    MaybeArb (jsc.number),
  ],
});

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

testLaws ('Chain') (laws.Chain (Z.equals)) ({
  associativity: [
    MaybeArb (jsc.array (jsc.asciistring)),
    jsc.constant (head),
    jsc.constant (parseFloat_),
  ],
});

testLaws ('ChainRec') (laws.ChainRec (Z.equals, Maybe)) ({
  equivalence: [
    jsc.constant (x => x >= 1000),
    jsc.constant (x => x <= 1 ? Nothing : Just (x * x)),
    jsc.constant (Just),
    jsc.integer,
  ],
});

testLaws ('Monad') (laws.Monad (Z.equals, Maybe)) ({
  leftIdentity: [
    jsc.constant (head),
    jsc.array (jsc.number),
  ],
  rightIdentity: [
    MaybeArb (jsc.number),
  ],
});

testLaws ('Alt') (laws.Alt (Z.equals)) ({
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

testLaws ('Plus') (laws.Plus (Z.equals, Maybe)) ({
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

testLaws ('Alternative') (laws.Alternative (Z.equals, Maybe)) ({
  distributivity: [
    MaybeArb (jsc.number),
    MaybeArb (jsc.constant (Math.sqrt)),
    MaybeArb (jsc.constant (Math.abs)),
  ],
  annihilation: [
    MaybeArb (jsc.number),
  ],
});

testLaws ('Foldable') (laws.Foldable (Z.equals)) ({
  associativity: [
    jsc.constant ((x, y) => x + y),
    jsc.number,
    MaybeArb (jsc.number),
  ],
});

testLaws ('Traversable') (laws.Traversable (Z.equals)) ({
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

testLaws ('Extend') (laws.Extend (Z.equals)) ({
  associativity: [
    MaybeArb (jsc.integer),
    jsc.constant (maybe => Z.reduce ((x, y) => x + y, 1, maybe)),
    jsc.constant (maybe => Z.reduce ((x, y) => y * y, 1, maybe)),
  ],
});
