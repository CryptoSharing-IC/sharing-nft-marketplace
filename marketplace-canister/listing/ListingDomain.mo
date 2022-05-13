
import Types "../base/Types";
import TokenDomain "../nft/TokenDomain";

module {
    
    public type ListingId = Types.Id;
    public type ListingProperty = Types.Property<NFTPropertyKey, Text>;
    public type Timestamp = Types.Timestamp;

    public type ListingProfile = {
        id: ListingId;
        canisterId: Principal;
        nftId: Nat;
        name: Text;
        nftInfo: TokenInfo;
        startTime: Timestamp;
        endTime: Timestamp;
        maxUseCount: Nat;
        isPrivate: Bool;
        properties: ListingProperty;
        owner: Principal;
        createdAt: Timestamp;
        updatedAt: Timestamp;
    };

    public type TokenInfo = TokenDomain.TokenProfile;

    public type NFTPropertyKey = {
        #isDerivative;
        #maxUseCount;
        // can add more properties here
    };

    public type ListingCreateCommand = {
        canisterId: Principal;
        nftId: Nat;
        name: Text;
        nftInfo: TokenInfo;
        startTime: Timestamp;
        endTime: Timestamp;
        maxUseCount: Nat;
        isPrivate: Bool;
        properties: ListingProperty;
    };

    public func createProfile(cmd: ListingCreateCommand, id: ListingId, owner: Principal, now: Timestamp) : ListingProfile {
        return {
            id = id ;
            canisterId = cmd.canisterId ;
            nftId = cmd.nftId ;
            name = cmd.name ;
            nftInfo = cmd.nftInfo ;
            startTime = cmd.startTime ;
            endTime = cmd.endTime ;
            maxUseCount = cmd.maxUseCount ;
            isPrivate = cmd.isPrivate ;
            properties = cmd.properties ;   
            owner = owner ;
            createdAt = now ;
            updatedAt = now ;
        };
    };

    public type ListingEditCommand = {
        id: ListingId;
        canisterId: Principal;
        nftId: Nat;
        name: Text;
        nftInfo: TokenInfo;
        startTime: Timestamp;
        endTime: Timestamp;
        maxUseCount: Nat;
        isPrivate: Bool;
        properties: ListingProperty;
    };

    public func updateListing(cmd: ListingEditCommand, profile: ListingProfile, now: Timestamp) : ListingProfile {
        assert(cmd.id == profile.id);
        {
            id = profile.id ;
            canisterId = cmd.canisterId ;
            nftId = cmd.nftId ;
            name = cmd.name ;
            nftInfo = cmd.nftInfo ;
            startTime = cmd.startTime ;
            endTime = cmd.endTime ;
            maxUseCount = cmd.maxUseCount ;
            isPrivate = cmd.isPrivate ;
            properties = cmd.properties ;
            owner = profile.owner ;
            createdAt = profile.createdAt ;
            updatedAt = now ;
        }
    };

    public let listingEq = Types.idEq;


}
