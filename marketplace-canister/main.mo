
import Principal "mo:base/Principal";
import Time "mo:base/Time";

import UserDomain "user/UserDomain";
import UserRepositories "user/UserRepositories";
import ListingDomain "listing/ListingDomain";
import ListingRepositories "listing/ListingRepositories";

actor Marketplace {

    public type UserProfile = UserDomain.UserProfile;

    public type ListingCreateCommand = ListingDomain.ListingCreateCommand;

    /// ID Generator
    stable var idGenerator : Nat = 10001;

    stable var userDB = UserRepositories.newUserDB();
    let userRepository = UserRepositories.newUserRepository();

    stable var listingDB = ListingRepositories.newListingDB();
    let listingRepository = ListingRepositories.newListingRepository();

    /// Canister健康检查
    public query func healthcheck() : async Bool { true };

    /// --------------------------- NFT Canister management --------------------------- ///
    stable var canisters = [];

    /// --------------------------- User API ---------------------------- ///
    /// 注册新用户，注册成功返回true, 已经注册过的用户返回false
    public shared(msg) func registerUser() : async Bool {
        let caller = msg.caller;
        switch (UserRepositories.getUser(userDB, userRepository, caller)) {
            case (?u) false;
            case (null) {
                let user = UserDomain.newUser(getIdAndIncrementOne(), caller, "", timeNow_());
                userDB := UserRepositories.saveUser(userDB, userRepository, user);
                true
            }
        }
    };

    /// 获取调用者的信息
    public query(msg) func getSelf() : async ?UserProfile {
        let caller = msg.caller;
        UserRepositories.getUser(userDB, userRepository, caller)
    };

    /// 获取指定用户的信息
    public query(msg) func getUser(user: Principal) : async ?UserProfile {
        UserRepositories.getUser(userDB, userRepository, user)
    };

    /// ---------------------------- Listing API ---------------------------- ///
    public shared(msg) func listingNFT(cmd: ListingCreateCommand) : async Nat {
        let caller = msg.caller;
        let id = getIdAndIncrementOne();
        let listingProfile = ListingDomain.createProfile(cmd, id, caller, timeNow_());
        listingDB := ListingRepositories.saveListing(listingDB, listingRepository, listingProfile);
        id
    };

    /// ------------------------------ Helper ------------------------------ ///
    /// 获取当前的id，并对id+1,这是有size effects的操作
    func getIdAndIncrementOne() : Nat {
        let id = idGenerator;
        idGenerator += 1;
        id
    };
    
    /// 辅助方法，获取当前时间
    func timeNow_() : Int {
        Time.now()
    };

};
