import Blob "mo:base/Blob";
import Nat "mo:base/Nat";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";

module {
  public type NonFungibleToken = {
    logo: LogoResult;
    name: Text;
    symbol: Text;
    maxLimit : Nat64;
  };

  public type ApiError = {
    #Unauthorized;
    #InvalidTokenId;
    #ZeroAddress;
    #Other;
  };

  public type Result<S, E> = {
    #Ok : S;
    #Err : E;
  };

  public type OwnerResult = Result<Principal, ApiError>;
  public type TxReceipt = Result<Nat, ApiError>;
  
  public type TransactionId = Nat;
  public type TokenId = Nat64;

  public type InterfaceId = {
    #Approval;
    #TransactionHistory;
    #Mint;
    #Burn;
    #TransferNotification;
  };

  public type LogoResult = {
    logo_type: Text;
    data: Text;
  };

  public type MetadataResult = Result<Nft, ApiError>;

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
  public type Nft = {
    id: TokenId;
    owner: Principal;
    approved: ?Principal;

    // originalAddress: Principal; todo, put into properties
    //parents: [TokenId]; todo, put into properties
    createdAt: Int;
    startTime: ?Int;       // 有效期起始时间
    endTime: ?Int;       // 有效期结束时间
    //isDerivative: Bool;

    properties: [Property];  
    data: ?TokenData;
  };
  




  public type MintReceipt = Result<MintReceiptPart, ApiError>;

  public type MintReceiptPart = {
    token_id: TokenId;
    id: Nat;
  };
};
