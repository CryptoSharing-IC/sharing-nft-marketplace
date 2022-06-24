
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
        desc: Text;
        web: Text;
        availableUtil: Timestamp;
        price: PriceUnit;  // 此数值表示价格，例如： 10000 表示 1 ICP
        owner: Principal;
        status: ListingStatus;
        createdAt: Timestamp;
        updatedAt: Timestamp;
        redeemNftId: ?Nat;
    };

    public type NFTPropertyKey = {
        #isDerivative;
        #maxUseCount;
        // can add more properties here
    };

    public type PriceUnit = {
        symbol: Text;
        decimals: Nat;
    };

    public type ListingStatus = {
        #Pending;   // 待上架
        #Enable;    // 已上架
        #Disable;   // 已下架
        #Redeemed;  // 已赎回
    };

    public type ListingCreateCommand = {
        canisterId: Text;
        nftId: Nat;
        name: Text;
        desc: Text;
        web:Text;
        availableUtil: Timestamp;
        price: PriceUnit;  // 此数值表示价格，例如：10000 表示 1 ICP  
        //metadata: Sharing.TokenInfoExt;
    };

    public func createProfile(cmd: ListingCreateCommand, id: ListingId, owner: Principal, now: Timestamp, metadata: Sharing.TokenInfoExt, redeemNftId: ?Nat) : ListingProfile {
        return {
            id = id ;
            canisterId = cmd.canisterId ;
            nftId = cmd.nftId ;
            name = cmd.name;
            desc = cmd.desc;
            web = cmd.web;
            availableUtil = cmd.availableUtil ;
            price = cmd.price ;
            owner = owner ;
            status = #Pending;
            createdAt = now ;
            updatedAt = now ;
            redeemNftId = redeemNftId;
            wTokenId = null;
        };
    };

    public type ListingEditCommand = {
        id: ListingId;
        canisterId: Text;
        nftId: Nat;
        name: Text;
        desc: Text;
        web: Text;
        availableUtil: Timestamp;
        price: PriceUnit;  // 此数值表示价格，例如： 10000 表示 1 ICP
        owner: Principal;
        status: ListingStatus;
        createdAt: Timestamp;
        //metadata: Sharing.TokenInfoExt;
    };

    public func updateListing(cmd: ListingEditCommand, profile: ListingProfile, now: Timestamp, redeemNftId: Nat) : ListingProfile {
        assert(cmd.id == profile.id);
        {
            id = profile.id ;
            canisterId = cmd.canisterId ;
            nftId = cmd.nftId ;
            name = cmd.name ;
            desc = cmd.desc;
            web = cmd.web;
            availableUtil = cmd.availableUtil ;
            price = cmd.price ;
            status = cmd.status;
            owner = profile.owner ;
            createdAt = profile.createdAt ;
            updatedAt = now ;
            //metadata = cmd.metadata;
            redeemNftId = ?redeemNftId;
        }
    };

    public func updateListingStaked(l: ListingProfile, redeemNftId: ?Nat) : ListingProfile{
        return {
            id = l.id ;
            canisterId = l.canisterId ;
            nftId = l.nftId ;
            name = l.name;
            desc = l.desc;
            web = l.web;
            availableUtil = l.availableUtil ;
            price = l.price ;
            owner = l.owner ;
            status = #Enable;
            createdAt = l.createdAt ;
            updatedAt = l.updatedAt;
            redeemNftId = redeemNftId;
        }

    };

    public func updateListingStatus(l: ListingProfile, status: ListingStatus) : ListingProfile{
        return {
            id = l.id ;
            canisterId = l.canisterId ;
            nftId = l.nftId ;
            name = l.name;
            desc = l.desc;
            web = l.web;
            availableUtil = l.availableUtil ;
            price = l.price ;
            owner = l.owner ;
            status = status;
            createdAt = l.createdAt ;
            updatedAt = l.updatedAt;
            redeemNftId = l.redeemNftId;            
        }
    };

    public type ListingPageQuery = {
        user: ?Principal;
        pageSize: Nat;
        pageNum: Nat;
        status: ListingStatus;
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

    public func listingUserMatches(profile: ListingProfile, user: Principal) : Bool {
        profile.owner == user;
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
