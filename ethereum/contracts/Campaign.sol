// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.7;
// Deploys instances of the campaign contract
// Cost of deployment is on the user
// Factory is deployed to the blockchain
contract CampaignFactory {
    // Addresses of all the deployed campaigns
    Campaign[] public deployedCampaigns;

// Deploys a new instance of a Campaign and stores the resulting addresses
    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
// Returns a list of all deployed campaigns
    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    // similar to a class
    struct Request {
        // Describes why the request is being created
        string description;
        // Amount of money the manager wants to send to the vendor
        uint value;
        // Address that the money will be sent to
        address payable recipient;
        // True is the request has already been processed (money sent)
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    // List of requests that the manager has created - Mapping of Request Strut
     mapping (uint => Request) requests;
    // Address of the person who is managing the campaign
    address public manager;
    // Minimum donation reqired to be a contributor or 'approver'
    uint public minimumContribution;
    // List of addresses for every person who donated money
    mapping(address => bool) public approvers;
    uint public approversCount;
    
    uint requestIndex = 0;
    
    uint public requestsCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    // Constructor function that sets the minimum contribtion and the address
   constructor(uint minimum, address creator) {
		manager = creator;
		minimumContribution = minimum;
	}
    // Called when someone wants to donate money to the campaign and become an 'approver'
    function contribute() public payable {
        // msg.value = amount in wei that has someone has sent
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }
// Called by the manager to create a new 'spending request'
    function createRequest(string memory description, uint value, address payable recipient) public restricted {
        Request storage request = requests[requestIndex];

		request.description = description;
		request.recipient = recipient;
		request.value = value;
		request.complete = false;
		request.approvalCount = 0;

		requestIndex++;
		requestsCount++;
    }
// Called by each contributor to to approve a spending request
    function approveRequest(uint index) public {
        Request storage request = requests[index];
// Check that they have donated 
        require(approvers[msg.sender]);
        // Check that they have not voted before
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
// After a request had gotten enough approvals, the manager can call this to get money sent to the vendor
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
      uint, uint, uint, uint, address
      ) {
        return (
          minimumContribution,
          address(this).balance,
          requestsCount,
          approversCount,
          manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requestsCount;
    }
}