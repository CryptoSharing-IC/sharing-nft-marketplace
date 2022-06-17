
import Hash "mo:base/Hash";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Order "mo:base/Order";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

import PageHelper "../base/PageHelper";
import TrieRepositories "../repository/TrieRepositories";
import LendDomain "LendDomain";
import Types "../base/Types";
import Utils "../base/Utils";

module {

    public type UserPrincipal = Types.UserPrincipal;

    public type LendId = LendDomain.LendId;
    public type LendProfile = LendDomain.LendProfile;

    public type DB<K, V> = TrieRepositories.TrieDB<K, V>;
    
    public type LendPage = PageHelper.Page<LendProfile>;
    public type LendDB = DB<LendId, LendProfile>;
    public type LendRepository = TrieRepositories.TrieRepository<LendId, LendProfile>;
    public type LendDBKey = TrieRepositories.TrieDBKey<LendId>;

    /// 辅助方法，Tag的Trie.Key实例
    public func lendDBKey(key: LendId): LendDBKey {
        { key = key; hash = Hash.hash(Nat64.toNat(key)) }
    };

    let lendEq = LendDomain.lendEq;

    public func newLendDB() : LendDB {
        Trie.empty<LendId, LendProfile>()
    };

    public func newLendRepository() : LendRepository{
        TrieRepositories.TrieRepository<LendId, LendProfile>()
    };

    /// 删除指定的 Lend 
    /// Args:
    ///     |lendDB|     Lend 数据源
    ///     |keyOfLend| 被删除的 Lend 主键
    /// Returns:
    ///     删除指定 Lend 的 Lend 数据源与删除的 Lend 数据组成的元组,如果指定的 Lend 不存在数据源中存,该值为null
    public func deleteLend(db: LendDB, repository: LendRepository, lendId: LendId) : LendDB {
        repository.delete(db, lendDBKey(lendId), lendEq)
    };

    /// 获取的指定 Lend 的信息
    public func getLend(db: LendDB, repository: LendRepository, id: LendId) : ?LendProfile {
        repository.get(db, lendDBKey(id), lendEq)
    };

    public func pageLend(db: LendDB, repository: LendRepository, pageSize: Nat, pageNum: Nat,
        filter: (LendId, LendProfile) -> Bool, sortWith: (LendProfile, LendProfile) -> Order.Order) : LendPage {
        repository.page(db, pageSize, pageNum, filter, sortWith)
    };

    /// 更新指定 Lend 的信息
    public func updateLend(db: LendDB, repository: LendRepository, lendProfile: LendProfile): (LendDB, ?LendProfile) {
        repository.update(db, lendProfile, lendDBKey(lendProfile.id), lendEq)
    };

    /// 保存指定 Lend 的信息
    public func saveLend(db: LendDB, repository: LendRepository, lendProfile: LendProfile): LendDB {
        updateLend(db, repository, lendProfile).0
    };

    /// 总 Lend 数
    public func countLendTotal(db : LendDB, repository: LendRepository) :  Nat {
        repository.countSize(db)
    };

    /// 获取所有 Lend 的LendId
    public func allLendIds(lendDB: LendDB) : [LendId] {
        Trie.toArray<LendId, LendProfile, LendId>(lendDB, func (k: LendId, _) : LendId { k })
    };
   
    /// 获取同一个listingid的所有lend对象
    public func getLendByListId(db: LendDB, repository: LendRepository, listId: Nat64) : [LendProfile] {
        
        let lendTrie = repository.findBy(db, func (K: LendId, v: LendProfile): Bool {
            v.listingId == listId
        });
        return Trie.toArray<LendId,LendProfile, LendProfile>(lendTrie, func (k: LendId, v: LendProfile) {v});
    };
    
    public func some(db: LendDB, repository: LendRepository, f: (k: LendId, v: LendProfile) -> Bool) : Bool{
        repository.some(db, f);
    };

}