
module {

    public type TokenId = Nat;

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
}