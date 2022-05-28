// This is a generated Motoko binding.
// Please use `import service "ic:canister_id"` instead to call canisters on the IC if possible.

module {
  public type Attribute = { key : Text; value : Text };
  public type Errors = { #Unauthorized; #TokenNotExist; #InvalidOperator };
  public type Location = {
    #Web : Text;
    #AssetCanister : (Principal, [Nat8]);
    #IPFS : Text;
    #InCanister : [Nat8];
  };
  public type Metadata = {
    owner : Principal;
    desc : Text;
    logo : Text;
    name : Text;
    totalSupply : Nat;
    cycles : Nat;
    symbol : Text;
  };
  public type MintResult = { #Ok : (Nat, Nat); #Err : Errors };
  public type NFToken = actor {
    approve : shared (Nat, Principal) -> async TxReceipt;
    balanceOf : shared query Principal -> async Nat;
    batchMint : shared (Principal, [?TokenMetadata]) -> async MintResult;
    batchTransferFrom : shared (Principal, Principal, [Nat]) -> async TxReceipt;
    burn : shared Nat -> async TxReceipt;
    desc : shared query () -> async Text;
    getAllTokens : shared query () -> async [TokenInfoExt];
    getMetadata : shared query () -> async Metadata;
    getOperator : shared query Nat -> async Principal;
    getTokenInfo : shared query Nat -> async TokenInfoExt;
    getTransaction : shared query Nat -> async TxRecord;
    getTransactions : shared query (Nat, Nat) -> async [TxRecord];
    getUserInfo : shared query Principal -> async UserInfoExt;
    getUserTokens : shared query Principal -> async [TokenInfoExt];
    getUserTransactionAmount : shared query Principal -> async Nat;
    getUserTransactions : shared query (Principal, Nat, Nat) -> async [
        TxRecord
      ];
    historySize : shared query () -> async Nat;
    isApprovedForAll : shared query (Principal, Principal) -> async Bool;
    logo : shared query () -> async Text;
    mint : shared (Principal, ?TokenMetadata) -> async MintResult;
    name : shared query () -> async Text;
    ownerOf : shared query Nat -> async Principal;
    setApprovalForAll : shared (Principal, Bool) -> async TxReceipt;
    setOwner : shared Principal -> async Principal;
    setTokenMetadata : shared (Nat, TokenMetadata) -> async TxReceipt;
    symbol : shared query () -> async Text;
    totalSupply : shared query () -> async Nat;
    transfer : shared (Principal, Nat) -> async TxReceipt;
    transferFrom : shared (Principal, Principal, Nat) -> async TxReceipt;
  };
  public type Operation = {
    #transferFrom;
    #burn;
    #approveAll;
    #mint : ?TokenMetadata__1;
    #approve;
    #setMetadata;
    #transfer;
    #revokeAll;
  };
  public type Record = { #metadata : ?TokenMetadata__1; #user : Principal };
  public type Time = Int;
  public type TokenInfoExt = {
    owner : Principal;
    metadata : ?TokenMetadata__1;
    operator : ?Principal;
    timestamp : Time;
    index : Nat;
  };
  public type TokenMetadata = {
    filetype : Text;
    attributes : [Attribute];
    location : Location;
  };
  public type TokenMetadata__1 = {
    filetype : Text;
    attributes : [Attribute];
    location : Location;
  };
  public type TxReceipt = { #Ok : Nat; #Err : Errors };
  public type TxRecord = {
    op : Operation;
    to : Record;
    tokenIndex : ?Nat;
    from : Record;
    timestamp : Time;
    caller : Principal;
    index : Nat;
  };
  public type UserInfoExt = {
    allowedTokens : [Nat];
    tokens : [Nat];
    operators : [Principal];
    allowedBy : [Principal];
  };
  public type Self = (Text, Text, Text, Text, Principal) -> async NFToken
}
