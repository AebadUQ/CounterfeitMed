async function main() {
    const [deployer] = await ethers.getSigners();
    const ManufacturerRegistry = await ethers.getContractFactory("ManufacturerRegistry");
    const manufacturerRegistry =
    await 
    ManufacturerRegistry.attach("0xA553586b61c1090BB9Ae102e2Fa327C733192D3F");
    
    const tx = await manufacturerRegistry.registerManufacturer(
        "PharmaCorp",
        "BRN123456",
        "MLN654321",
        "info@pharmacorp.com",
        "password123"
    );
    
    await tx.wait();
    console.log("Manufacturer registered successfully");
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
