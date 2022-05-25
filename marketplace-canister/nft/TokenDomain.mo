
import Types "../base/Types";

module {

    public type TokenId = Nat;

    public type Result<X, Y> = Types.Result<X, Y>;

    public type TokenProfile = {
        id: TokenId;    //uuid of the token
        name: Text;
        desc: Text;
        originalAddress: Principal; // the 
        parents: [TokenId]; 
        createdAt: Int;
        startTime: ?Int;       // 有效期起始时间
        endTime: ?Int;       // 有效期结束时间
        isDerivative: Bool;     // 是否衍生 NFT
        //type:                //衍生nft的类型
        properties: [Property];  
        data: ?TokenData;
        operator: ?Principal;
        owner: Principal;
    };

    public type Property = {
        name: Text;
        value: Text;
    };

    public type Location = {
        #InCanister: Blob; // NFT encoded data
        #AssetCanister: (Principal, Blob); // asset canister id, storage key
        #IPFS: Text; // IPFS content hash
        #Web: Text; // URL pointing to the file
    };

    public type TokenData = {
        filetype: Text; // jpg, png, mp4, etc.
        location: Location;
    };

    public type NftLendCommand = {
        listingId: Nat64;
        properties: [Property];
    };
    
    public type MetadataResult = Result<MetadataDesc, ApiError>;

    public type MetadataDesc = [MetadataPart];

    public type MetadataPart = {
        purpose: MetadataPurpose;
        key_val_data: [MetadataKeyVal];
        data: Blob;
    };

    public type MetadataPurpose = {
        #Preview;
        #Rendered;
    };
    
    public type MetadataKeyVal = {
        key: Text;
        val: MetadataVal;
    };

    public type MetadataVal = {
        #TextContent : Text;
        #BlobContent : Blob;
        #NatContent : Nat;
        #Nat8Content: Nat8;
        #Nat16Content: Nat16;
        #Nat32Content: Nat32;
        #Nat64Content: Nat64;
    };

    public type ApiError = {
        #Unauthorized;
        #InvalidTokenId;
        #ZeroAddress;
        #Other;
    };
    
    public type NFTActor = actor {
        getTokenIdsForUserDip721 : shared Principal -> async [Nat64];     
        getMetadataDip721 : shared Nat64 -> async MetadataResult;
    }
}