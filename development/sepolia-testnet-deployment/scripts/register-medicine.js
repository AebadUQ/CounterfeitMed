async function main() {
    const [deployer] = await ethers.getSigners();
    const ManufacturerRegistry = await ethers.getContractFactory("MedicinerRegistry");
    const manufacturerRegistry = await ManufacturerRegistry.attach("0xA553586b61c1090BB9Ae102e2Fa327C733192D3F");

    // Assuming the manufacturer is already registered, replace with actual manufacturer ID
    const manufacturerId = '0x64315a0ae309c979ef59a2a70d353dde8a3ebbc057a2d293c03d4071712a0e31'; 

    const tx = await manufacturerRegistry.registerMedicine(
        manufacturerId,
        "Aspirin",
        "Tablet",
        "BATCH001",
        ["Acetylsalicylic Acid"],
        Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 1 year from now
        100,
        "Pain reliever"
    );

    await tx.wait();
    console.log("Medicine registered successfully");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
