
import Hash "mo:base/Hash";
import Nat64"mo:base/Nat64";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

module {

    public type Property<K, V> = {
        key: K;
        value: V;
    };

    // 删除请求值对象
    public type DeleteCommand = {
        id: Id;
    };

    // 获取请求值对象 
    public type DetailQuery = {
        id: Id;
    };

    // 分页查询值对象
    public type PageQuery = {
        pageSize: Nat;
        pageNum: Nat;
    };

    public type Id = Nat64;

    public type RichText = {
        format: Text;   /// 文本内容格式,例如: text, html, markdown
        content: Text;
    };

    public func richTextToJson(rt: RichText) : Text {
         "{\"content\": \"" # rt.content # "\", \"format\": \"" # rt.format # "\"}"
    };

    public type Timestamp = Int;
    
    public type UserPrincipal = Principal;

    public let idEq = Nat64.equal;
    public let idHash = Hash.hash;

    public let userEq = Principal.equal;
    public let userHash = Principal.hash;

    public type IdOwner = {
        id: Id;
        owner: UserPrincipal;
    };
    
    /// 错误类型定义
    public type Error = {
        #idDuplicated;  // id重复
        #notFound;      
        #alreadyExisted;
        #unauthorized;  // 没有授权
        #unknownError;
        #listingNotEnable; // listing 不可用
        #listingNotFound;   
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
}