// const fs = require("fs");

const express = require("express");
const hre = require("hardhat");
const bodyParser = require("body-parser");
const { keccak256 } = require("js-sha3");
const nodes = [
  "0xc6B68207A55AD3A1e410eb36e4aEF65052ff3C32",
  "0x1a6F726b238A4390Aa13691D5bfF61EC4fFF1b1C",
  "0x21Cf6f83E67A49CBA7d2c5ADaf8fFf337D851E46",
  "0x447E445e5D86c4ed8FE3F17B7f33e7D9D19e54Bd",
  "0x026F309756d80847C3D6EFE2386f51144424F0f1",
  "0x7B0a23141e0d5c05e2Ce82301418DA3Aa76fDA72",
  "0x8fB3b2744B8849bEd5be4DC0D8D3c4f3c37c1fF4",
  "0x17853D7597e64a4957E467f9f16568e833047944",
  "0x6DA1C84f41F951adFE57f0A1907A8D01c8cb32cb",
];
const medicine = [
  {
    _name: "Panadol",
    _ingredient: ["a", "b"],
    _batchId: "123",
    _dosageForm: "abc",
    _pharmacueticalClass: "temp",
    _companyName: "Bosh",
    _expiryDate: "20-12-2024",
    _price: "aa",
    _manfacturerId: 1,
    _description: "lorem ipsum",
  },
];
function normalizeData(value) {
  return value > 1 ? 1 : value < 0 ? 0 : value;
}
const arr = [
  {
    _name: "Aebad",
    _businessRegistrationNumber: "12",
    _manufacturingLicenseNumber: "ss",
    _password: "abc.123",
    _contactInfo: "ss",
  },
];
function generateId(_name, _password) {
  const hash = keccak256(_name + _password);
  const id = BigInt("0x" + hash); // Convert the hash to a BigInt
  return id;
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateRandomString(length) {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// const medicine = [
//   {
//     _name: "Panadol",
//     _ingredient: ["a", "b"],
//     _batchId: "123",
//     _dosageForm: "abc",
//     _pharmacueticalClass: "temp",
//     _companyName: "Bosh",
//     _expiryDate: "20-12-2024",
//     _price: "aa",
//     _manfacturerId: 1,
//     _description: "lorem ipsum",
//   },
// ];

async function main() {
  console.log("running...");
  const PharmacyBlockchain = await ethers.getContractFactory("MedicalRegistry");
  const contract = await PharmacyBlockchain.deploy();
  await contract.waitForDeployment();
  return contract;
}
async function main() {
  console.log("helloworld")
  // console.log(nodes, "nodes");
  const PharmacyBlockchain = await ethers.getContractFactory("MedicalRegistry");
  const contract = await PharmacyBlockchain.deploy();
  await contract.waitForDeployment();

  console.log("Contract deployed to:", contract);
  for (let i = 0; i < arr.length; i++) {

    start = new Date()
    const temp = arr[i];
    const medTemp = medicine[i];
    contract.registerAsManufacturer(
      temp?._name,
      temp?._businessRegistrationNumber,
      temp?._manufacturingLicenseNumber,
      temp?._contactInfo,
      temp?._password
    );
    contract.addMedicine(
      medTemp?._manfacturerId,
      medTemp?._name,
      medTemp?._manufacturingLicenseNumber,
      medTemp?._dosageForm,
      medTemp?._batchId,
      medTemp?._ingredient,
      medTemp?._expiryDate,
      medTemp?._price,
      medTemp?._description
    );
    contract.verifyMedicineByRegulatoryBody();
    end = new Date()
    execTime = end - start;
    console.log("Execution time: ",exec);

  // }
  // //   let csv = "index, fromAddress, toAddress, quantity, access, trust\n";
  // //   for (i = 0; i < 1000; i++) {
  // //     // var access = i < 60 ? true : false;
  // //     var access = Math.random() < 0.5;
  // //     var row = `${i + 1} , ` + (await runTransaction(contract, i * 10, access));
  // //     csv += row;
  // //   }
  // //   fs.writeFileSync("data.csv", csv, "utf8", (err) => {
  // //     if (err) {
  // //       console.error("Error writing CSV file:", err);
  // //     } else {
  // //       console.log("CSV file created successfully");
  // //     }
  //   });
}
}

// Run the main function
main()
  .then((contract) =>{
    console.log(contract, "contract");

    const app = express();

    // Middleware to parse JSON bodies
    app.use(bodyParser.json());

    // Replace with your deployed contract address

    // Define a route for the POST API
    app.get("/register_manufacture", async (req, res) => {
      var name = generateRandomString(10);
      var password = "abc.123";
      console.log(name, "name");
      const medTemp = {
        _name: "Panadol",
        _ingredient: ["a", "b"],
        _batchId: "123",
        _dosageForm: "abc",
        _pharmacueticalClass: "temp",
        _companyName: "Bosh",
        _expiryDate: 123434234,
        _price: 12,
        _description: "lorem ipsum",
      };
      const tx = await contract.registerManufacturer(
        name,
        "12",
        "ss",
        "asdasdasd",
        password
      );
      const response = await tx.wait();
      const id = generateId(name, password);
      const manafacturer = await contract.manufacturers(id);
      console.log(manafacturer, "manafacturers");
      console.log(id, "id");
      const medTx = await contract.addMedicine(
        id,
        "medicine",
        name,
        medTemp?._dosageForm,
        medTemp?._batchId,
        medTemp?._ingredient,
        medTemp?._expiryDate,
        medTemp?._price,
        medTemp?._description
      );
      var medicineId = keccak256(id + name + medTemp?._batchId);
      console.log(medicineId, "medicineId");
      //   const medicine = await contract.medicines(medicineId);
      console.log(medicine, "medicine");
      var hash = keccak256(
        id +
          "medicine" +
          name +
          medTemp?._dosageForm +
          medTemp?._batchId +
          medTemp?._ingredient +
          medTemp?._expiryDate +
          medTemp?._price +
          medTemp?._description
      );
      const hashId = BigInt("0x" + hash); // Convert the hash to a BigInt

      console.log(hashId, "medId");
      //   await contract.regulatoryBody(hashId);

      await sleep(2500);

      // Extract data from request body
      const { data } = req.body;

      // Do something with the data (e.g., save it to a database)
      // For demonstration purposes, let's just log it
      console.log("Received data:", data);

      // Send a response
      res.status(200).json({ message: "Data received successfully" });
    });









  } 
  
  
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
