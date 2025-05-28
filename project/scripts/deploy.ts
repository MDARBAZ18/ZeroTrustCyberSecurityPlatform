import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ZeroTrustIAM = await ethers.getContractFactory("ZeroTrustIAM");
  console.log("Deploying ZeroTrustIAM...");
  
  const contract = await ZeroTrustIAM.deploy();
  await contract.waitForDeployment();
  
  console.log("ZeroTrustIAM deployed to:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 