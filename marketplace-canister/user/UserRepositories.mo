
import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Order "mo:base/Order";
import Text "mo:base/Text";
import Trie "mo:base/Trie";

import PageHelper "../base/PageHelper";
import TrieRepositories "../repository/TrieRepositories";
import UserDomain "UserDomain";
import Utils "../base/Utils";

module {

    public type UserPrincipal = UserDomain.UserPrincipal;
    public type UserProfile = UserDomain.UserProfile;

    public type DB<K, V> = TrieRepositories.TrieDB<K, V>;
    
    public type UserPage = PageHelper.Page<UserProfile>;
    public type UserDB = DB<UserPrincipal, UserProfile>;
    public type UserRepository = TrieRepositories.TrieRepository<UserPrincipal, UserProfile>;
    public type UserDBKey = TrieRepositories.TrieDBKey<UserPrincipal>;

    /// 辅助方法，Tag的Trie.Key实例
    public func userDBKey(key: UserPrincipal): UserDBKey {
        { key = key; hash = Principal.hash(key) }
    };

    let userEq = UserDomain.userEq;
    let userHash = UserDomain.userHash;

    public func newUserDB() : UserDB {
        Trie.empty<UserPrincipal, UserProfile>()
    };

    public func newUserRepository() : UserRepository{
        TrieRepositories.TrieRepository<UserPrincipal, UserProfile>()
    };

    /// 删除指定的用户
    /// Args:
    ///     |userDB|    用户数据源
    ///     |keyOfUser| 被删除的用户主键
    /// Returns:
    ///     删除指定用户的用户数据源与删除的用户数据组成的元组,如果指定的用户不存在数据源中存,该值为null
    public func deleteUser(db: UserDB, repository: UserRepository, keyOfUser: UserPrincipal) : UserDB {
        repository.delete(db, userDBKey(keyOfUser), userEq)
    };

    /// 查询指定用户名的用户信息
    public func findOneUserByName(db: UserDB, repository: UserRepository, username: Text) : ? UserProfile {
        let users: UserDB = repository.findBy(db, func (uid: UserPrincipal, up : UserProfile): Bool { 
            up.username == username
        });

        Option.map<(Trie.Key<UserPrincipal>, UserProfile), UserProfile>(Trie.nth<UserPrincipal, UserProfile>(users, 0), func (kv) : UserProfile { kv.1 })
    };

    /// 获取的指定用户的信息
    public func getUser(db: UserDB, repository: UserRepository, owner: UserPrincipal) : ?UserProfile {
        repository.get(db, userDBKey(owner), userEq)
    };

    public func pageUser(db: UserDB, repository: UserRepository, pageSize: Nat, pageNum: Nat,
        filter: (UserPrincipal, UserProfile) -> Bool, sortWith: (UserProfile, UserProfile) -> Order.Order) : UserPage {
        repository.page(db, pageSize, pageNum, filter, sortWith)
    };

    /// 更新指定用户的信息
    public func updateUser(db: UserDB, repository: UserRepository, userProfile: UserProfile): (UserDB, ?UserProfile) {
        repository.update(db, userProfile, userDBKey(userProfile.owner), userEq)
    };

    /// 保存指定用户的信息
    public func saveUser(db: UserDB, repository: UserRepository, userProfile: UserProfile): UserDB {
        updateUser(db, repository, userProfile).0
    };

    /// 总用户数
    public func countUserTotal(db : UserDB, repository: UserRepository) :  Nat {
        repository.countSize(db)
    };

    /// 获取所有用户的UserPrincipal
    public func allUserPrincipals(userDB: UserDB) : [UserPrincipal] {
        Trie.toArray<UserPrincipal, UserProfile, UserPrincipal>(userDB, func (k: UserPrincipal, _) : UserPrincipal { k })
    };

}