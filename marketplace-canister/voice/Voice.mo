import Blob "mo:base/Blob";
import DB "mo:base/Deque";
import Hash "mo:base/Hash";
import Id "mo:base/Array";
import Iter "mo:base/Iter";
import N64 "mo:base/Array";
import Nat64 "mo:base/Nat64";
import Prelude "mo:base/Prelude";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

module {
    public type State = {#unpaid; #paided};
    public type Id = Nat64;
    let idEq = Nat64.equal;
    public type Voice = {
        id: Id;
        listingId: Id;
        accountIdentifier: Blob;
        amount: Nat64;
        state: State;
    };
    
    public func key(t: Nat64) : Trie.Key<Nat64> { { key = t; hash = Hash.hash(Nat64.toNat(t))} };

    public type DB = Trie.Trie<Id, Voice>;
    public type StableDB = [(Id, Voice)];
    public func stableDbInitValue(): StableDB {
        [];
    };

    
    public class Store() {
        let db : DB =  Trie.empty();

        public func preUpgrade(): StableDB{
            Iter.toArray(Trie.iter<Id, Voice>(db));
        };

        public func postUpgrade(stableDb: StableDB) {
            for((_, voice) in stableDb.vals()) {
                ignore update(voice);
            };
        };

        public func delete(id: Id): ?Voice{
            Trie.remove(db, key(id), idEq).1;
        };
        public func findById(id: Id): ?Voice {
            Trie.get(db, key(id), idEq);
        };
        public func update(voice: Voice): Voice {
            switch(Trie.put(db, key(voice.id), idEq, voice).1) {
                case(null) {
                    Prelude.unreachable();
                };
                case(?voice) {
                    voice;
                };
            }
        };

        public func add(voice : Voice) : ?Voice {
            Trie.put(db, key(voice.id), idEq, voice).1;
        };   
    }
}