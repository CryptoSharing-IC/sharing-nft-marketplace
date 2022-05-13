import Prim "mo:prim";

import Array "mo:base/Array";
import Char "mo:base/Char";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Order "mo:base/Order";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

module {


    /// Text 转为小写，在用户名之类的场景使用
    /// Convert text to lower case
    public func toLowerCase(name: Text) : Text {
        var str = "";
        for (c in Text.toIter(trim(name))) {
            let ch = if ('A' <= c and c <= 'Z') { Prim.charToLower(c) } else { c };
            str := str # Prim.charToText(ch);
        };
        str
    };
    
    /// Text trim
    public func trim(t: Text) : Text {
        let res = Text.trim(t, #text " ");
        res
    };

    /// 把Text转为Nat,如果Text中包含非0-9的数字,返回null
    public func textToNat(t: Text) : ?Nat {
        var size : Nat = t.size();
        if (size == 0 or size > 20) return null;

        let chars = Text.toIter(t);

        let nats = Iter.map<Char, Nat>(chars, func (c) : Nat { Nat32.toNat(Char.toNat32(c))});
        
        var num = 0;
        for (n in nats) {
            if (n < 48 or n > 57) return null;
            let v: Nat = n - 48;
            size -= 1;
            num += Nat.pow(10, size) * v;
        };
        ?num
    };

    public func getOrEmptyText(str: ?Text) : Text {
        Option.get(str, "")
    };

    /// 是否包含@
    public func countAt(email: Text) : Nat {
        Iter.size(Text.split(email, #text "@"))
    };

    /// 有且只有一个@
    public func onlyOneAt(text: Text) : Bool {
        countAt(text) == 1
    };

    /// 是否包含数字或字母
    public func isAlpharNumber(c: Char): Bool {
       Char.isDigit(c) or Char.isAlphabetic(c)
    };

    /// 是否包含数字或字母空格
    public func isAlpharNumberWhitespace(c: Char): Bool {
       Char.isDigit(c) or Char.isAlphabetic(c) or Char.isWhitespace(c)
    };

    /// 是否包含下划线(_)
    public func isUnderLine(c: Char): Bool {
        c == '_'
    };

    // 是否是数字,字母或下划线
    public func isAlpharNumberUnderLine(c: Char): Bool {
        isAlpharNumber(c) or isUnderLine(c)
    };

    /// 是否全部是数字或字母,
    public func isAllAlpharAndNumber(t: Text) : Bool {
        for (c in Text.toIter(t)) {
            if (not(isAlpharNumber(c))) { return false; };
        };
        return true;
    };

    /// 是否全部是数字或字母或空格,
    public func isAllAlpharAndNumberAndWhitespace(t: Text) : Bool {
        for (c in Text.toIter(t)) {
            if (not(isAlpharNumberWhitespace(c))) { return false; };
        };
        return true;
    };
   
    /// 文本是否小于20个字符
    public func lessOrEqTwentyChar(text: Text): Bool {
        lessOrEqCharNumber(text, 20)
    };

    // 文本是否小于指定长度
    public func lessOrEqCharNumber(text: Text, num: Nat): Bool {
        Text.size(text) <= num
    };

    /// 是否包含空格
    public func containsSpace(text: Text): Bool {
        Text.contains(text, #char ' ')
    };

    /// Text 是否包含指定字符串
    public func containsStr(text: Text, str: Text): Bool {
        Text.contains(text, #text str)
    };

    /// 是否以字母结束
    public func endsWithAlpha(text: Text): Bool {
        let str : [Char] = Iter.toArray(Text.toIter(text));
        Char.isAlphabetic(str[Text.size(text) - 1])
    };

    /// 是否为空字符串
    public func isSpaceText(t: Text): Bool {
        trim(t).size() == 0
    };

    /// Int转Nat,小于0的话结果为0
    public func intToNatElseZero(int: Int): Nat {
        if (int > 0) Nat64.toNat(Int64.toNat64(Int64.fromInt(int)))
        else 0
    };

    public func containsKey<K, V>(cache: HashMap.HashMap<K, V>, key: K) : Bool {
        Option.isSome(cache.get(key))
    };

    /// 获取数组的元素数量
    public func arraySize<A>(xs: [A]) : Nat {
        Iter.size<A>(Iter.fromArray<A>(xs))
    };

    /// 判断右边参数的元素是否全部存在于左边的参数中
    public func arrayContainsAll<A>(left: [A], right: [A], eq: (A, A) -> Bool) : Bool {
        func equal_(l: A) : A -> Bool {
            func eq_(r: A) : Bool {
                eq(l, r)
            };   
            eq_   
        };

        for (r in right.vals()) {
            switch (Array.find<A>(left, equal_(r))) {
                case (?_) { };
                case (null) { return false; };
            }
        };

        return true;
    };

    /// Sorts the given array according to the `cmp` function.
    /// This is a _stable_ sort.
    ///
    /// ```motoko
    /// import Array "mo:base/Array";
    /// import Nat "mo:base/Nat";
    /// let xs = [4, 2, 6, 1, 5];
    /// assert(Array.sort(xs, Nat.compare) == [1, 2, 4, 5, 6])
    /// ```
    public func sort<A>(xs : [A], cmp : (A, A) -> Order.Order) : [A] {
        let tmp : [var A] = Array.thaw(xs);
        sortInPlace(tmp, cmp);
        Array.freeze(tmp)
    };

    /// Sorts the given array in place according to the `cmp` function.
    /// This is a _stable_ sort.
    ///
    /// ```motoko
    /// import Array "mo:base/Array";
    /// import Nat "mo:base/Nat";
    /// let xs : [var Nat] = [4, 2, 6, 1, 5];
    /// xs.sortInPlace(Nat.compare);
    /// assert(Array.freeze(xs) == [1, 2, 4, 5, 6])
    /// ```
    public func sortInPlace<A>(xs : [var A], cmp : (A, A) -> Order.Order) {
        if (xs.size() < 2) return;
        let aux : [var A] = Array.tabulateVar<A>(xs.size(), func i { xs[i] });

        func merge(lo : Nat, mid : Nat, hi : Nat) {
            var i = lo;
            var j = mid + 1;
            var k = lo;

            while(k <= hi) {
                aux[k] := xs[k];
                k += 1;
            };
            k := lo;
            while(k <= hi) {
                if (i > mid) {
                    xs[k] := aux[j];
                    j += 1;
                    } else if (j > hi) {
                    xs[k] := aux[i];
                    i += 1;
                } else if (Order.isLess(cmp(aux[j], aux[i]))) {
                    xs[k] := aux[j];
                    j += 1;
                    } else {
                    xs[k] := aux[i];
                    i += 1;
                };
                k += 1;
            };
        };

        func go(lo : Nat, hi : Nat) {
            if (hi <= lo) return;

            let mid : Nat = lo + (hi - lo) / 2;
            go(lo, mid);
            go(mid + 1, hi);
            merge(lo, mid, hi);
        };
    
        go(0, xs.size() - 1);
    };

    /// Returns an `Iter` over the key-value entries of the trie.
    ///
    /// Each iterator gets a _persistent view_ of the mapping, independent of concurrent updates to the iterated map.
    public func iter<K, V>(t : Trie.Trie<K, V>) : Iter.Iter<(K, V)> {
        object {
            var stack = ?(t, null) : List.List<Trie.Trie<K, V>>;
            public func next() : ?(K, V) {
                switch stack {
                    case null { null };
                    case (?(trie, stack2)) {
                        switch trie {
                            case (#empty) {
                                stack := stack2;
                                next()
                            };
                            case (#leaf({ keyvals = null })) {
                                stack := stack2;
                                next()
                            };
                            case (#leaf({ size = c; keyvals = ?((k, v), kvs) })) {
                                stack := ?(#leaf({ size = c-1; keyvals = kvs }), stack2);
                                ?(k.key, v)
                            };
                            case (#branch(br)) {
                                stack := ?(br.left, ?(br.right, stack2));
                                next()
                            };
                        }
                    };
                }
            }
        }
    };


}