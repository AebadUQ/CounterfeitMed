// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRegistry {
    //black market
struct Batch {
    uint256 manufacturerId;
    string batchNumber;
    uint256 medicineCount;
        string medicineName;

}
struct Purchase {
    uint256 distributorId;
    uint256 manufacturerId;
    string medicineName;
    uint256 quantity;
    uint256 timestamp;
}

//////////////
    struct Manufacturer {
        string name;
        string businessRegistrationNumber;
        string manufacturingLicenseNumber;
        string contactInfo;
        string password;
        bool isVerified;
        uint256 id;
        bool isRegistered;
    }

    struct Medicine {
        string name;
        string manufacturerName;
        uint256 manufacturerId;
        string dosageForm;
        string batchId;
        string[] ingredients;
        uint256 approvedDate;
        uint256 expiryDate;
        uint256 price;
        bool isVerified;
        string description;
        bytes32 hash;
        uint256 distributorId;
    }

    struct Distributor {
        string name;
        string businessRegistrationNumber;
        string distributionLicenseNumber;
        string description;
        string password;
        uint256 id;
        bool isRegistered;
    }

    struct Pharmacy {
        string name;
        uint256 id;
        string password;
        string location;
        string businessRegistrationNumber;
        string pharmacyLicenseNumber;
        bool isRegistered;
    }

    mapping(uint256 => Manufacturer) public manufacturers;
    mapping(bytes32 => Medicine) public medicines;
    mapping(uint256 => Distributor) public distributors;
    mapping(uint256 => Pharmacy) public pharmacies;
    mapping(string => bool) private nameExists;
    //black amrker
mapping(bytes32 => Batch) public batches;
mapping(bytes32 => Purchase) public purchases;

    event ManufacturerRegistered(uint256 indexed id, string name);
    event MedicineAdded(bytes32 indexed id, string name);
    event DistributorRegistered(uint256 indexed id, string name);
    event PharmacyRegistered(uint256 indexed id, string name);
    event MedicineVerified(bytes32 indexed id);
    event MedicineBought(bytes32 indexed id, uint256 distributorId);
event BatchAdded(bytes32 indexed batchId, uint256 manufacturerId, string batchNumber, string medicineName, uint256 medicineCount);
//man 101158153085985367190363941582188680141929305896698907109404587682768144459855
//dis 83519765851320251634771334098356227393241699018150795618702668855930835857700
    function regulatoryBody(bytes32 _medicineId) public {
        require(medicines[_medicineId].expiryDate != 0, "Medicine with this ID does not exist");
        
        medicines[_medicineId].isVerified = true;
        
        emit MedicineVerified(_medicineId);
    }

  function buyMedicine(uint256 _distributorId, uint256 _manufacturerId, bytes32 _medicineHash) public {
    // require(distributors[_distributorId].isRegistered, "Distributor is not registered");
    require(manufacturers[_manufacturerId].isRegistered, "Manufacturer is not registered");

    // Generate the medicine ID using the same method as in addMedicine function
    bytes32 medicineId = keccak256(abi.encode(_manufacturerId, _medicineHash));

    // require(medicines[medicineId].expiryDate != 0, "Medicine with this ID does not exist");
    require(!medicines[medicineId].isVerified, "Medicine is already verified");
    require(medicines[medicineId].distributorId == 0, "Medicine is already bought");

    medicines[medicineId].distributorId = _distributorId;
    
    emit MedicineBought(medicineId, _distributorId);
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

    function registerManufacturer(string memory _name, string memory _businessRegistrationNumber, string memory _manufacturingLicenseNumber, string memory _contactInfo, string memory _password) public {
        require(!nameExists[_name], "Manufacturer with this name already exists");

        uint256 id = generateId(_name, _password);

        manufacturers[id] = Manufacturer(_name, _businessRegistrationNumber, _manufacturingLicenseNumber, _contactInfo, _password, false, id, true);
        nameExists[_name] = true;

        emit ManufacturerRegistered(id, _name);
    }

    function registerDistributor(string memory _name, string memory _businessRegistrationNumber, string memory _distributionLicenseNumber, string memory _description, string memory _password) public {
        require(!nameExists[_name], "Distributor with this name already exists");

        uint256 id = generateId(_name, _password);

        distributors[id] = Distributor(_name, _businessRegistrationNumber, _distributionLicenseNumber, _description, _password, id, true);
        nameExists[_name] = true;

        emit DistributorRegistered(id, _name);
    }

    function registerPharmacy(string memory _name, string memory _password, string memory _location, string memory _businessRegistrationNumber, string memory _pharmacyLicenseNumber) public {
        require(!nameExists[_name], "Pharmacy with this name already exists");

        uint256 id = generateId(_name, _password);

        pharmacies[id] = Pharmacy(_name, id, _password, _location, _businessRegistrationNumber, _pharmacyLicenseNumber, true);
        nameExists[_name] = true;

        emit PharmacyRegistered(id, _name);
    }

    function login(string memory _name, string memory _password) public view returns (uint256, string memory) {
        uint256 id = generateId(_name, _password);

        if (manufacturers[id].isRegistered) {
            return (id, "Manufacturer");
        } else if (distributors[id].isRegistered) {
            return (id, "Distributor");
        } else if (pharmacies[id].isRegistered) {
            return (id, "Pharmacy");
        } else {
            revert("Invalid credentials");
        }
    }
    
// man 101158153085985367190363941582188680141929305896698907109404587682768144459855
// dis 105916192638385026283994762624431566248626582840333187277714522336416716156888
// med 0xc8c6a1520d44a5206f4b2aa2324bf52a15ab50f62c662f35b84a97b6ad770d04
   function addMedicine(
    uint256 _manufacturerId,
    string memory _name,
    string memory _manufacturerName,
    string memory _dosageForm,
    string memory _batchId,
    string[] memory _ingredients,
    uint256 _expiryDate,
    uint256 _price,
    string memory _description
) public {
    require(manufacturers[_manufacturerId].isRegistered, "Manufacturer is not registered");
    
    // Generate the medicine ID using the same method as in buyMedicine function
    bytes32 medicineId = keccak256(abi.encode(_manufacturerId, _name, _batchId));

    require(medicines[medicineId].expiryDate == 0, "Medicine with this name and batch ID already exists");

    bytes32 hash = keccak256(abi.encode(
        _manufacturerId,
        _name,
        _manufacturerName,
        _dosageForm,
        _batchId,
        _ingredients,
        _expiryDate,
        _price,
        false,
        _description
    ));

    medicines[medicineId] = Medicine(
        _name,
        _manufacturerName,
        _manufacturerId,
        _dosageForm,
        _batchId,
        _ingredients,
        0,
        _expiryDate,
        _price,
        false,
        _description,
        hash,
        0
    );

    emit MedicineAdded(medicineId, _name);
}

    function generateId(string memory _name, string memory _password) private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_name, _password)));
    }
function bm_addBatch(uint256 _manufacturerId, string memory _batchNumber, string memory _medicineName, uint256 _medicineCount) public {
    require(manufacturers[_manufacturerId].isRegistered, "Manufacturer is not registered");

    bytes32 batchId = keccak256(abi.encode(_manufacturerId, _batchNumber, _medicineName));

    batches[batchId] = Batch({
        manufacturerId: _manufacturerId,
        batchNumber: _batchNumber,
        medicineName: _medicineName,
        medicineCount: _medicineCount
    });

    emit BatchAdded(batchId, _manufacturerId, _batchNumber, _medicineName, _medicineCount);
}

}