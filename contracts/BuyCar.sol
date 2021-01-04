pragma solidity ^0.5.0;

contract BuyCar
{
    //VARIABLES

//define an array of 9 buyers for the marketplace and their corresponding contract address

//define sellers for the marketplace

//car marketplace administrator


address[9] public buyers; 

mapping(address => address) public buyerscontractadd;


    
mapping(address => bool) public sellers;


address public administrator;


//MODIFIERS

    //check if buyer is a seller 
	
	//behavioral pattern state machine modifier to check if the address is a seller address


    modifier isSeller { require(sellers[msg.sender]); _; }

  
  modifier isSellerAddress(address _address) { require(sellers[_address]); _; }

//CONSTRUCTOR : code is run once when contract is created

     
    constructor() public {

        administrator = msg.sender;

    }

   //FUNCTIONS

    //1. Buy a car :

    function buy(uint carId) payable public returns (uint)
    {
        require(carId >= 0 && carId <= 8);
        buyers[carId] = msg.sender;

        return carId;
    }

    //2. Retrieve the Buyers : View does not modify state of current contract

    function getBuyers() public view returns (address[9] memory)
    {
        return buyers;
    }

   // 3. Release a car :

    function release(uint carId) public returns (uint)
    {
        require(carId >= 0 && carId <= 8);

        if (buyers[carId] == msg.sender)
        {
            buyers[carId] = address(0);
        }
        return carId;
    }



   
 }