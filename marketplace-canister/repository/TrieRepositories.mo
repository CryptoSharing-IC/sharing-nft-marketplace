
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Order "mo:base/Order";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import TrieMap "mo:base/TrieMap";

import PageHelper "../base/PageHelper";
import Types "../base/Types";
import Utils "../base/Utils";

/// 通用的操纵数据集的模块，包括插入/更新，查询，删除，分页等功能
module {
    
    public type Page<X> = PageHelper.Page<X>;

    public type TrieDB<K, V> = Trie.Trie<K, V>;
    public type TrieDBKey<K> = Trie.Key<K>;
    

    public class TrieRepository<K, V>() {
        
        /// 根据id查询，如果对应的id存在，返回?V，否则返回null
        public func get(db: TrieDB<K, V>, kk: TrieDBKey<K>, k_eq : (K, K) -> Bool) : ?V {
            Trie.find<K, V>(db, kk, k_eq)        
        };

        /// 根据过滤条件查询，返回符合条件的数据集
        public func findBy(db: TrieDB<K, V>, f: (K, V) -> Bool): TrieDB<K, V> {
            let entities = Trie.filter<K, V>(db, f);
            entities
        };

        /// 根据过滤条件统计数量，返回满足条件的记录数，否则返回0
        public func countSize(db: TrieDB<K, V>) : Nat {       
            Trie.size<K, V>(db)
        };

        /// 根据过滤条件统计数量，返回满足条件的记录数，否则返回0
        public func countBy(db: TrieDB<K, V>, f: (K, V) -> Bool) : Nat {       
            countSize(findBy(db, f))
        };

        /// 通过指定的id和数据，更新数据集，返回更新后的数据集和旧数据（如果对应的id不存在，旧数据返回null）
        public func update(db: TrieDB<K, V>, v: V, kk: TrieDBKey<K>, k_eq : (K, K) -> Bool) : (TrieDB<K, V>, ?V) {
            Trie.put<K, V>(db, kk, k_eq, v);
        };

        /// 从数据集中删除指定的记录，返回删除指定记录的数据集和被删除的记录（如果id对应的记录存在，否则返回null）
        public func delete(db: TrieDB<K, V>, kk: TrieDBKey<K>, k_eq : (K, K) -> Bool) : TrieDB<K, V> {
            let res = Trie.remove<K, V>(db, kk, k_eq);
            res.0
        };

        /// 分页处理封装
        /// Args：
        ///     |db|   需要处理的数据集
        ///     |pageSize|  每页记录数
        ///     |pageNum|   页码，0表示第一页
        ///     |filter|    过滤条件，返回应用filter函数结果true的记录
        ///     |sort|      排序函数
        /// Returns:
        ///     返回封装好的分页数据格式
        public func page(db: TrieDB<K, V>, pageSize: Nat, pageNum: Nat,
            filter: (K, V) -> Bool, sortWith: (V, V) -> Order.Order) : Page<V> {
            let skipCounter = pageNum * pageSize;
            
            let filtered = findBy(db, filter);
            let dataArray = Trie.toArray<K, V, V>(filtered, func (k, v) : V { v });
            
            let sortedData = List.fromArray<V>(Utils.sort(dataArray, sortWith));
            let remainning = List.drop<V>(sortedData, skipCounter);
            let paging = List.take<V>(remainning, pageSize);
            let totalCount = List.size<V>(sortedData);

            {
                data = List.toArray<V>(paging);
                pageSize = pageSize;
                pageNum = pageNum;
                totalCount = totalCount;
            }
        };

        public func vals(db: TrieDB<K, V>) : [(K, V)]  {
            Trie.toArray<K, V, (K, V)>(db, func (k, v) : (K, V) { (k, v) })
        };

    };
    
};