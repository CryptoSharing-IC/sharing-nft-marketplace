
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";

import Account "./Account/Account";
import Dip721 "../marketplace-canister/canisters/dip721.did";
import LendDomain "lend/LendDomain";
import LendRepositories "lend/LendRepositories";
import ListingDomain "listing/ListingDomain";
import ListingRepositories "listing/ListingRepositories";
import Sharing "../marketplace-canister/canisters/sharing.did";
import TokenDomain "nft/TokenDomain";
import Types "base/Types";
import UserDomain "user/UserDomain";
import UserRepositories "user/UserRepositories";
import Voice "./voice/Voice";

shared(msg) actor class Marketplace() = self {
    //TODO, init parameter
    let sharingCanisterId = "rno2w-sqaaa-aaaaa-aaacq-cai";
    public type Result<X, Y> = Types.Result<X, Y>;

    public type UserProfile = UserDomain.UserProfile;

    public type ListingCreateCommand = ListingDomain.ListingCreateCommand;
    public type ListingIdCommand = ListingDomain.ListingIdCommand;
    public type ListingPageQuery = ListingDomain.ListingPageQuery;
    public type ListingPage = ListingRepositories.ListingPage;

    public type LendCreateCommand = LendDomain.LendCreateCommand;

    public type LendIdCommand = LendDomain.LendIdCommand;

    public type Error = Types.Error;

    /// ID Generator
    stable var idGenerator : Nat64 = 10001;

    let owner = msg.caller;

    stable var userDB = UserRepositories.newUserDB();
    let userRepository = UserRepositories.newUserRepository();

    /// 上架 nft 信息
    stable var listingDB = ListingRepositories.newListingDB();
    let listingRepository = ListingRepositories.newListingRepository();

    /// 租入 nft 信息
    stable var lendDB = LendRepositories.newLendDB();
    let lendRepository = LendRepositories.newLendRepository();

    stable var  nftCansterId = "";

    stable var sharingNftCanisterId = "";

    /// Canister健康检查
    public query func healthcheck() : async Bool { true };

    /// --------------------------- NFT Canister management --------------------------- ///
    stable var canisters: [Principal] = [];

    //voice
    stable var voiceStableDb : Voice.StableDB = Voice.stableDbInitValue();
    let voiceStore   = Voice.Store();

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
    
    public query func getCanisterPrincipal(): async Text {
        Principal.toText(Principal.fromActor(self));
    };

    //todo, 以nft为一个主体, 多次上架同一个nft只会更新一个listing对象
    /// ---------------------------- Listing API ---------------------------- ///
    // 预上架 nft 
    // 获取 nft 的 metadata
    // 生成 listing 对象, 状态为 Pending (未质押) 
    public shared(msg) func preListingNFT(cmd: ListingCreateCommand) : async Result<Nat64, Error> {
        
        let caller = msg.caller;
        let id = getIdAndIncrementOne();

        let nftCansiter : Dip721.NFToken = actor(cmd.canisterId); //todo, should use the third party did file.
        let tokenInfoRes : Dip721.Result_2 = await nftCansiter.getTokenInfo(cmd.nftId);
        let tokenInfo: Dip721.TokenInfoExt =
        switch(tokenInfoRes) {
            case(#Ok(tokenInfo)) {
                tokenInfo;
            };
            case(_) {
                return #Err(#notFound);
            }
        };
        if(Principal.notEqual(caller, tokenInfo.owner)) {
            return #Err(#unauthorized);
        };
        let voiceId = getIdAndIncrementOne();
        let voice: Voice.Voice = {
            id = voiceId;
            listingId = id;
            accountIdentifier = Account.accountIdentifier(Principal.fromActor(self), Blob.fromArray(Account.beBytes64(voiceId)));
            amount = cmd.price.decimals;
            state = #unpaid;
        };

        let listingProfile = ListingDomain.createProfile(cmd, id, caller, timeNow_(), tokenInfo, voice);
        listingDB := ListingRepositories.saveListing(listingDB, listingRepository, listingProfile);
        #Ok(id)
    };

    // 上架 nft
    // Notice: 前端把第三方 nft 平台上这个nft的转为 marketplace canister 后调用些方法
    // 需要验证对应的NFT是否属于 marketplace canister
    // TODO 到我方的衍生合约上铸造一个 wNft, 并返回 wNFT id , 供用户赎回使用
    public shared(msg) func listingNFT(cmd: ListingIdCommand) : async Result<Nat64, Error> {
        let caller = msg.caller;
        switch (ListingRepositories.getListing(listingDB, listingRepository, cmd.id)) {
            case (?l) {
                

                let nftCansiter : Dip721.NFToken = actor(l.canisterId);

                let nftOwner : Principal = switch(await nftCansiter.ownerOf(l.nftId)) {
                    case (#Ok(owner)) {
                        owner;
                    };
                    case (_) {
                        return #Err(#notFound);
                    };
                };
                if(Principal.notEqual(nftOwner, Principal.fromActor(self))) {
                    return #Err(#unauthorized);
                };
                if(Principal.notEqual(caller, l.owner)) { //TODO, 注意还要保证同一个合约地址的nft id 的listing对象只能存储一份
                    return #Err(#unauthorized);
                };
                //mint wNft for caller
                let sharingCanister: Sharing.NFToken = actor(sharingCanisterId);
                sharingCanister.mint(caller, )
                return #Ok(cmd.id);//temp
            };
            case (null) {
                return #Err(#notFound);
            }
        }
    };

    /// 下回赎回 redeem nft TODO
    /// 下回时需要检查 listing 的状态，租期是否结束，
    /// 如果可以赎回，再申请注销 wnft，注释成功后，前端再向 wnft 的 owner 转账 ICP
    public shared(msg) func redeem(cmd: ListingIdCommand) : async Result<Nat64, Error> {
        #Err(#unauthorized)
    };

    /// 验证赎回退款，校验成功修改 ListingProfile 的状态 TODO
    public shared(msg) func validRedeem(cmd: ListingIdCommand) : async Result<Bool, Error> {
        #Err(#unauthorized)
    };

    /// 分页查询 上架 nft 
    public query(msg) func pageListings(q: ListingPageQuery) : async ListingPage {
        let pageSize = q.pageSize;
        let pageNum = q.pageNum;
        let status = q.status;

        ListingRepositories.pageListing(listingDB, listingRepository, pageSize, pageNum, func (id, profile) : Bool {
            ListingDomain.listingStatusMatches(profile, status)
        }, ListingDomain.listingOrderUpdateTimeDesc)
    };

    /// 预租入 Lend 流程，先记录租入信息，例如哪个已经上架的 nft等
    // public shared(msg) func preLendNFT(cmd: LendCreateCommand) : async Result<Nat64, Error> {
    //     let caller = msg.caller;
    //     let listingId = cmd.listingId;

    //     switch (ListingRepositories.getListing(listingDB, listingRepository, listingId)) {
    //         case (?listing) {
    //             if (listing.status != #Enable) {
    //                 return #Err(#listingNotEnable);
    //             };

    //             let lendId = getIdAndIncrementOne();
    //             let now = timeNow_();
    //             let metadata = listing.metadata;
    //             let lendOrder = LendDomain.createProfile(cmd, lendId, caller, now, metadata);

    //             lendDB := LendRepositories.saveLend(lendDB, lendRepository, lendOrder);

    //             #Ok(lendId);

    //         };
    //         case (null) #Err(#listingNotFound);
    //     }
    // };

    /// 租入 Lend nft
    /// 校验支付信息，成功后 mint nft 并返回 TODO
    public shared(msg) func validLend(cmd: LendIdCommand) : async Result<Dip721.TokenInfoExt, Error> {
        #Err(#unauthorized)
    };

    
    /// ------------------------------ Other NFT API ------------------------ ///
    /// 添加支持的 NFT Canister
    public shared(msg) func addNFTCansiter(canisterId: Principal) : async Bool {
        func f(p: Principal) : Bool {
            Principal.equal(p, canisterId)
        };
        switch (Array.find(canisters, f)) {
            case (?_) true;
            case null {
                canisters := Array.append<Principal>(canisters, [canisterId]);
                true
            }
        }
    };

    public shared(msg) func setNftCansterId(canisterId: Text) : async Result<Bool, Error> {
        let caller = msg.caller;
        if (caller == owner) {
            nftCansterId := canisterId;
            #Ok(true)
        } else {
            #Err(#unauthorized)
        }
        
    };

    public shared(msg) func setShareNftCansterId(canisterId: Text) : async Result<Bool, Error> {
        let caller = msg.caller;
        if (caller == owner) {
            sharingNftCanisterId := canisterId;
            #Ok(true)
        } else {
            #Err(#unauthorized)
        }
        
    };

    /// 获取支持的 NFT Canister列表
    public query func getNFTCansiters() : async [Principal] {
        canisters
    };

    /// 获取 nft canister id
    public query func getNftCansterId() : async Text {
        nftCansterId
    };

    /// 获取 sharibg nft  canister id
    public query func getSharingNftCansterId() : async Text {
        sharingNftCanisterId
    };

    /// ------------------------------ Helper ------------------------------  ///
    /// 获取当前的id，并对id+1,这是有size effects的操作
    func getIdAndIncrementOne() : Nat64 {
        let id = idGenerator;
        idGenerator += 1;
        id
    };
    
    /// 辅助方法，获取当前时间
    func timeNow_() : Int {
        Time.now()
    };


        // upgrade functions
    system func preupgrade() {
       voiceStableDb := voiceStore.preUpgrade();
    };

    system func postupgrade() {
        voiceStore.postUpgrade(voiceStableDb);
    };

};
