
import Int "mo:base/Int";
import Order "mo:base/Order";

import Sharing "../nft/Sharing.did";
import TokenDomain "../nft/TokenDomain";
import Types "../base/Types";
import Utils "../base/Utils";

module {
    
    public type LendId = Types.Id;
    public type Timestamp = Types.Timestamp;

    public type TokenInfoExt = Sharing.TokenInfoExt;

    public type LendProfile = {
        id: LendId;
        listingId: Nat64;
        properties: [Property];
        owner: Principal;
        status: LendStatus;
        createdAt: Timestamp;
        updatedAt: Timestamp;
        metadata: TokenInfoExt;
    };

    public type Property = {
        name: Text;
        value: Text;
    };

    public type LendStatus = {
        #Pending;   // 付款中
        #Enable;    // 已付款
        #Disable;   // 已取消
    };
    
    public type LendCreateCommand = {
        listingId: Nat64;
        properties: [Property];
    };

    public func createProfile(cmd: LendCreateCommand, id: LendId, owner: Principal, now: Timestamp, metadata: Sharing.TokenInfoExt) : LendProfile {
        return {
            id = id ;
            listingId = cmd.listingId; 
            properties = cmd.properties;
            owner = owner ;
            status = #Pending;
            createdAt = now ;
            updatedAt = now ;
            metadata = metadata;
        };
    };

    public type LendPageQuery = {
        pageSize: Nat;
        pageNum: Nat;
        status: Text;
    };

    public func lendStatusToText(status: LendStatus) : Text {
        switch (status) {
            case (#Enable) "enable";
            case (#Disable)  "disable";
            case (_)  "pending";
        }
    };

    public func lendStatusMatches(profile: LendProfile, status: Text) : Bool {
        lendStatusToText(profile.status) == Utils.toLowerCase(status)
    };

    /// 按更新时间倒序，发布时间越大表示越新，排在前面
    public func lendOrderUpdateTimeDesc(profile1: LendProfile, profile2: LendProfile) : Order.Order {
        Int.compare(profile2.updatedAt, profile1.updatedAt)
    };

    public type LendIdCommand = {
        id: LendId;
    };

    public let lendEq = Types.idEq;

}
