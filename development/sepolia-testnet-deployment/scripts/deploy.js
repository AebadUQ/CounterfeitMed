const { ethers } = require("hardhat");
const QRCode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const EC = require('elliptic').ec;

// Create a new elliptic curve instance
const ec = new EC('p256');

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const CounterfeitMed = await ethers.getContractFactory("CounterfeitMed");
    const counterfeitMed = await CounterfeitMed.deploy();
    await counterfeitMed.deployed();

    console.log("CounterfeitMed deployed to:", counterfeitMed.address);

    // Register a manufacturer and capture the returned ID
    const manufacturerTx = await counterfeitMed.registerManufacturer(
        "Bosh Manufacturer & Co", // Manufacturer name
        "RTAS22c",
        "LIC-9092",
        "This the Contact Information",
        "V!#haS7cUz-g"
    );
    const manufacturerReceipt = await manufacturerTx.wait();
    const manufacturerId = manufacturerReceipt.events[0].args.id;

    console.log("Manufacturer registered with ID:", manufacturerId);

    // Register a distributor and capture the returned ID
    const distributorTx = await counterfeitMed.registerDistributor(
        "Z Distributors", // Distributor name
        "SED521",
        "LIC-2F1",
        "This is the detail of distributor",
        "Aw@avrkkGTaxa"
    );
    const distributorReceipt = await distributorTx.wait();
    const distributorId = distributorReceipt.events[0].args.id;
    
    console.log("Distributor registered with ID:", distributorId);

    // Register a pharmacy and capture the returned ID
    const pharmacyTx = await counterfeitMed.registerDistributor(
        "Alshifa Pharmacy",
        "SH123", // Registration number
        "LIC-ASC", // License number
        "This is the detail of pharmacy", // Description
        "kkgCC9Taw@11" // Password
    );
    const pharmacyReceipt = await pharmacyTx.wait();
    const pharmacyId = pharmacyReceipt.events[0].args.id;

    console.log("Distributor registered with ID:", pharmacyId);

    // Register a medicine and wait for the transaction to be mined
    const medicineTx = await counterfeitMed.registerMedicine(
        manufacturerId, // Manufacturer ID returned from registration
        "Medicine Name",
        "Dosage Form",
        "Batch ID",
        ["Ingredient 1", "Ingredient 2"], // Ingredients array
        1234567890, // Expiry date
        100, // Price
        "Description"
    );
    const medicineReceipt = await medicineTx.wait(); // Wait for the transaction to be mined

    console.log("Medicine registered successfully.");
    
    // Extract medicine details from the event log
    const medicineEvent = medicineReceipt.events.find(event => event.event === 'MedicineConsoleLogged');
    const medicineDetails = medicineEvent.args.medicine;
    const medicineId = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
        ['bytes32', 'string', 'string'],
        [manufacturerId, medicineDetails.name, medicineDetails.batchId]
    ));

    console.log("Medicine details:", medicineDetails);

    // Generate ECC-256 hash of the medicine details
    const medicineData = JSON.stringify({
        name: medicineDetails.name,
        manufacturerId: manufacturerId,
        dosageForm: medicineDetails.dosageForm,
        batchId: medicineDetails.batchId,
        ingredients: medicineDetails.ingredients,
        expiryDate: medicineDetails.expiryDate.toString(),
        price: medicineDetails.price.toString(),
        description: medicineDetails.description,
    });
    const medicineKey = ec.keyFromPrivate(medicineData);
    const medicineHash = medicineKey.getPrivate().toString(16);

    console.log("ECC-256 Hash of medicine data:", medicineHash);

    console.log("=======================================================================")
    console.log("===================Distributor buying medicine=========================")

    console.log("=======================================================================")

    // Call the buyMedicine function to purchase the medicine
    const buyMedicineTx = await counterfeitMed.buyMedicine(
        distributorId, // Distributor ID
        manufacturerId, // Manufacturer ID
        medicineId // Medicine ID
    );
    const receipt = await buyMedicineTx.wait();
    
    const event = receipt.events.find(e => e.event === 'MedicinePurchased');
    if (event) {
        const medicineId = event.args.medicineId;
        const distributorId = event.args.distributorId;
        const manufacturerId = event.args.manufacturerId;
    
        console.log(`Medicine purchased. Medicine ID: ${medicineId}, Distributor ID: ${distributorId}, Manufacturer ID: ${manufacturerId}`);
    } else {
        console.log('Medicine purchase event not found in transaction receipt.');
    }

    console.log("Medicine purchased successfully.",buyMedicineTx);

    // Retrieve the updated medicine details
    const updatedMedicineDetails = await counterfeitMed.medicines(medicineId);
    
    console.log("Updated Medicine details:", updatedMedicineDetails);

    const qrData = JSON.stringify({
        name: updatedMedicineDetails.name,
        manufacturerId: updatedMedicineDetails.manufacturerId,
        dosageForm: updatedMedicineDetails.dosageForm,
        batchId: updatedMedicineDetails.batchId,
        ingredients: updatedMedicineDetails.ingredients,
        expiryDate: updatedMedicineDetails.expiryDate.toString(),
        price: updatedMedicineDetails.price.toString(),
        description: updatedMedicineDetails.description,
        hash: medicineHash // Include the ECC-256 hash in the QR data
    });
    console.log("QR DATA:", qrData);

    qrcodeTerminal.generate(qrData, { small: true });

    QRCode.toFile('medicine_qr.png', qrData, function (err) {
        if (err) {
            console.error('Error generating QR code:', err);
            throw err;
        }
        console.log('QR code generated and saved as medicine_qr.png');
    });
    // medhistory sd
    console.log("=============================== medicineId",medicineId);
    const medHistory = await counterfeitMed.getMedicineHistory(medicineId);

    console.log("Medicine purchase history:", medHistory);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });



// async function main() {
//     const [deployer] = await ethers.getSigners();
//     console.log("Deploying contracts with the account:", deployer.address);
    
//     const ManufacturerRegistry = await ethers.getContractFactory("CounterfeitMed");
//     const manufacturerRegistry = await ManufacturerRegistry.deploy();
//     await manufacturerRegistry.deployed();

//     // const MedicinerRegistry = await ethers.getContractFactory("MedicinerRegistry");
//     // const medicinerRegistry = await MedicinerRegistry.deploy();
//     // await medicinerRegistry.deployed();

//     console.log("CounterfeitMed deployed to:", manufacturerRegistry.address);
//     // console.log("MedicinerRegistry deployed to:", medicinerRegistry.address);
// }

// main()
//     .then(() => process.exit(0))
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     });

// async function main() {
//     const [deployer] = await ethers.getSigners();
//     console.log("Deploying contracts with the account:", deployer.address);
  
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, Hardhat!");
//     await greeter.deployed();
  
//     console.log("Greeter deployed to:", greeter.address);
//   }
  
//   main()
//     .then(() => process.exit(0))
//     .catch(error => {
//       console.error(error);
//       process.exit(1);
//     });
  