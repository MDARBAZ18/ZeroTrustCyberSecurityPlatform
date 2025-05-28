const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ZeroTrustIAM = await hre.ethers.getContractFactory("ZeroTrustIAM");
  console.log("Deploying ZeroTrustIAM...");
  
  const contract = await ZeroTrustIAM.deploy();
  await contract.waitForDeployment();
  
  const deployedAddress = await contract.getAddress();
  console.log("ZeroTrustIAM deployed to:", deployedAddress);
  
  // Verify the contract has been deployed
  const deployedCode = await hre.ethers.provider.getCode(deployedAddress);
  console.log("Contract deployment verified:", deployedCode.length > 2);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 