
import Int "mo:base/Int";
import Order "mo:base/Order";
import Text "mo:base/Text";

import Sharing "../nft/Sharing.did";
import TokenDomain "../nft/TokenDomain";
import Types "../base/Types";
import Utils "../base/Utils";
import Voice "../voice/Voice";

module {
    
    public type ListingId = Types.Id;
    public type ListingProperty = Types.Property<NFTPropertyKey, Text>;
    public type Timestamp = Types.Timestamp;

    public type TokenInfoExt = Sharing.TokenInfoExt;

    public type ListingProfile = {
        id: ListingId;
        canisterId: Text;
        nftId: Nat;
        name: Text;
        availableUtil: Timestamp;
        price: PriceUnit;  // 此数值表示价格，例如： 10000 表示 1 ICP
        owner: Principal;
        status: ListingStatus;
        createdAt: Timestamp;
        updatedAt: Timestamp;
        //metadata: TokenInfoExt;
        voice: Voice.Voice;
    };

    public type NFTPropertyKey = {
        #isDerivative;
        #maxUseCount;
        // can add more properties here
    };

    public type PriceUnit = {
        symbol: Text;
        decimals: Nat64;
    };

    public type ListingStatus = {
        #Pending;   // 待上架
        #Enable;    // 已上架
        #Lock       // 付款前先锁定
        #Unlock     // 可以进入付款流程
        #Disable;   // 已下架
        #Redeemed;  // 已赎回
    };

    public type ListingCreateCommand = {
        canisterId: Text;
        nftId: Nat;
        name: Text;
        desc: Text;
        availableUtil: Timestamp;
        price: PriceUnit;  // 此数值表示价格，例如： 10000 表示 1 ICP
        //metadata: Sharing.TokenInfoExt;
    };

    public func createProfile(cmd: ListingCreateCommand, id: ListingId, owner: Principal, now: Timestamp, metadata: Sharing.TokenInfoExt, voice: Voice.Voice) : ListingProfile {

        return {
            id = id ;
            canisterId = cmd.canisterId ;
            nftId = cmd.nftId ;
            name = cmd.name;
            desc = cmd.desc;
            availableUtil = cmd.availableUtil ;
            price = cmd.price ;
            owner = owner ;
            status = #Pending;
            createdAt = now ;
            updatedAt = now ;
            //metadata = metadata;
            voice = voice;
        };
    };

    public type ListingEditCommand = {
        id: ListingId;
        canisterId: Text;
        nftId: Nat;
        name: Text;
        availableUtil: Timestamp;
        price: PriceUnit;  // 此数值表示价格，例如： 10000 表示 1 ICP
        owner: Principal;
        status: ListingStatus;
        createdAt: Timestamp;
        metadata: Sharing.TokenInfoExt;
    };

    public func updateListing(cmd: ListingEditCommand, profile: ListingProfile, now: Timestamp, voice: Voice.Voice) : ListingProfile {
        assert(cmd.id == profile.id);
        {
            id = profile.id ;
            canisterId = cmd.canisterId ;
            nftId = cmd.nftId ;
            name = cmd.name ;
            availableUtil = cmd.availableUtil ;
            price = cmd.price ;
            status = cmd.status;
            owner = profile.owner ;
            createdAt = profile.createdAt ;
            updatedAt = now ;
            metadata = cmd.metadata;
            voice = voice;
        }
    };

    public type ListingPageQuery = {
        pageSize: Nat;
        pageNum: Nat;
        status: Text;
    };

    public func listingStatusToText(status: ListingStatus) : Text {
        switch (status) {
            case (#Enable) "enable";
            case (#Disable)  "disable";
            case (#Redeemed) "redeemed";
            case (_)  "pending";
        }
    };

    public func listingStatusMatches(profile: ListingProfile, status: Text) : Bool {
        listingStatusToText(profile.status) == Utils.toLowerCase(status)
    };

    /// 按更新时间倒序，发布时间越大表示越新，排在前面
    public func listingOrderUpdateTimeDesc(profile1: ListingProfile, profile2: ListingProfile) : Order.Order {
        Int.compare(profile2.updatedAt, profile1.updatedAt)
    };

    public type ListingIdCommand = {
        id: ListingId;
    };

    public let listingEq = Types.idEq;

}
