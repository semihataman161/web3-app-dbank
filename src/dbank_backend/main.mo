import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Float "mo:base/Float";

actor DBank {
  type Response = {
    statusCode : Nat;
    message : Text;
  };

  stable var balance : Float = 0;
  // balance := 0;

  stable var compoundAmount : Float = 0;
  stable var startTime = Time.now();

  // let id = 22658732656;

  // Debug.print(debug_show (balance));
  // Debug.print(debug_show (id));

  public func deposit(amount : Float) : async Response {
    if (Float.isNaN(amount)) {
      return {
        statusCode = 400;
        message = "Please enter a value to deposit money...";
      };
    };

    balance += amount;
    return { statusCode = 200; message = "Depositing is successful." };
  };

  public func withdraw(amount : Float) : async Response {
    if (Float.isNaN(amount)) {
      return {
        statusCode = 400;
        message = "Please enter a value to withdraw money...";
      };
    };

    if (amount > balance) {
      return {
        statusCode = 403;
        message = "Insufficient balance...";
      };
    };

    balance -= amount;
    return { statusCode = 200; message = "Withdrawing is successful." };
  };

  public query func getBalance() : async Float {
    return balance;
  };

  public func startCompound(amount : Float) : async Response {
    if (Float.isNaN(amount)) {
      return {
        statusCode = 400;
        message = "Please enter a value to compound money...";
      };
    };

    if (amount > balance) {
      return {
        statusCode = 403;
        message = "Insufficient balance...";
      };
    };

    compoundAmount := amount;
    balance -= amount;
    startTime := Time.now();
    return { statusCode = 200; message = "Compounding started successfully." };
  };

  public func endCompound() : async Response {
    if (compoundAmount == 0) {
      return {
        statusCode = 400;
        message = "Please first start compounding process...";
      };
    };

    let endTime = Time.now();
    let timeElapsedInSeconds = (endTime - startTime) / 1000000000;
    balance := compoundAmount * (1.01 ** Float.fromInt(timeElapsedInSeconds));

    startTime := Time.now();
    compoundAmount := 0;
    return { statusCode = 200; message = "Compounding ended successfully." };
  };
};
