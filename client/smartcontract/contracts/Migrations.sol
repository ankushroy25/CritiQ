// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MoneyDistribution {
    struct AllDetails {
        string id;
        address owner;
        string name;
        string prodimg;
        string[] orderIDs;
        uint amt;
        uint min_review_count;
        string prod_Details;
        string company_name;
        bool typ;
        string status;
        uint nextAmount;
        uint reviewCount;
    }

    string[] public allProduct;
    string[] public finishedProduct;
    mapping(address => uint) public overallProfit;
    mapping(string => AllDetails) public products;
    mapping(string => uint) public moneyLeft;
    mapping(string => address[]) public reviewers;
    mapping(address => string[]) public ownproducts;
    mapping(string => string[]) public reviews;
    mapping(string => address[]) public prodAccess;
    address public owner;
    uint public ourBalance;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    receive() external payable {}

    event event1(string message);

    function NewProduct(
        string memory prodID,
        string memory prodimg,
        string memory name,
        bool t,
        string[] memory orderIDs,
        uint min_review_count,
        string memory prod_Details,
        string memory company_name
    ) public payable {        
        if (msg.value < 100) {
            emit event1("Insufficient amount");
            return;
        }

        uint amt = msg.value - 100;
        ourBalance += 100;
        payable(0xb4F10CF4303F864bC564FDd37b639FdC0842aD57).transfer(100);

        allProduct.push(prodID);
        moneyLeft[prodID] = amt;
        products[prodID] = AllDetails({
            id: prodID,
            owner: msg.sender,
            name: name,
            prodimg: prodimg,
            orderIDs: orderIDs,
            amt: amt,
            min_review_count: min_review_count,
            prod_Details: prod_Details,
            company_name: company_name,
            typ: t,
            status: "ongoing",
            nextAmount: 0,
            reviewCount: 0
        });

        uint x = min_review_count / 3;
        products[prodID].nextAmount = (amt / (x * 4)) * 2;
        
        ownproducts[msg.sender].push(prodID);
        prodAccess[prodID].push(msg.sender);

        emit event1("Product Created");
    }

    function NewReview(string memory orderID, string memory prodID, string memory review) public payable {
        if ((keccak256(abi.encodePacked(products[prodID].status)) == keccak256(abi.encodePacked("ongoing"))) && ((products[prodID].typ == false) || (products[prodID].typ == true && isOrderIDValid(orderID, prodID) == true))) {        
            if (hasReviewed(msg.sender, prodID)) {
                emit event1("Reviewer has already reviewed");
                return;
            }
            uint x = products[prodID].min_review_count / 3;
            uint y = products[prodID].amt / (x * 4);
            if (moneyLeft[prodID] < y || products[prodID].reviewCount >= 2 * x) {   
                endProduct(prodID);
                emit event1("Product has no money left");
                return;
            }
            reviews[prodID].push(review);
            reviewers[prodID].push(msg.sender);
            products[prodID].reviewCount ++;
            if (products[prodID].reviewCount < x) {
                payable(msg.sender).transfer(2 * y);
                overallProfit[msg.sender] += 2 * y;
                moneyLeft[prodID] -= 2 * y;
                if (products[prodID].reviewCount == x) {
                    products[prodID].nextAmount = y;
                }
                removeFromArray(products[prodID].orderIDs, orderID);
            } else if (products[prodID].reviewCount >= x && products[prodID].reviewCount < 2 * x) {
                payable(msg.sender).transfer(y);
                moneyLeft[prodID] -= y;
                overallProfit[msg.sender] += y;
                if (products[prodID].reviewCount == 2 * x || moneyLeft[prodID] < y) {
                    products[prodID].nextAmount = 0;
                    endProduct(prodID);
                }
                removeFromArray(products[prodID].orderIDs, orderID);
            }        
            emit event1("Review added");
        } else {
            emit event1("Product not found");
        }
    }
    function Refund(string memory prodID) public payable{
        require(compareStrings(products[prodID].status,"ongoing"), "Product is not ongoing");
        require(isProductOwner(prodID, msg.sender), "Caller is not the product owner");

        uint refundAmount = moneyLeft[prodID];
        moneyLeft[prodID] = 0;
        payable(msg.sender).transfer(refundAmount);
        endProduct(prodID);

        emit event1("Refunded the money");
    }

    function getProducts() public view returns (AllDetails[] memory) {
        uint totalLength = allProduct.length;
        AllDetails[] memory allProducts = new AllDetails[](totalLength);
        for (uint i = 0; i < allProduct.length; i++) {
            allProducts[i] = products[allProduct[i]];
        }
        return allProducts;
    }

    function getAllProductbyOwner() public view returns (AllDetails[] memory) {
        uint totalLength = ownproducts[msg.sender].length;
        AllDetails[] memory allProducts = new AllDetails[](totalLength);
        for (uint i = 0; i < ownproducts[msg.sender].length; i++) {
            allProducts[i] = products[ownproducts[msg.sender][i]];
        }

        return allProducts;
    }

    function getReview(string memory prodID, address addr) public view returns (string[] memory) {
        require(isProductOwner(prodID, addr), "Caller is not the product owner");
        return reviews[prodID];
    }

    function BuyReview(string memory prodID) public {
        uint amt= msg.value;
        if (amt < 2 * products[prodID].amt) {
            emit event1("Insufficient amount");
            return;
        }

        address adr = msg.sender;
        uint ourProf = amt / 3;
        uint ownerProf = amt / 3;
        uint eachProf = amt - ourProf- ownerProf;
        payable(products[prodID].owner).transfer(ownerProf);
        for (uint i = 0; i < reviewers[prodID].length; i++) {
            payable(reviewers[prodID][i]).transfer(eachProf / reviewers[prodID].length);
            overallProfit[reviewers[prodID][i]] += eachProf / reviewers[prodID].length;
        }

        ourBalance += ourProf;
        payable(owner).transfer(ourProf);

        prodAccess[prodID].push(adr);
        ownproducts[msg.sender].push(prodID);

        emit event1("Review bought");
    }

    function getProfit(address addr) public view returns (uint) {
        return overallProfit[addr];
    }

    function isOrderIDValid(string memory orderID, string memory prodID) internal view returns (bool) {
        string[] memory orderIDs = products[prodID].orderIDs;
        for (uint i = 0; i < orderIDs.length; i++) {
            if (compareStrings(orderIDs[i], orderID)) {
                return true;
            }
        }
        return false;
    }

    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function hasReviewed(address reviewer, string memory prodID) internal view returns (bool) {
        for (uint i = 0; i < reviewers[prodID].length; i++) {
            if (reviewers[prodID][i] == reviewer) {
                return true;
            }
        }
        return false;
    }

    function isProductOwner(string memory prodID, address addr) internal view returns (bool) {
        for (uint i = 0; i < prodAccess[prodID].length; i++) {
            if (prodAccess[prodID][i] == addr) {
                return true;
            }
        }
        return false;
    }

    function endProduct(string memory prodID) internal {
        products[prodID].status = "ended";
        products[prodID].nextAmount = 0;
    }

    function removeFromArray(string[] storage array, string memory value) internal {
        for (uint i = 0; i < array.length; i++) {
            if (compareStrings(array[i], value)) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }
}
