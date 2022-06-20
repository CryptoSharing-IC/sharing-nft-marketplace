
import Array "mo:base/Array";
import Arrays "mo:base/Array";
import Blob "mo:base/Blob";
import Prelude "mo:base/Prelude";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int "mo:base/Int";

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
import Ledger "./ledger/ledger.public.did";

shared(msg) actor class Marketplace() = self {
    //TODO, init parameter
    let sharingCanisterId = "jpabj-zyaaa-aaaah-qaiya-cai";
    let sharingCanister: Sharing.NFToken = actor(sharingCanisterId);

    let ledgerCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai";
    let ledgerCanister: Ledger.Self = actor(ledgerCanisterId);

    let nftCansiterId = "my55u-diaaa-aaaah-qcoaa-cai"; 
    let nftCansiter:Dip721.NFToken = actor(nftCansiterId);

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

        //let nftCansiter : Dip721.NFToken = actor(cmd.canisterId); 
        let tokenInfo: Dip721.TokenInfoExt =
        switch(await nftCansiter.getTokenInfo(cmd.nftId)) {
            case(#Ok(tokenInfo)) {
                switch(tokenInfo.metadata){
                    case(null){
                        return #Err(#unauthorized);
                    };
                    case(_){};
                };
                tokenInfo;
            };
            case(_) {
                return #Err(#notFound);
            }
        };
        if(Principal.notEqual(caller, tokenInfo.owner)) {
            return #Err(#unauthorized);
        };

        let listingProfile = ListingDomain.createProfile(cmd, id, caller, timeNow_(), tokenInfo, null);
        listingDB := ListingRepositories.saveListing(listingDB, listingRepository, listingProfile);
        #Ok(id)
    };

    // 上架 nft
    // Notice: 前端把第三方 nft 平台上这个nft的转为 marketplace canister 后调用些方法
    // 需要验证对应的NFT是否属于 marketplace canister
    // TODO 到我方的衍生合约上铸造一个 wNft, 并返回 wNFT id , 供用户赎回使用
    public shared(msg) func listingNFT(cmd: ListingIdCommand) : async Result<Nat, Error> {
        let caller = msg.caller;
        switch (ListingRepositories.getListing(listingDB, listingRepository, cmd.id)) {
            case (?l) {
                //let nftCansiter : Dip721.NFToken = actor(l.canisterId);

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
                //TODO, 注意还要保证同一个合约地址的nft id 的listing对象只能存储一份, 用canisterid和nftid拼接成key
                if(Principal.notEqual(caller, l.owner)) { 
                    return #Err(#unauthorized);
                };
                //mint wNft for caller, todo refactor
                

                let tokenMetadata = switch(await nftCansiter.getTokenInfo(l.nftId)){
                    case(#Ok(tokenInfo)) { 
                        switch(tokenInfo.metadata) {
                            case(?metadata){
                                metadata;
                            };
                            case(_){
                                Prelude.unreachable();//
                            };
                        }
                    };
                    case(_) {
                        return #Err(#notFound);
                    };
                };
                
                let attribute: Sharing.Attribute = {
                    key = "type";
                    value = "wNFT";
                };
            
                let wTokenMetadata: Sharing.TokenMetadata = {
                    filetype = tokenMetadata.filetype;
                    attributes = Arrays.make<Sharing.Attribute>(attribute);
                    location = tokenMetadata.location;
                };
                let wTokenId = switch(await sharingCanister.mint(caller, ?wTokenMetadata)){
                    case(#Ok((wTokenId, _))){
                        wTokenId;
                    };
                    case(_){
                        return #Err(#mintFailed);
                    };
                };
                let listingProfile: ListingDomain.ListingProfile = ListingDomain.updateListingStaked(l, ?wTokenId);
                listingDB := ListingRepositories.saveListing(listingDB, listingRepository, listingProfile);
                return #Ok(wTokenId);
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
        let caller = msg.caller;
        switch (ListingRepositories.getListing(listingDB, listingRepository, cmd.id)) {
            case (?l) {
                let redeemNftId = switch(l.redeemNftId){
                    case(?redeemNftId) {redeemNftId};
                    case(null) {
                        return #Err(#notFound);
                    };
                };
                let redeemOwner = switch(await sharingCanister.ownerOf(redeemNftId)){
                    case(#Ok(owner)){
                        if(caller != owner) {
                            return #Err(#unauthorized);
                        };
                        owner
                    };
                    case(_){return #Err(#notFound)};
                };
                if(isRenting(l.id)) {
                    return #Err(#renting);
                };
                switch(await sharingCanister.burn(redeemNftId)) {
                    case(#Ok(txId)){};
                    case(_){
                        return #Err(#burnFailed);
                    };
                };
                let nftCansiter : Dip721.NFToken = actor(l.canisterId); 
                switch(await nftCansiter.transfer(redeemOwner, l.nftId)){
                    case(#Ok(txId)){
                        return #Ok(l.id);
                    };
                    case(_){
                        return #Err(#transferFailed)
                    };
                };

            };
            case (null) {
                return #Err(#notFound);
            };
        };
    };
    
    func isRenting(listId: Nat64): Bool{
        LendRepositories.some(lendDB, lendRepository, func (k: LendDomain.LendId, v: LendDomain.LendProfile) {
            v.listingId == listId and validLend(v);
        });
    };
    
    func validLend(lend: LendDomain.LendProfile) : Bool{
        timeNow_() < lend.end 
        and lend.status == #Enable
    };

    /// 分页查询 上架 nft 
    public query(msg)  func pageListings(q: ListingPageQuery) : async ListingPage {
        let user : ?Principal = q.user;
        let pageSize = q.pageSize;
        let pageNum = q.pageNum;
        let status = q.status;

        ListingRepositories.pageListing(listingDB, listingRepository, pageSize, pageNum, func (id, profile) : Bool {
            switch(user) {
                case(?user) {
                    return ListingDomain.listingUserMatches(profile, user) and status == profile.status;
                };
                case(null) {
                    return status == profile.status;
                };
            }
            
        }, ListingDomain.listingOrderUpdateTimeDesc)
    };

    public query(msg) func allListing() : async [ListingDomain.ListingProfile] {
        ListingRepositories.allListing(listingDB);
    };

    // 租入 Lend 流程，先记录租入信息，例如哪个已经上架的 nft等
    public shared(msg) func preLendNFT(cmd: LendCreateCommand) : async Result<LendDomain.LendProfile, Error> {
        let caller = msg.caller;
        let listingId = cmd.listingId;

        switch (ListingRepositories.getListing(listingDB, listingRepository, listingId)) {
            case (?listing) {
                if (listing.status != #Enable) {
                    return #Err(#listingNotEnable);
                };
                if((cmd.end - cmd.start)/3600 < 1){
                    return #Err(#parameterErr);
                };

                if(cmd.end > listing.availableUtil) {
                    return #Err(#parameterErr);
                };
                ///遍历所有的lend对象确保 资源可用 租赁时间不重叠
                // if(not rentTimeAvailable(listing.id, cmd.start, cmd.end)) {
                //     return #Err(#understock);
                // };
               
                let lendId = getIdAndIncrementOne();
                let now = timeNow_();
               
                let accountIdentifier = Account.accountIdentifier(Principal.fromActor(self), Blob.fromArray(Account.beBytes64(lendId)));
                
                //以整数小时计费
                let amount: Nat64 = Nat64.fromNat((cmd.end - cmd.start) * listing.price.decimals /3600); 
                let lendOrder = LendDomain.createProfile(listing.id, lendId, caller, listing.owner ,now, cmd.start, cmd.end, accountIdentifier, amount);
                lendDB := LendRepositories.saveLend(lendDB, lendRepository, lendOrder);
                #Ok(lendOrder);
            };
            case (null) #Err(#listingNotFound);
        }
    };
    
    // public query inventory(): []{

    // };

    func rentTimeAvailable(listId: Nat64, start: Nat, end: Nat) : Bool{ 
        let lendList: [LendDomain.LendProfile] = LendRepositories.getLendByListId(lendDB, lendRepository, listId);
        for(l in lendList.vals()) {
            if(isOverlap(start, end, l.start, l.end)){
                return false;
            };
        };
        return true;
    };

    func isOverlap(a1: Nat, a2: Nat, b1: Nat, b2: Nat): Bool{
        let begin: Nat = Nat.max(a1, b1);
        let end : Nat = Nat.min(a2, b2);
        end - begin >= 0;
    };

    /// 租入 Lend nft
    /// 校验支付信息，成功后 mint nft 并返回 TODO
    public shared(msg) func notify(cmd: LendIdCommand) : async Result<Nat64, Error> {
        let caller = msg.caller;
        let lendId = cmd.id;

        switch(LendRepositories.getLend(lendDB, lendRepository, lendId)) {
            case(?lend) {
                let subaccountBalance : {e8s: Nat64} = await ledgerCanister.account_balance({account:Blob = lend.accountIdentifier});
                if(subaccountBalance.e8s != lend.amount) {
                    return #Err(#parameterErr)
                };
                    //pay success 
                    //0. 把钱转回主账户 
                    
                    let transferArgs: Ledger.TransferArgs = {
                        to = Account.accountIdentifier(Principal.fromActor(self), Account.defaultSubaccount());
                        fee = {e8s=10000};
                        memo = lend.id;
                        from_subaccount = ?lend.accountIdentifier;
                        created_at_time = ?{timestamp_nanos = Nat64.fromNat(Int.abs(timeNow_()))};   
                        amount = {e8s = subaccountBalance.e8s};
                    };

                    type TransferError = {
                        #TxTooOld : { allowed_window_nanos : Nat64 };
                        #BadFee : { expected_fee : Ledger.Tokens };
                        #TxDuplicate : { duplicate_of : BlockIndex };
                        #TxCreatedInFuture;
                        #InsufficientFunds : { balance : Ledger.Tokens };
                    };
                    type BlockIndex = Nat64;
                    let res:{ #Ok : BlockIndex; #Err : TransferError } = await ledgerCanister.transfer(transferArgs);
                    switch(res){
                        case(#Ok(blockIndex)){

                        };
                        case(_){
                            return #Err(#transferFailed);
                        };
                    };
                    //1. 给买家铸造使用权nft, 
                    ///////////////
                    let l: ListingDomain.ListingProfile = switch (ListingRepositories.getListing(listingDB, listingRepository, lend.listingId)) {
                        case (?listing) {
                            listing;
                        };
                        case (null) {
                            return #Err(#listingNotFound);
                        }
                    };
                   let nftCansiter : Dip721.NFToken = actor(l.canisterId); 
                   let tokenMetadata = switch(await nftCansiter.getTokenInfo(l.nftId)){
                        case(#Ok(tokenInfo)) { 
                            switch(tokenInfo.metadata) {
                                case(?metadata){
                                    metadata;
                                };
                                case(_){
                                    Prelude.unreachable();//
                               };
                            }
                        };
                        case(_) {
                            return #Err(#notFound);
                        };
                    };
                    let attribute: Sharing.Attribute = {
                        key = "type";
                        value = "uNFT";
                    };
                    let wTokenMetadata: Sharing.TokenMetadata = {
                        filetype = tokenMetadata.filetype;
                        attributes = Arrays.make<Sharing.Attribute>(attribute);
                        location = tokenMetadata.location;
                    };
                    let uTokenId = switch(await sharingCanister.mint(caller, ?wTokenMetadata)){
                        case(#Ok((wTokenId, _))){
                            wTokenId;
                        };
                        case(_){
                            return #Err(#mintFailed);
                        };
                    };
                    
                    //2. 给拥有者分成 
               
                    let transferRentArgs: Ledger.TransferArgs = {
                        to = Account.accountIdentifier(lend.nftOwner, Account.defaultSubaccount());
                        fee = {e8s=10000};
                        memo = lend.id;
                        from_subaccount = null;
                        created_at_time = ?{timestamp_nanos = Nat64.fromNat(Int.abs(timeNow_()))};
                        amount = {e8s = lend.amount * 9 / 10};
                    };
                    let transferRentRes:{ #Ok : BlockIndex; #Err : TransferError } = await ledgerCanister.transfer(transferRentArgs);
                    switch(transferRentRes){
                        case(#Ok(blockIndex)){
                        };
                        case(_){
                            return #Err(#transferFailed);
                        };
                    };
                    return #Ok(lend.id);
                
            };
            case(null) {
                return #Err(#notFound);
            };
        };
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
