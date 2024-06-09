// const fs = require("fs");
// Import necessary modules
const express = require("express");
const hre = require("hardhat");
const bodyParser = require("body-parser");
const { keccak256 } = require("js-sha3");

const arr = [
  {
    _name: "Aebad",
    _businessRegistrationNumber: "12",
    _manufacturingLicenseNumber: "ss",
    _password: "abc.123",
    _contactInfo: "ss",
  },
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

function generateId(_name, _password) {
  const hash = keccak256(_name + _password);
  const id = BigInt("0x" + hash); // Convert the hash to a BigInt
  return id;
}
function generateMedId(_manfacturerId,_name, _batchId) {
    const hash = keccak256(_manfacturerId+ _name+_batchId );
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("running...");
  const PharmacyBlockchain = await ethers.getContractFactory("MedicalRegistry");
  const contract = await PharmacyBlockchain.deploy();
  await contract.waitForDeployment();
  return contract;
}
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
  
// Run the main function
main()
  .then((contract) => {
    // Create an instance of Express
    console.log(contract, "contract");

    const app = express();

    // Middleware to parse JSON bodies
    app.use(bodyParser.json());

    // Replace with your deployed contract address

    // Define a route for the POST API
    app.get("/register_manufacture", async (req, res) => {
      var name = generateRandomString(10);
      var password = "abc.123";
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

      // Send a response
      res.status(200).json({ message: "Data received successfully" });
    });
    app.get("/register_distributor", async (req, res) => {
        var name = generateRandomString(10);
        var password = "abc.123";
        console.log(name, "name");
        const tx = await contract.registerDistributor(
          name,
          "12",
          "ss",
          "asdasdasd",
          password
        );
        const response = await tx.wait();
        const id = generateId(name, password);
        const distributors = await contract.distributors(id);
        console.log(distributors, "distributors");
        console.log(id, "id");
        // const medTx = await contract.addMedicine(
        //   id,
        //   "medicine",
        //   name,
        //   medTemp?._dosageForm,
        //   medTemp?._batchId,
        //   medTemp?._ingredient,
        //   medTemp?._expiryDate,
        //   medTemp?._price,
        //   medTemp?._description
        // );
        // var medicineId = keccak256(id + name + medTemp?._batchId);
        // console.log(medicineId, "medicineId");
        //   const medicine = await contract.medicines(medicineId);
        // console.log(medicine, "medicine");
        // var hash = keccak256(
        //   id +
        //     "medicine" +
        //     name +
        //     medTemp?._dosageForm +
        //     medTemp?._batchId +
        //     medTemp?._ingredient +
        //     medTemp?._expiryDate +
        //     medTemp?._price +
        //     medTemp?._description
        // );
        // const hashId = BigInt("0x" + hash); // Convert the hash to a BigInt
  
        // console.log(hashId, "medId");
        //   await contract.regulatoryBody(hashId);
  
      //   await sleep(2500);
  
        // Extract data from request body
        // const { data } = req.body;
  
        // Do something with the data (e.g., save it to a database)
        // For demonstration purposes, let's just log it
        // console.log("Received data:", data);
  
        // Send a response
        res.status(200).json({ message: "Data received successfully" });
      });
      app.get("/register_medicine", async (req, res) => {
        var name = generateRandomString(10);
        var password = "abc.123";
        console.log(name, "name");
        const tx = await contract.registerManufacturer(
          name,
          "12",
          "ss",
          "asdasdasd",
          password
        );
        const response = await tx.wait();
        // abi.encode(_manufacturerId, _name, _batchId)

        const manufacturerId = generateId(name, password);
        // const distributors = await contract.distributors(id);
        // console.log(distributors, "distributors");
        // console.log(id, "id");

        const medTx = await contract.addMedicine(
            manufacturerId,
          "medicine",
          name,
          medTemp?._dosageForm,
          medTemp?._batchId,
          medTemp?._ingredient,
          medTemp?._expiryDate,
          medTemp?._price,
          medTemp?._description
        );
        console.log(medTx)
        const medResponce = await medTx.wait();

        // var medicineId = keccak256(manufacturerId + name + medTemp?._batchId);
        // console.log(medicineId, "medicineId");
        //   const medicine = await contract.medicines(medicineId);
        // console.log(medicine, "medicine");
        // var hash = keccak256(
        //   id +
        //     "medicine" +
        //     name +
        //     medTemp?._dosageForm +
        //     medTemp?._batchId +
        //     medTemp?._ingredient +
        //     medTemp?._expiryDate +
        //     medTemp?._price +
        //     medTemp?._description
        // );
        // const hashId = BigInt("0x" + hash); // Convert the hash to a BigInt
  
        // console.log(hashId, "medId");
        //   await contract.regulatoryBody(hashId);
  
      //   await sleep(2500);
  
        // Extract data from request body
        // const { data } = req.body;
  
        // Do something with the data (e.g., save it to a database)
        // For demonstration purposes, let's just log it
        // console.log("Received data:", data);
  
        // Send a response
        res.status(200).json({ message: "Data received successfully" });
      });

      app.get("/med_verification", async (req, res) => {
        var name = generateRandomString(10);
        var password = "abc.123";
        console.log(name, "name");
        const tx = await contract.registerManufacturer(
          name,
          "12",
          "ss",
          "asdasdasd",
          password
        );
        const response = await tx.wait();
        // abi.encode(_manufacturerId, _name, _batchId)

        const manufacturerId = generateId(name, password);
        // const distributors = await contract.distributors(id);
        // console.log(distributors, "distributors");
        // console.log(id, "id");
        const medTx = await contract.addMedicine(
            manufacturerId,
          "medicine",
          name,
          medTemp?._dosageForm,
          medTemp?._batchId,
          medTemp?._ingredient,
          medTemp?._expiryDate,
          medTemp?._price,
          medTemp?._description
        );
        console.log(medTx)
        const medResponce = await medTx.wait();
        
        // const medId =generateMedId(manufacturerId,name,medTemp?._batchId)
        const medIDs =await contract.getMed();
        
        // console.log("temp ",temp );
        // console.log("manufacturerId==============================================================================",manufacturerId);

        console.log("medId",medIDs);
        const verTx = await contract.regulatoryBody(medIDs)
        await verTx.wait()

        // var medicineId = keccak256(manufacturerId + name + medTemp?._batchId);
        // console.log(medicineId, "medicineId");
        //   const medicine = await contract.medicines(medicineId);
        // console.log(medicine, "medicine");
        // var hash = keccak256(
        //   id +
        //     "medicine" +
        //     name +
        //     medTemp?._dosageForm +
        //     medTemp?._batchId +
        //     medTemp?._ingredient +
        //     medTemp?._expiryDate +
        //     medTemp?._price +
        //     medTemp?._description
        // );
        // const hashId = BigInt("0x" + hash); // Convert the hash to a BigInt
  
        // console.log(hashId, "medId");
        //   await contract.regulatoryBody(hashId);
  
      //   await sleep(2500);
  
        // Extract data from request body
        // const { data } = req.body;
  
        // Do something with the data (e.g., save it to a database)
        // For demonstration purposes, let's just log it
        // console.log("Received data:", data);
  
        // Send a response
        res.status(200).json({ message: "Data received successfully" });
      });
    // app.get("/register_medicine", async (req, res) => {
    //   await sleep(5000);
    //   return "success";
    // });

    // app.get("/verify_medicine", async (req, res) => {
    //   await sleep(7000);
    //   return "success";
    // });

    // app.get("/buy_medicine_distributor", async (req, res) => {
    //   await sleep(6000);
    //   return "success";
    // });

    // app.get("/buy_medicine_pharmacy", async (req, res) => {
    //   await sleep(6000);
    //   return "success";
    // });

    // app.get("/trace_medicine", async (req, res) => {
    //   await sleep(4000);
    //   return "success";
    // });

    // app.get("/detect_counterfiet", async (req, res) => {
    //   await sleep(10000);
    //   return "success";
    // });

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });