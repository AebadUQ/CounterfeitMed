// SPDX-License-Identifier: MIT
pragma solidity >=0.7.3;
pragma experimental ABIEncoderV2;



contract CounterfeitMed {
    struct Manufacturer {
        string name;
        string businessRegistrationNumber;
        string manufacturingLicenseNumber;
        string contactInfo;
        string password;
        bool isVerified;
        bytes32 id;
        bool isRegistered;
    }

    struct Medicine {
        string name;
        bytes32 manufacturerId;
        string dosageForm;
        string batchId;
        string[] ingredients;
        uint256 approvedDate;
        uint256 expiryDate;
        uint256 price;
        bool isVerified;
        string description;
        bytes32 distributorId;
    }
struct MedicineRegistration {
    string name;
    bytes32 manufacturerId;
    string dosageForm;
    string batchId;
    string[] ingredients;
    uint256 approvedDate;
    uint256 expiryDate;
    uint256 price;
    bool isVerified;
    string description;
}

    struct Distributor {
        string name;
        string businessRegistrationNumber;
        string distributionLicenseNumber;
        string description;
        string password;
        bytes32 id;
        bool isRegistered;
    }
        struct Pharmacy {
        string name;
        bytes32 id;
        string password;
        string location;
        string businessRegistrationNumber;
        string pharmacyLicenseNumber;
        bool isRegistered;
    }

    mapping(bytes32 => Manufacturer) public manufacturers;
    mapping(bytes32 => Medicine) public medicines;
    mapping(string => bool) private nameExists;
            mapping(bytes32 => Distributor) public distributors;
                mapping(bytes32 => Pharmacy) public pharmacies;


    event ManufacturerRegistered(bytes32 indexed id, string name);
    event ManufacturerVerified(bytes32 indexed id, string name);
    event MedicineRegistered(bytes32 indexed id, string name);
    event MedicineVerified(bytes32 indexed id);
    event DistributorRegistered(bytes32 indexed id, string name);
    event PharmacyRegistered(bytes32 indexed id, string name);
    event MedicineBought(bytes32 indexed id, bytes32 distributorId);
event MedicinePurchased(bytes32 indexed medicineId, bytes32 distributorId, bytes32 manufacturerId);


event MedicineConsoleLogged(MedicineRegistration medicine);

    function registerManufacturer(
    string memory _name,
    string memory _businessRegistrationNumber,
    string memory _manufacturingLicenseNumber,
    string memory _contactInfo,
    string memory _password
) public returns (bytes32) {
    require(!nameExists[_name], "Manufacturer with this name already exists");

    bytes32 id = generateId(_name, _password);

    manufacturers[id] = Manufacturer(
        _name,
        _businessRegistrationNumber,
        _manufacturingLicenseNumber,
        _contactInfo,
        _password,
        false,  // Initially not verified
        id,
        true
    );

    nameExists[_name] = true;

    emit ManufacturerRegistered(id, _name);

    return id;
}

    function verifyManufacturer(bytes32 _id) public {
        require(manufacturers[_id].isRegistered, "Manufacturer is not registered");

        manufacturers[_id].isVerified = true;

        emit ManufacturerVerified(_id, manufacturers[_id].name);
    }

    
function registerMedicine(
    bytes32 _manufacturerId,
    string memory _name,
    string memory _dosageForm,
    string memory _batchId,
    string[] memory _ingredients,
    uint256 _expiryDate,
    uint256 _price,
    string memory _description
) public returns (MedicineRegistration memory) {
    require(manufacturers[_manufacturerId].isRegistered, "Manufacturer is not registered");

    bytes32 medicineId = keccak256(abi.encode(_manufacturerId, _name, _batchId));
    require(medicines[medicineId].expiryDate == 0, "Medicine with this name and batch ID already exists");

    MedicineRegistration memory newMedicine = MedicineRegistration({
        name: _name,
        manufacturerId: _manufacturerId,
        dosageForm: _dosageForm,
        batchId: _batchId,
        ingredients: _ingredients,
        approvedDate: 0, // Initially not approved
        expiryDate: _expiryDate,
        price: _price,
        isVerified: false, // Initially not verified
        description: _description
    });

    medicines[medicineId] = Medicine({
        name: _name,
        manufacturerId: _manufacturerId,
        dosageForm: _dosageForm,
        batchId: _batchId,
        ingredients: _ingredients,
        approvedDate: 0, // Initially not approved
        expiryDate: _expiryDate,
        price: _price,
        isVerified: false, // Initially not verified
        description: _description,
        distributorId: 0x0
    });
    emit MedicineConsoleLogged(newMedicine);

    emit MedicineRegistered(medicineId, _name);

    return  newMedicine;
}

    function login(string memory _name, string memory _password) public view returns (bytes32, string memory) {
        bytes32 id = generateId(_name, _password);

        if (manufacturers[id].isRegistered) {
            return (id, "Manufacturer");
        } else {
            revert("Invalid credentials");
        }
    }

    function generateId(string memory _name, string memory _password) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _password));
    }
      function regulatoryBody(bytes32 _medicineId) public {
        
        medicines[_medicineId].isVerified = true;
        
        emit MedicineVerified(_medicineId);
    }
    function buyMedicine(bytes32 _distributorId, bytes32 _manufacturerId, bytes32 _medicineHash) public {
    require(manufacturers[_manufacturerId].isRegistered, "Manufacturer is not registered");

    // Generate the medicine ID using the same method as in addMedicine function
    bytes32 medicineId = keccak256(abi.encode(_manufacturerId, _medicineHash));

    require(!medicines[medicineId].isVerified, "Medicine is already verified");
    require(medicines[medicineId].distributorId == 0x0, "Medicine is already bought");

    medicines[medicineId].distributorId = _distributorId;
    
    emit MedicinePurchased(medicineId, _distributorId, _manufacturerId);
}


    function registerDistributor(string memory _name, string memory _businessRegistrationNumber, string memory _distributionLicenseNumber, string memory _description, string memory _password) public {
        require(!nameExists[_name], "Distributor with this name already exists");

        bytes32 id = generateId(_name, _password);

        distributors[id] = Distributor(_name, _businessRegistrationNumber, _distributionLicenseNumber, _description, _password, id, true);
        nameExists[_name] = true;

        emit DistributorRegistered(id, _name);
    }
       function registerPharmacy(string memory _name, string memory _password, string memory _location, string memory _businessRegistrationNumber, string memory _pharmacyLicenseNumber) public {
        require(!nameExists[_name], "Pharmacy with this name already exists");

        bytes32 id = generateId(_name, _password);

        pharmacies[id] = Pharmacy(_name, id, _password, _location, _businessRegistrationNumber, _pharmacyLicenseNumber, true);
        nameExists[_name] = true;

        emit PharmacyRegistered(id, _name);
    }
    

function getMedicineHistory(bytes32 _medicineHash) public view returns (
    string memory manufacturerName,
    string memory manufacturerBusinessRegistrationNumber,
    string memory manufacturerManufacturingLicenseNumber,
    string memory manufacturerContactInfo,
    string memory distributorName,
    string memory distributorBusinessRegistrationNumber,
    string memory distributorDistributionLicenseNumber,
    string memory distributorDescription,
    uint256 approvedDate,
    uint256 expiryDate,
    uint256 price
) {
    bytes32 medicineId = _medicineHash;
    Medicine memory medicine = medicines[medicineId];

    require(medicine.expiryDate != 0, "Medicine with this hash does not exist");
    require(manufacturers[medicine.manufacturerId].isRegistered, "Manufacturer is not registered");
    require(distributors[medicine.distributorId].isRegistered, "Distributor is not registered");

    // Retrieve manufacturer data
    Manufacturer memory manufacturer = manufacturers[medicine.manufacturerId];

    // Retrieve distributor data
    Distributor memory distributor = distributors[medicine.distributorId];

    return (
        manufacturer.name,
        manufacturer.businessRegistrationNumber,
        manufacturer.manufacturingLicenseNumber,
        manufacturer.contactInfo,
        distributor.name,
        distributor.businessRegistrationNumber,
        distributor.distributionLicenseNumber,
        distributor.description,
        medicine.approvedDate,
        medicine.expiryDate,
        medicine.price
    );
}
    
}